from fastapi.testclient import TestClient
from uuid import uuid4
from datetime import datetime, timedelta


class TestChats:
    chat = {
        "name": "new_chat",
    }

    def test_create_chat(self, test_app: TestClient):
        response = test_app.post(
            url="/chats/create_chat/",
            json=self.chat,
        )
        data = response.json()
        self.chat_uuid = data["uuid"]
        assert response.status_code == 200

    def test_get_all_chats(self, test_app: TestClient):
        response = test_app.get(url="/chats/get_all/")
        assert response.status_code == 200

    def test_cant_add_message_in_fake_chat(self, test_app: TestClient):
        message = {
            "role": "user",
            "content": "Fake",
            "date": (datetime.now() + timedelta(minutes=1)).__str__(),
            "chat_uuid": uuid4().hex,
            "stopped": False,
        }
        response = test_app.put(
            url="/chats/add_message/",
            json=message,
        )
        assert response.status_code == 422

    def test_cant_update_fake_message(self, test_app: TestClient):
        message = {
            "uuid": uuid4().hex,
            "role": "user",
            "content": "Fake Updated",
            "stopped": False,
        }
        response = test_app.put(
            url="/chats/update_message/",
            json=message,
        )
        assert response.status_code == 422
