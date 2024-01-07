import fastapi
import langserve
from langchain_community.chat_models import ChatOpenAI

app = fastapi.FastAPI(
    title="next-python-langchain",
    version="1.0",
)

@app.get("/")
def root():
    return "Hello, world!"

@app.get("/ping")
def ping():
    return "pong"

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

langserve.add_routes(
    app,
    ChatOpenAI(),
    path="/chat",
)