from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from db.session import SessionLocal
from repositories.message_repository import MessageRepository
from repositories.user_repository import UserRepository
from schemas.chat import ChatMessage
from services.connection_manager import manager

router = APIRouter()


@router.websocket("/ws/{username}")
async def websocket_endpoint(
    websocket: WebSocket,
    username: str,
):
    username = username.strip()

    if not username:
        await websocket.close(code=4000)
        return

    # Reject a second connection for a username that's already online,
    if manager.is_online(username):
        await websocket.close(code=4001)
        return

    await manager.connect(username, websocket)

    db = SessionLocal()
    user_repo = UserRepository(db)
    message_repo = MessageRepository(db)

    # Make sure this user exists in the DB so messages can reference them.
    user_repo.get_or_create(username)

    try:
        while True:
            raw = await websocket.receive_json()

            try:
                payload = ChatMessage.model_validate(raw)
            except ValidationError:
                continue

            to_user = payload.to.strip()
            text = payload.message.strip()

            if not to_user or not text or to_user == username:
                continue

            sender = user_repo.get_or_create(username)
            receiver = user_repo.get_or_create(to_user)

            saved = message_repo.create(
                sender_id=sender.id,
                receiver_id=receiver.id,
                text=text,
            )

            outgoing = {
                "type": "message",
                "from": username,
                "to": to_user,
                "message": saved.message,
                "timestamp": saved.created_at.isoformat(),
            }

            # Deliver to the recipient (if online) and echo back to sender
            await manager.send_to(to_user, outgoing)
            await manager.send_to(username, outgoing)
    except WebSocketDisconnect:
        pass
    finally:
        db.close()
        await manager.disconnect(username)