from typing import Literal

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    priority: Literal["LOW", "MEDIUM", "HIGH"] = "MEDIUM"
    status: Literal["TODO", "IN_PROGRESS", "COMPLETED"] = "TODO"


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    priority: Literal["LOW", "MEDIUM", "HIGH"] | None = None
    status: Literal["TODO", "IN_PROGRESS", "COMPLETED"] | None = None
