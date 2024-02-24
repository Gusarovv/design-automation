from typing import Optional

from pydantic import BaseModel, Field


class User(BaseModel):
    email: str = Field(title='E-mail', description='A unique e-mail of a new user', max_length=120,
                       examples=['user123@mail.host.com'],
                       pattern=r"^[a-z0-9]+\@([a-z0-9]+.)+[a-z]+$")
    password: str = Field(title='Password', description='A password that user will be used to log in', min_length=4)
    firstName: str = Field(title='First name', description='The first name of the user to be displayed')
    lastName: str = Field(title='Last name', description='The last name of the user to be displayed')


class AuthUser(BaseModel):
    email: str = Field(title='E-mail', description='A unique e-mail that identifies registered user', max_length=120,
                       examples=['user123@mail.host.com'],
                       pattern=r"^[a-z0-9]+\@([a-z0-9]+.)+[a-z]+$")
    password: str = Field(title='Password', description='A password that user will be used to log in', min_length=4)


class NewMessage(BaseModel):
    author: Optional[str] = Field(default=None, title='Name of author',
                                  description='Name that was passed with new message')
    message: str = Field(title='Message', description='Contents of new message, should not be empty', pattern=r'\S+')


class Message(BaseModel):
    id: int = Field(title='Message ID', description='Snowflake that identifies the message')
    author: str = Field(default=None, title='Name of author', description='Name that was passed with new message')
    message: str = Field(title='Message', description='Contents of new message, should not be empty', pattern=r'\S+')
    view: int = Field(title='Views', description='Amount of views that the message has')


class TokenWrapper(BaseModel):
    token: int = Field(title='Token', description='Bearer token that can be used after authorization')


class ViewsWrapper(BaseModel):
    count: int = Field(title='Views', description='Amount of views that the message has')
