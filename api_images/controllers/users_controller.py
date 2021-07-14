from api_images.models import user_model
from api_images.schemas import user_schema
from api_images.routes.auth import hash_password
from sqlalchemy.orm import Session

def buscar_usuario(db: Session, user_id: int, url: str):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()
    
    for image in user.images:
            image.path = f'{url}{image.path}'

    return user

def get_user_by_email(db: Session, email: str):
    user = db.query(user_model.User).filter(user_model.User.email == email).first()
    return user

def listar_usuarios(db: Session, url:str, skip: int = 0, limit: int = 100):
    users = db.query(user_model.User).offset(skip).limit(limit).all()

    for user in users:
        for image in user.images:
            image.path = f'{url}{image.path}'

    return users

def criar_usuario(db: Session, user: user_schema.UserCreate):
    db_user = user_model.User(email=user.email, hashed_password=hash_password(user.password), username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verificar_usuario(db: Session, user_id: int, url:str):
    user = db.query(user_model.User).filter(user_model.User.id == user_id).first()

    for image in user.images:
            image.path = f'{url}{image.path}'
            
    return user
