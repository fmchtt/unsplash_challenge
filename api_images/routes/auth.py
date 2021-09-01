from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestFormStrict
from api_images.controllers import users_controller
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from api_images.database import SessionLocal
from api_images.schemas import auth_scheme
import jwt
import datetime
import os

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/login')
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl='api/login', auto_error=False)
JWT_SECRET = os.environ["JWT_SECRET"]

def verify_password(plain_password: str, hashed_password: str):
  return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str):
  return pwd_context.hash(password)

def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
  user = users_controller.get_user_by_email(db, username)
  if not user:
    raise HTTPException(status_code=404, detail="Usuario nao encontrado!")
  elif not verify_password(password, user.hashed_password):
    raise HTTPException(status_code=401, detail="Senha incorreta!")
  else:
    return jwt.encode({"id": user.id, "email": user.email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)}, JWT_SECRET)

def decript_token(token: str):
  try:
    dec = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    return dec
  except (jwt.InvalidTokenError, jwt.InvalidSignatureError):
    raise HTTPException(401, detail="Token inválido!")
  except jwt.ExpiredSignatureError:
    raise HTTPException(401, detail="Token expirado!")


router = APIRouter()

@router.post("/login", response_model=auth_scheme.Token)
def token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  return {"access_token": authenticate_user(form_data.username, form_data.password, db), "token_type": "Bearer"}