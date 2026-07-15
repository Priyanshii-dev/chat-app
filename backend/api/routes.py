from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from repositories.message_repository import MessageRepository
from repositories.user_repository import UserRepository
from services.connection_manager import manager

router = APIRouter()


@router.get("/")
def root():
    return {"status": "ok"}


@router.get("/users")
def get_users():
    return {
        "users": list(manager.active_connections.keys())
    }


@router.get("/api/messages/{user1}/{user2}")
def get_conversation(
    user1: str,
    user2: str,
    db: Session = Depends(get_db),
):
    #Full message history between two usernames
    user_repo = UserRepository(db)
    u1 = user_repo.get_by_username(user1)
    u2 = user_repo.get_by_username(user2)

    if not u1 or not u2:
        return {"messages": []}

    messages = MessageRepository(db).get_conversation(u1.id, u2.id)

    return {
        "messages": [
            {
                "type": "message",
                "from": user1 if m.sender_id == u1.id else user2,
                "to": user2 if m.sender_id == u1.id else user1,
                "message": m.message,
                "timestamp": m.created_at.isoformat(),
            }
            for m in messages
        ]
    }