from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from api_images.models.images_model import association_table_likes

from api_images.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), unique=True, index=True)
    username = Column(String(50))
    hashed_password = Column(Text)
    avatar_url = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    images = relationship("Images", back_populates="owner", cascade='all, delete')
    liked = relationship("Images", secondary=association_table_likes, back_populates="likes", cascade='all, delete')
