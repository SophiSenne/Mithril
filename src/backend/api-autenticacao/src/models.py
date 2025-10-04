import uuid
import enum
from sqlalchemy import Column, String, Boolean, TIMESTAMP, Date, Integer, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

# Enum nativo do Python
class WalletTypeEnum(str, enum.Enum):
    STANDARD = "STANDARD"
    CUSTODIAL = "CUSTODIAL"
    HARDWARE = "HARDWARE"

class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    cpf = Column(String(11), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    nome_completo = Column(String(255), nullable=False)
    telefone = Column(String(20))
    data_nascimento = Column(Date)
    criado_em = Column(TIMESTAMP, server_default=func.current_timestamp())
    atualizado_em = Column(TIMESTAMP, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    ativo = Column(Boolean, default=True)
    ultimo_acesso = Column(TIMESTAMP)

class Autenticacao(Base):
    __tablename__ = "autenticacao"
    
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    senha_hash = Column(String(255), nullable=False)
    biometria_token = Column(Text)
    device_id = Column(String(255))
    ultimo_login = Column(TIMESTAMP)
    tentativas_falhas = Column(Integer, default=0)
    bloqueado = Column(Boolean, default=False)
    bloqueado_ate = Column(TIMESTAMP)

class StellarWallet(Base):
    __tablename__ = "stellar_wallet"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    public_key = Column(String(56), unique=True, nullable=False)
    principal = Column(Boolean, default=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())
    ativo = Column(Boolean, default=True)
    wallet_type = Column(
        Enum(WalletTypeEnum, name="wallet_type_enum", native_enum=True)
    )
