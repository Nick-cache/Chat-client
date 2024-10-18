from functools import wraps
from fastapi import HTTPException


def to_http_exception(exceptions: dict[Exception, HTTPException]):
    def inner(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except Exception as exception:
                try:
                    raise exceptions[exception.__class__]
                except KeyError:
                    pass
                raise HTTPException(
                    status_code=500,
                    detail=exception.args,
                )

        return wrapper

    return inner
