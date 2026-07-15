from sqlalchemy.orm import Session

from models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> User | None:
        return (
            self.db.query(User)
            .filter(User.username == username)
            .first()
        )

    def get_or_create(self, username: str) -> User:
        user = self.get_by_username(username)
        if user:
            return user

        user = User(username=username)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user