from fastapi.testclient import TestClient
from uuid import uuid4
from datetime import datetime, timedelta


class TestChats:
    chat_uuid = uuid4().hex
    messages = [
        {
            "uuid": uuid4().hex,
            "role": "system",
            "content": "Lorem Ipsum",
            "date": datetime.now().__str__(),
            "chat_uuid": chat_uuid,
        },
        {
            "uuid": uuid4().hex,
            "role": "user",
            "content": "Lorem Ipsum sisdqwdfewfwfwqjwefpoiqwefqweifjoqwifjqwofjweijfowjfewojwefjweoifjwofjwofjwfwoo",
            "date": (datetime.now() + timedelta(minutes=1)).__str__(),
            "chat_uuid": chat_uuid,
        },
    ]
    chat = {
        "uuid": chat_uuid,
        "name": "new_chat",
        "tokens": 100,
        "messages": messages,
    }

    def test_create_chat(self, test_app: TestClient):
        response = test_app.post(
            url="/chats/create_chat/",
            json=self.chat,
        )
        assert response.status_code == 200

    def test_get_chat(self, test_app: TestClient):
        response = test_app.get(url=f"/chats/{self.chat_uuid}/")
        assert response.status_code == 200

    def test_get_all_chats(self, test_app: TestClient):
        response = test_app.get(url="/chats/get_all/")
        assert response.status_code == 200

    def test_add_messages_in_chat(self, test_app: TestClient):
        messages = [
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "New message",
                "date": datetime.now().__str__(),
                "chat_uuid": self.chat_uuid,
            },
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "New message",
                "date": (datetime.now() + timedelta(minutes=1)).__str__(),
                "chat_uuid": self.chat_uuid,
            },
        ]
        response = test_app.put(
            url="/chats/add_messages/",
            json=messages,
        )
        assert response.status_code == 200

    def test_cant_create_chat_with_fake_messages(self, test_app: TestClient):
        chat = self.chat
        chat["messages"] = [
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "New Fake",
                "date": datetime.now().__str__(),
                "chat_uuid": uuid4().hex,
            },
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "New Fake",
                "date": (datetime.now() + timedelta(minutes=1)).__str__(),
                "chat_uuid": uuid4().hex,
            },
        ]
        response = test_app.post(
            url="/chats/create_chat/",
            json=chat,
        )
        assert response.status_code == 422

    def test_cant_add_messages_in_fake_chat(self, test_app: TestClient):
        messages = [
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "Fake",
                "date": datetime.now().__str__(),
                "chat_uuid": uuid4().hex,
            },
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "Fake",
                "date": (datetime.now() + timedelta(minutes=1)).__str__(),
                "chat_uuid": uuid4().hex,
            },
        ]
        response = test_app.put(
            url="/chats/add_messages/",
            json=messages,
        )
        assert response.status_code == 422

    def test_cant_update_fake_messages(self, test_app: TestClient):
        messages = [
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "Fake Updated",
                "date": datetime.now().__str__(),
                "chat_uuid": uuid4().hex,
            },
            {
                "uuid": uuid4().hex,
                "role": "user",
                "content": "Fake Updated",
                "date": (datetime.now() + timedelta(minutes=1)).__str__(),
                "chat_uuid": uuid4().hex,
            },
        ]
        response = test_app.put(
            url="/chats/update_messages/",
            json={"messages": messages},
        )
        assert response.status_code == 422
