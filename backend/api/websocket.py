from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.connection_manager import manager
from utils.time import utc_now

router = APIRouter()


@router.websocket("/ws/{username}")
async def websocket_endpoint(
    websocket: WebSocket,
    username: str,
):
    await manager.connect(username, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            # Process the received message
    except WebSocketDisconnect:
        manager.disconnect(username)