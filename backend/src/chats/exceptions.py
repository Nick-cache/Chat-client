from fastapi import HTTPException

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import StaleDataError

INVALID_PAYLOAD = HTTPException(
    status_code=422,
    detail="Invalid payload",
)

CHAT_EXCEPTIONS = {
    IntegrityError: INVALID_PAYLOAD,
    StaleDataError: INVALID_PAYLOAD,
}
