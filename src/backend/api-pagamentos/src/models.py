import uuid
from sqlalchemy import (
    Column, String, Enum, DECIMAL, JSON, TIMESTAMP, ForeignKey, BIGINT
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


# ==== ENUMS ====
class StatusTransacaoEnum(str, enum.Enum):
    PENDENTE = "PENDENTE"
    CONFIRMADA = "CONFIRMADA"
    FALHA = "FALHA"


class TipoPixEnum(str, enum.Enum):
    ENTRADA = "ENTRADA"
    SAIDA = "SAIDA"


class StatusPixEnum(str, enum.Enum):
    PENDENTE = "PENDENTE"
    CONCLUIDA = "CONCLUIDA"
    FALHA = "FALHA"


# ==== MODELOS ====
class TransacaoStellar(Base):
    __tablename__ = "transacao_stellar"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stellar_tx_hash = Column(String(255), unique=True, nullable=False)
    usuario_origem_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id"))
    usuario_destino_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id"))
    conta_origem = Column(String(56), nullable=False)
    conta_destino = Column(String(56), nullable=False)
    valor = Column(DECIMAL(15, 2), nullable=False)
    tipo = Column(String(50), nullable=False)  # assumindo tipo_transacao_enum já criado
    status = Column(Enum(StatusTransacaoEnum), default=StatusTransacaoEnum.PENDENTE)
    metadados = Column(JSONB)
    smart_contract_id = Column(UUID(as_uuid=True), ForeignKey("smart_contract.id"))
    submetido_em = Column(TIMESTAMP, server_default=func.now())
    confirmado_em = Column(TIMESTAMP)
    ledger_sequence = Column(BIGINT)


class MovimentacaoFinanceira(Base):
    __tablename__ = "movimentacao_financeira"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    origem_id = Column(UUID(as_uuid=True))
    destino_id = Column(UUID(as_uuid=True))
    tipo = Column(String(50), nullable=False)
    valor = Column(DECIMAL(15, 2), nullable=False)
    descricao = Column(String)
    criado_em = Column(TIMESTAMP, server_default=func.now())


class TransacaoPix(Base):
    __tablename__ = "transacao_pix"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    transacao_stellar_id = Column(UUID(as_uuid=True), ForeignKey("transacao_stellar.id"))
    pix_id = Column(String(255), unique=True, nullable=False)
    valor = Column(DECIMAL(15, 2), nullable=False)
    tipo = Column(Enum(TipoPixEnum), nullable=False)
    chave_pix = Column(String(255))
    status = Column(Enum(StatusPixEnum), default=StatusPixEnum.PENDENTE)
    criado_em = Column(TIMESTAMP, server_default=func.now())


class ConversaoCambial(Base):
    __tablename__ = "conversao_cambial"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    par_moeda = Column(String(20), nullable=False)
    taxa_conversao = Column(DECIMAL(15, 8), nullable=False)
    valor_origem = Column(DECIMAL(15, 2), nullable=False)
    valor_destino = Column(DECIMAL(15, 2), nullable=False)
    stellar_tx_id = Column(String(255))
    executado_em = Column(TIMESTAMP, server_default=func.now())


class FeeConfig(Base):
    __tablename__ = "fee_config"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo = Column(String(50), unique=True, nullable=False)
    percentual = Column(DECIMAL(5, 4))
    valor_fixo = Column(DECIMAL(15, 2))
    atualizado_em = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
