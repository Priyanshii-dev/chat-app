from fastapi import APIRouter
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