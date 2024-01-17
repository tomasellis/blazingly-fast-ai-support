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
from typing import List
from pydantic import BaseModel, RootModel

import langserve
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from pprint import pprint
app = fastapi.FastAPI(
    title="next-python-langchain",
    version="1.0",
)


class Message(BaseModel):
    role: str
    content: str

class ChatHistoryField(BaseModel):
    chat_history: List[Message]

class ChatHistory(RootModel):
    root: ChatHistoryField



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


# Make chains
# RETRIEVAL CHAIN

# REQUEST TO DB = lala
TEMPLATE = """{input}"""

prompt = ChatPromptTemplate.from_template(TEMPLATE)

model = ChatOpenAI(request_timeout=500)

output_parser = StrOutputParser()

chain = prompt | model | output_parser


langserve.add_routes(
    app,
    chain,
    path="/chat",
)



