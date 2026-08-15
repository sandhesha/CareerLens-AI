from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"],
)


class UserSettings(BaseModel):
    name: str = ""
    email: str = ""
    careerGoal: str = "AI/ML Engineer"
    location: str = "India"
    workType: str = "Any"
    jobNotifications: bool = True
    interviewNotifications: bool = True
    darkMode: bool = True


# Temporary server-side storage
# Later we can replace this with PostgreSQL.
settings_store = UserSettings()


@router.get("")
async def get_settings():
    return settings_store.model_dump()


@router.post("")
async def save_settings(settings: UserSettings):
    global settings_store

    settings_store = settings

    return {
        "success": True,
        **settings.model_dump(),
    }