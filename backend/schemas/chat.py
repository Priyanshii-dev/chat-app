from pydantic import BaseModel


class ChatMessage(BaseModel):
    to: str
    message: str


class OutgoingMessage(BaseModel):
    type: str
    from_user: str
    to: str
    message: str
    timestamp: str