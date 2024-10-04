from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import StaleDataError
from fastapi import HTTPException

INVALID_PAYLOAD = HTTPException(
    status_code=422,
    detail="Invalid payload",
)

CHAT_EXCEPTIONS = {
    IntegrityError: INVALID_PAYLOAD,
    StaleDataError: INVALID_PAYLOAD,
}
