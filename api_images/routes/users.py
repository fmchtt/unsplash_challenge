from fastapi import HTTPException, APIRouter, Depends
from typing import List
from api_images.controllers import users_controller
from api_images.schemas import user_schema
from api_images.routes.auth import decript_token, oauth2_scheme
from sqlalchemy.orm import Session
from api_images.database import SessionLocal

router = APIRouter()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[user_schema.User])
def listar_usuarios(skip: int = 0, limit: int = 100, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_dec = decript_token(token)
    users = users_controller.listar_usuarios(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}/", response_model=user_schema.User)
def buscar_usuario(user_id: int, db: Session = Depends(get_db)):
    db_user = users_controller.buscar_usuario(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado!")
    return db_user


@router.post("/", response_model=user_schema.User, status_code=201)
def criar_usuario(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = users_controller.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já registrado!")
    return users_controller.criar_usuario(db, user)

@router.get('/me', response_model=user_schema.User)
def verificar_usuario_logado(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decript_token(token).get('id')
    return users_controller.verificar_usuario(db, user_id)