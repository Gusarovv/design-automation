import os
from json import load, dump
from typing import Dict, Optional, List

from models import Message, User, NewMessage
from util import snowflake_provider, expire_after_day


class DataStorage:
    def __init__(self, db_file):
        self._json_path = db_file
        self._messages: Dict[int, Message] = {}
        self._users: Dict[str, User] = {}
        self._tokens: Dict[int, str] = {}
        self.init()

    def init(self):
        if not os.path.isfile(self._json_path):
            return

        file_data = load(open(file=self._json_path, mode='r', encoding='utf-8'))

        for message_id, message_model in file_data['messages'].items():
            self._messages[message_id] = Message(**message_model)
        for user_id, user_model in file_data['users'].items():
            self._users[user_id] = User(**user_model)

    def save(self):
        messages = {message_id: message.dict() for message_id, message in self._messages.items()}
        users = {user_email: user.dict() for user_email, user in self._users.items()}

        save_data = {'messages': messages, 'users': users}
        dump(save_data, open(file=self._json_path, mode='w', encoding='utf-8'))

    ### User related methods

    def add_user(self, user: User) -> None:
        self._users[user.email] = user

    def find_user(self, email: str) -> Optional[User]:
        if email not in self._users: return
        return self._users[email]

    def has_email(self, email: str) -> bool:
        return email in self._users

    ### Authentication related methods

    def new_token(self, user: User) -> int:
        new_token = snowflake_provider.generate()
        self._tokens[new_token] = user.email
        return new_token

    def is_authenticated(self, token: int) -> bool:
        if token not in self._tokens:
            return False
        return token >= expire_after_day()

    def owner(self, token: int) -> str:
        return self._tokens[token]

    ### Message related methods

    def add_message(self, base_message: NewMessage, token: int) -> Message:
        if not base_message.author:
            user = self._users[self.owner(token)]
            base_message.author = f'{user.firstName} {user.lastName}'
        message_id = snowflake_provider.generate()
        message_model = Message(id=message_id, view=0, **base_message.dict())
        self._messages[message_id] = message_model
        return message_model

    def find_message(self, message_id: int) -> Optional[Message]:
        if message_id not in self._messages:
            return None
        return self._messages[message_id]

    def list_messages(self) -> List[Message]:
        messages = list(self._messages.values())
        messages.sort(key=lambda message: message.view, reverse=True)
        return messages

    def add_view(self, message_id: int) -> int:
        if message_id not in self._messages:
            return 0
        self._messages[message_id].view += 1
        return self._messages[message_id].view
