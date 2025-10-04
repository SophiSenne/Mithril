from pydantic import BaseModel, EmailStr, validator, ConfigDict, constr, Field
from typing import Optional, List
from datetime import datetime, date
import uuid
from enum import Enum


class WalletTypeEnum(str, Enum):
    STANDARD = "STANDARD"
    CUSTODIAL = "CUSTODIAL"
    HARDWARE = "HARDWARE"


# Schemas para Usuario
class UsuarioBase(BaseModel):
    cpf: str
    email: EmailStr
    nome_completo: str
    telefone: Optional[str] = None
    data_nascimento: Optional[date] = None

    @validator('cpf')
    def validate_cpf(cls, v):
        if len(v) != 11 or not v.isdigit():
            raise ValueError('CPF deve conter exatamente 11 dígitos')
        return v


class UsuarioCreate(UsuarioBase):
    senha: str


class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome_completo: Optional[str] = None
    telefone: Optional[str] = None
    data_nascimento: Optional[date] = None
    ativo: Optional[bool] = None


class UsuarioResponse(UsuarioBase):
    id: uuid.UUID
    criado_em: datetime
    atualizado_em: datetime
    ativo: bool
    ultimo_acesso: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Schemas para Autenticacao
class AutenticacaoBase(BaseModel):
    device_id: Optional[str] = None
    biometria_token: Optional[str] = None


class AutenticacaoCreate(AutenticacaoBase):
    usuario_id: uuid.UUID
    senha: str


class AutenticacaoResponse(AutenticacaoBase):
    id: uuid.UUID
    usuario_id: uuid.UUID
    ultimo_login: Optional[datetime] = None
    tentativas_falhas: int
    bloqueado: bool
    bloqueado_ate: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    cpf: str
    senha: str
    device_id: Optional[str] = None


# Schemas para StellarWallet
class StellarWalletBase(BaseModel):
    usuario_id: uuid.UUID
    public_key: constr(min_length=56, max_length=56)
    wallet_type: WalletTypeEnum
    principal: Optional[bool] = False
    ativo: Optional[bool] = True


class StellarWalletCreate(StellarWalletBase):
    pass


class StellarWalletUpdate(BaseModel):
    principal: Optional[bool]
    ativo: Optional[bool]


class StellarWalletOut(StellarWalletBase):
    id: uuid.UUID
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class StellarWalletResponse(StellarWalletBase):
    id: uuid.UUID
    usuario_id: uuid.UUID
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


# Schema para resposta com relacionamentos
class UsuarioComWallets(UsuarioResponse):
    wallets: List[StellarWalletResponse] = Field(default_factory=list)
