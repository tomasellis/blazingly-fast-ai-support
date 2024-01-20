""" import fastapi
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
) """

import fastapi
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError, HTTPException

from typing import List
from pydantic import BaseModel

import langserve
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

app = fastapi.FastAPI(
    title="next-python-langchain",
    version="1.0",

)
""" 

class Message(BaseModel):
    role: str
    content: str

class ChatHistoryField(BaseModel):
    chat_history: List[Message]

class ChatHistory(RootModel):
    root: ChatHistoryField
 """


"""
{
        chat_history: parsed_messages,
      }
"""


@app.get("/")
def root():
    return "Hello, world!"

@app.get("/ping")
def ping():
    return "pong"

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc):
    print(f"OMG! An HTTP error!: {repr(exc)}")
    return await http_exception_handler(request, exc)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"OMG! The client sent invalid data!: {exc}")
    return await request_validation_exception_handler(request, exc)
# Make chains
# RETRIEVAL CHAIN

# REQUEST TO DB = lala
TEMPLATE = """{input}"""
prompt = ChatPromptTemplate.from_template(TEMPLATE)

model = ChatOpenAI(timeout=1000, max_retries=20, temperature=1, model="gpt-3.5-turbo-1106")

output_parser = StrOutputParser()

chain = prompt | model | output_parser


langserve.add_routes(
    app,
    chain,
    path="/chat",
)

