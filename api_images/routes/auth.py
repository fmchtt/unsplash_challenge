from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException
from api_images.controllers import users_controller
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from api_images.database import SessionLocal
import jwt

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
JWT_SECRET = "369427D1F63844402D16F508AE1F278EEE79A613FD669A4C5C353E0633A72A88"

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
    return jwt.encode({"id": user.id, "email": user.email}, JWT_SECRET)

def decript_token(token: str):
  dec = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
  return dec


router = APIRouter()

@router.post("/token")
def token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  return {"access_token": authenticate_user(form_data.username, form_data.password, db), "token_type": "Bearer"}