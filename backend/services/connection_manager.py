from typing import Dict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    def is_online(self, username: str) -> bool:
        return username in self.active_connections

    async def connect(self, username: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[username] = websocket
        await self.broadcast_user_list()

    async def disconnect(self, username: str):
        self.active_connections.pop(username, None)
        await self.broadcast_user_list()

    async def send_to(self, username: str, payload: dict):
        ws = self.active_connections.get(username)
        if ws:
            await ws.send_json(payload)

    async def broadcast_user_list(self):
        payload = {
            "type": "user_list",
            "users": list(self.active_connections.keys()),
        }

        for ws in list(self.active_connections.values()):
            await ws.send_json(payload)


manager = ConnectionManager()