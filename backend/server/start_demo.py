from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.server.connect_parts import connect_parts


@asynccontextmanager
async def start_demo(application: FastAPI):
    # كل تشغيل يبدي بنسخة يديدة، عشان التعديلات ما تغيّر بيانات التجربة الأصلية
    application.state.data = connect_parts()
    yield
    application.state.data = None
