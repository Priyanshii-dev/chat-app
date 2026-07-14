from fastapi import WebSocket
from typing import Dict


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket
        await self.broadcast_user_list()

    def disconnect(self, username: str):
        self.active_connections.pop(username, None)

    async def send_to(self, username: str, payload: dict):
        ws = self.active_connections.get(username)
        if ws:
            await ws.send_json(payload)

    async def broadcast_user_list(self):
        payload = {
            "type": "user_list",
            "users": list(self.active_connections.keys()),
        }

        for ws in self.active_connections.values():
            await ws.send_json(payload)


manager = ConnectionManager()