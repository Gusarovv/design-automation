from time import time_ns

import bcrypt

from config import password_encoding, NANOS_IN_MILLISECOND, MILLIS_IN_DAY
from models import User, AuthUser


def millis_now():
    return time_ns() // NANOS_IN_MILLISECOND


class SnowflakeProvider:
    def __init__(self, process_id=1):
        self._time_bits = 50
        self._process_bits = 4
        self._serial_bits = 10

        self._time_mod = 1 << self._time_bits

        self._process_id = process_id
        self._last_time = 0
        self._serial = 0

    def snowflake_of(self, time_millis: int) -> int:
        return ((time_millis + self._time_mod) % self._time_mod) << (self._process_bits + self._serial_bits)

    def generate(self) -> int:
        time_ms = millis_now()

        if time_ms == self._last_time:
            self._serial += 1
        else:
            self._last_time = time_ms
            self._serial = 0

        snowflake = self.snowflake_of(time_ms)
        snowflake += self._process_id << self._serial_bits
        snowflake += self._serial

        return snowflake


snowflake_provider = SnowflakeProvider()


def hash_password(user: User) -> User:
    password_bytes = user.password.encode(password_encoding)
    hash_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    hash_str = hash_bytes.decode(password_encoding)
    user.password = hash_str
    return user


def authenticate(user: User, auth_user: AuthUser) -> bool:
    password_bytes = user.password.encode(password_encoding)
    test_bytes = auth_user.password.encode(password_encoding)
    return bcrypt.checkpw(test_bytes, password_bytes)


def expire_after_day() -> int:
    time_ms = millis_now()
    time_ms -= MILLIS_IN_DAY
    return snowflake_provider.snowflake_of(time_ms)
