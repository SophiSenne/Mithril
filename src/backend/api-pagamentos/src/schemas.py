from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import Optional, Any
from app.models import StatusTransacaoEnum, TipoPixEnum, StatusPixEnum


# ============= TRANSACAO STELLAR =============
class TransacaoStellarBase(BaseModel):
    stellar_tx_hash: str
    conta_origem: str
    conta_destino: str
    valor: Decimal
    tipo: str
    status: Optional[StatusTransacaoEnum] = StatusTransacaoEnum.PENDENTE
    metadados: Optional[Any] = None


class TransacaoStellarCreate(TransacaoStellarBase):
    usuario_origem_id: Optional[UUID]
    usuario_destino_id: Optional[UUID]
    smart_contract_id: Optional[UUID]


class TransacaoStellarOut(TransacaoStellarBase):
    id: UUID
    submetido_em: datetime

    class Config:
        orm_mode = True


# ============= MOVIMENTACAO FINANCEIRA =============
class MovimentacaoFinanceiraBase(BaseModel):
    usuario_id: UUID
    tipo: str
    valor: Decimal
    descricao: Optional[str] = None


class MovimentacaoFinanceiraCreate(MovimentacaoFinanceiraBase):
    origem_id: Optional[UUID]
    destino_id: Optional[UUID]


class MovimentacaoFinanceiraOut(MovimentacaoFinanceiraBase):
    id: UUID
    criado_em: datetime

    class Config:
        orm_mode = True


# ============= TRANSACAO PIX =============
class TransacaoPixBase(BaseModel):
    usuario_id: UUID
    pix_id: str
    valor: Decimal
    tipo: TipoPixEnum
    chave_pix: Optional[str]
    status: Optional[StatusPixEnum] = StatusPixEnum.PENDENTE


class TransacaoPixCreate(TransacaoPixBase):
    transacao_stellar_id: Optional[UUID]


class TransacaoPixOut(TransacaoPixBase):
    id: UUID
    criado_em: datetime

    class Config:
        orm_mode = True


# ============= CONVERSAO CAMBIAL =============
class ConversaoCambialBase(BaseModel):
    usuario_id: UUID
    par_moeda: str
    taxa_conversao: Decimal
    valor_origem: Decimal
    valor_destino: Decimal
    stellar_tx_id: Optional[str]


class ConversaoCambialCreate(ConversaoCambialBase):
    pass


class ConversaoCambialOut(ConversaoCambialBase):
    id: UUID
    executado_em: datetime

    class Config:
        orm_mode = True


# ============= FEE CONFIG =============
class FeeConfigBase(BaseModel):
    tipo: str
    percentual: Optional[Decimal]
    valor_fixo: Optional[Decimal]


class FeeConfigCreate(FeeConfigBase):
    pass


class FeeConfigOut(FeeConfigBase):
    id: UUID
    atualizado_em: datetime

    class Config:
        orm_mode = True
