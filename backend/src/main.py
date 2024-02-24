import sys
from contextlib import asynccontextmanager
from re import fullmatch
from typing import Annotated, List

import uvicorn
from fastapi import FastAPI, HTTPException, Header, Path, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, RedirectResponse

from config import json_data_path, cors_params
from models import User, AuthUser, Message, NewMessage, TokenWrapper, ViewsWrapper
from storage import DataStorage
from util import authenticate, hash_password

storage = DataStorage(json_data_path)


@asynccontextmanager
async def lifespan(fastapi_application: FastAPI):
    # Application Startup
    yield
    storage.save()
    print(f'INFO:\t Database was saved into {json_data_path}', file=sys.stderr)


app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, **cors_params)


def authorize(authorization: str) -> int:
    matched = fullmatch(r'Bearer (\d+)', authorization)
    if not matched:
        raise HTTPException(status_code=400, detail='Bearer authorization required')
    token = int(matched.group(1))
    if not storage.is_authenticated(token):
        raise HTTPException(status_code=401, detail='Bad authorization token')
    return token


@app.get('/', description='Redirects to /docs page')
def docs():
    return RedirectResponse('/docs')


@app.post('/auth/register')
def new_user(user_form: User):
    if storage.has_email(user_form.email):
        raise HTTPException(status_code=409, detail='User with this email has already been registered')
    storage.add_user(hash_password(user_form))
    return Response(status_code=status.HTTP_200_OK)


@app.post('/auth/login')
def new_token(user_auth: AuthUser) -> TokenWrapper:
    user = storage.find_user(user_auth.email)
    if not user:
        raise HTTPException(status_code=400, detail='User with this email is not registered')
    if not authenticate(user, user_auth):
        raise HTTPException(status_code=400, detail='Invalid credentials')
    return TokenWrapper(token=storage.new_token(user))


@app.get('/messages')
def list_messages(authorization: Annotated[str, Header()]) -> List[Message]:
    authorize(authorization)
    return storage.list_messages()


@app.post('/messages', status_code=201)
def add_message(message: NewMessage, authorization: Annotated[str, Header()]) -> Message:
    token = authorize(authorization)
    return storage.add_message(message, token)


@app.get('/messages/{messageId}')
def get_message(message_id: Annotated[int, Path(alias='messageId')],
                authorization: Annotated[str, Header()]) -> Message:
    authorize(authorization)
    message = storage.find_message(message_id)
    if not message:
        raise HTTPException(status_code=404, detail='There was not message with specified ID')
    return message


@app.post('/messages/{messageId}/view', status_code=201)
def view_message(message_id: Annotated[int, Path(alias='messageId')],
                 authorization: Annotated[str, Header()]) -> ViewsWrapper:
    authorize(authorization)
    count = storage.add_view(message_id)
    if not count:
        raise HTTPException(status_code=404, detail='There was not message with specified ID')
    return ViewsWrapper(count=count)


if __name__ == '__main__':
    uvicorn.run('main:app', port=8080)
