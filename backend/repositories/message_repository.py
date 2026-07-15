from sqlalchemy.orm import Session
from models.message import Message
class MessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        sender_id: int,
        receiver_id: int,
        text: str,
    ) -> Message:
        message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=text,
        )

        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)

        return message

    def get_conversation(
        self,
        user1_id: int,
        user2_id: int,
    ):
        return (
            self.db.query(Message)
            .filter(
                (
                    (Message.sender_id == user1_id)
                    & (Message.receiver_id == user2_id)
                )
                | (
                    (Message.sender_id == user2_id)
                    & (Message.receiver_id == user1_id)
                )
            )
            .order_by(Message.created_at)
            .all()
        )