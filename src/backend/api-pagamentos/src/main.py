from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, String, Numeric, DateTime, Text, Enum as SQLEnum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
import enum

# Carrega variáveis do arquivo .env
load_dotenv()

# Configuração do banco de dados
DATABASE_URL = os.getenv("SUPABASE_URL")

# Configuração do SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enums
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

class TipoTransacaoEnum(str, enum.Enum):
    TRANSFERENCIA = "TRANSFERENCIA"
    PAGAMENTO_PARCELA = "PAGAMENTO_PARCELA"
    INVESTIMENTO = "INVESTIMENTO"
    RESGATE = "RESGATE"

class TipoMovimentacaoEnum(str, enum.Enum):
    DEPOSITO="DEPOSITO"
    SAQUE="SAQUE"
    INVESTIMENTO="INVESTIMENTO"
    PAGAMENTO="PAGAMENTO"
    TAXA="TAXA"
    RENDIMENTO="RENDIMENTO"

# Models
class TransacaoStellar(Base):
    __tablename__ = "transacao_stellar"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stellar_tx_hash = Column(String(255), unique=True, nullable=False)
    usuario_origem_id = Column(UUID(as_uuid=True))  # FK para usuario(id)
    usuario_destino_id = Column(UUID(as_uuid=True))  # FK para usuario(id)
    conta_origem = Column(String(56), nullable=False)
    conta_destino = Column(String(56), nullable=False)
    valor = Column(Numeric(15, 2), nullable=False)
    tipo = Column(SQLEnum(TipoTransacaoEnum), nullable=False)  # tipo_transacao_enum
    status = Column(SQLEnum(StatusTransacaoEnum), default=StatusTransacaoEnum.PENDENTE)
    metadados = Column(JSON)
    smart_contract_id = Column(UUID(as_uuid=True))  # FK para smart_contract(id)
    submetido_em = Column(DateTime, default=datetime.utcnow)
    confirmado_em = Column(DateTime)
    ledger_sequence = Column(Numeric(20, 0))

class MovimentacaoFinanceira(Base):
    __tablename__ = "movimentacao_financeira"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), nullable=False)  # FK para usuario(id)
    origem_id = Column(UUID(as_uuid=True))
    destino_id = Column(UUID(as_uuid=True))
    tipo = Column(SQLEnum(TipoMovimentacaoEnum), nullable=False)  # tipo_movimentacao_enum
    valor = Column(Numeric(15, 2), nullable=False)
    descricao = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)

class TransacaoPix(Base):
    __tablename__ = "transacao_pix"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), nullable=False)  # FK para usuario(id)
    transacao_stellar_id = Column(UUID(as_uuid=True))  # FK para transacao_stellar(id)
    pix_id = Column(String(255), unique=True, nullable=False)
    valor = Column(Numeric(15, 2), nullable=False)
    tipo = Column(SQLEnum(TipoPixEnum), nullable=False)
    chave_pix = Column(String(255))
    status = Column(SQLEnum(StatusPixEnum), default=StatusPixEnum.PENDENTE)
    criado_em = Column(DateTime, default=datetime.utcnow)

class ConversaoCambial(Base):
    __tablename__ = "conversao_cambial"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), nullable=False)  # FK para usuario(id)
    par_moeda = Column(String(20), nullable=False)
    taxa_conversao = Column(Numeric(15, 8), nullable=False)
    valor_origem = Column(Numeric(15, 2), nullable=False)
    valor_destino = Column(Numeric(15, 2), nullable=False)
    stellar_tx_id = Column(String(255))
    executado_em = Column(DateTime, default=datetime.utcnow)

class FeeConfig(Base):
    __tablename__ = "fee_config"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo = Column(String(50), unique=True, nullable=False)
    percentual = Column(Numeric(5, 4))
    valor_fixo = Column(Numeric(15, 2))
    atualizado_em = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class TransacaoStellarBase(BaseModel):
    stellar_tx_hash: str
    usuario_origem_id: Optional[uuid.UUID] = None
    usuario_destino_id: Optional[uuid.UUID] = None
    conta_origem: str
    conta_destino: str
    valor: float
    tipo: TipoTransacaoEnum
    metadados: Optional[dict] = None
    smart_contract_id: Optional[uuid.UUID] = None
    ledger_sequence: Optional[int] = None

class TransacaoStellarCreate(TransacaoStellarBase):
    pass

class TransacaoStellarResponse(TransacaoStellarBase):
    id: uuid.UUID
    status: StatusTransacaoEnum
    submetido_em: datetime
    confirmado_em: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class MovimentacaoFinanceiraBase(BaseModel):
    usuario_id: uuid.UUID
    origem_id: Optional[uuid.UUID] = None
    destino_id: Optional[uuid.UUID] = None
    tipo: TipoMovimentacaoEnum
    valor: float
    descricao: Optional[str] = None

class MovimentacaoFinanceiraCreate(MovimentacaoFinanceiraBase):
    pass

class MovimentacaoFinanceiraResponse(MovimentacaoFinanceiraBase):
    id: uuid.UUID
    criado_em: datetime
    
    class Config:
        from_attributes = True

class TransacaoPixBase(BaseModel):
    usuario_id: uuid.UUID
    transacao_stellar_id: Optional[uuid.UUID] = None
    pix_id: str
    valor: float
    tipo: TipoPixEnum
    chave_pix: Optional[str] = None

class TransacaoPixCreate(TransacaoPixBase):
    pass

class TransacaoPixResponse(TransacaoPixBase):
    id: uuid.UUID
    status: StatusPixEnum
    criado_em: datetime
    
    class Config:
        from_attributes = True

class ConversaoCambialBase(BaseModel):
    usuario_id: uuid.UUID
    par_moeda: str
    taxa_conversao: float
    valor_origem: float
    valor_destino: float
    stellar_tx_id: Optional[str] = None

class ConversaoCambialCreate(ConversaoCambialBase):
    pass

class ConversaoCambialResponse(ConversaoCambialBase):
    id: uuid.UUID
    executado_em: datetime
    
    class Config:
        from_attributes = True

class FeeConfigBase(BaseModel):
    tipo: str
    percentual: Optional[float] = None
    valor_fixo: Optional[float] = None

class FeeConfigCreate(FeeConfigBase):
    pass

class FeeConfigResponse(FeeConfigBase):
    id: uuid.UUID
    atualizado_em: datetime
    
    class Config:
        from_attributes = True

# FastAPI App
app = FastAPI(title="Sistema Financeiro API", version="1.0.0")

# Rotas para TransacaoStellar
@app.post("/transacoes-stellar/", response_model=TransacaoStellarResponse, status_code=status.HTTP_201_CREATED)
def criar_transacao_stellar(transacao: TransacaoStellarCreate, db: Session = Depends(get_db)):
    db_transacao = TransacaoStellar(**transacao.dict())
    db.add(db_transacao)
    db.commit()
    db.refresh(db_transacao)
    return db_transacao

@app.get("/transacoes-stellar/", response_model=List[TransacaoStellarResponse])
def listar_transacoes_stellar(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transacoes = db.query(TransacaoStellar).offset(skip).limit(limit).all()
    return transacoes

@app.get("/transacoes-stellar/{transacao_id}", response_model=TransacaoStellarResponse)
def obter_transacao_stellar(transacao_id: uuid.UUID, db: Session = Depends(get_db)):
    transacao = db.query(TransacaoStellar).filter(TransacaoStellar.id == transacao_id).first()
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação Stellar não encontrada")
    return transacao

@app.put("/transacoes-stellar/{transacao_id}/status", response_model=TransacaoStellarResponse)
def atualizar_status_transacao_stellar(transacao_id: uuid.UUID, status: StatusTransacaoEnum, db: Session = Depends(get_db)):
    transacao = db.query(TransacaoStellar).filter(TransacaoStellar.id == transacao_id).first()
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação Stellar não encontrada")
    
    transacao.status = status
    if status == StatusTransacaoEnum.CONFIRMADA:
        transacao.confirmado_em = datetime.utcnow()
    
    db.commit()
    db.refresh(transacao)
    return transacao

# Rotas para MovimentacaoFinanceira
@app.post("/movimentacoes-financeiras/", response_model=MovimentacaoFinanceiraResponse, status_code=status.HTTP_201_CREATED)
def criar_movimentacao_financeira(movimentacao: MovimentacaoFinanceiraCreate, db: Session = Depends(get_db)):
    db_movimentacao = MovimentacaoFinanceira(**movimentacao.dict())
    db.add(db_movimentacao)
    db.commit()
    db.refresh(db_movimentacao)
    return db_movimentacao

@app.get("/movimentacoes-financeiras/", response_model=List[MovimentacaoFinanceiraResponse])
def listar_movimentacoes_financeiras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    movimentacoes = db.query(MovimentacaoFinanceira).offset(skip).limit(limit).all()
    return movimentacoes

@app.get("/movimentacoes-financeiras/usuario/{usuario_id}", response_model=List[MovimentacaoFinanceiraResponse])
def listar_movimentacoes_por_usuario(usuario_id: uuid.UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    movimentacoes = db.query(MovimentacaoFinanceira).filter(
        MovimentacaoFinanceira.usuario_id == usuario_id
    ).offset(skip).limit(limit).all()
    return movimentacoes

# Rotas para TransacaoPix
@app.post("/transacoes-pix/", response_model=TransacaoPixResponse, status_code=status.HTTP_201_CREATED)
def criar_transacao_pix(transacao: TransacaoPixCreate, db: Session = Depends(get_db)):
    db_transacao = TransacaoPix(**transacao.dict())
    db.add(db_transacao)
    db.commit()
    db.refresh(db_transacao)
    return db_transacao

@app.get("/transacoes-pix/", response_model=List[TransacaoPixResponse])
def listar_transacoes_pix(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transacoes = db.query(TransacaoPix).offset(skip).limit(limit).all()
    return transacoes

@app.get("/transacoes-pix/{transacao_id}", response_model=TransacaoPixResponse)
def obter_transacao_pix(transacao_id: uuid.UUID, db: Session = Depends(get_db)):
    transacao = db.query(TransacaoPix).filter(TransacaoPix.id == transacao_id).first()
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação PIX não encontrada")
    return transacao

@app.put("/transacoes-pix/{transacao_id}/status", response_model=TransacaoPixResponse)
def atualizar_status_transacao_pix(transacao_id: uuid.UUID, status: StatusPixEnum, db: Session = Depends(get_db)):
    transacao = db.query(TransacaoPix).filter(TransacaoPix.id == transacao_id).first()
    if not transacao:
        raise HTTPException(status_code=404, detail="Transação PIX não encontrada")
    
    transacao.status = status
    db.commit()
    db.refresh(transacao)
    return transacao

# Rotas para ConversaoCambial
@app.post("/conversoes-cambiais/", response_model=ConversaoCambialResponse, status_code=status.HTTP_201_CREATED)
def criar_conversao_cambial(conversao: ConversaoCambialCreate, db: Session = Depends(get_db)):
    db_conversao = ConversaoCambial(**conversao.dict())
    db.add(db_conversao)
    db.commit()
    db.refresh(db_conversao)
    return db_conversao

@app.get("/conversoes-cambiais/", response_model=List[ConversaoCambialResponse])
def listar_conversoes_cambiais(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    conversoes = db.query(ConversaoCambial).offset(skip).limit(limit).all()
    return conversoes

@app.get("/conversoes-cambiais/usuario/{usuario_id}", response_model=List[ConversaoCambialResponse])
def listar_conversoes_por_usuario(usuario_id: uuid.UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    conversoes = db.query(ConversaoCambial).filter(
        ConversaoCambial.usuario_id == usuario_id
    ).offset(skip).limit(limit).all()
    return conversoes

# Rotas para FeeConfig
@app.post("/fee-config/", response_model=FeeConfigResponse, status_code=status.HTTP_201_CREATED)
def criar_fee_config(fee_config: FeeConfigCreate, db: Session = Depends(get_db)):
    db_fee_config = FeeConfig(**fee_config.dict())
    db.add(db_fee_config)
    db.commit()
    db.refresh(db_fee_config)
    return db_fee_config

@app.get("/fee-config/", response_model=List[FeeConfigResponse])
def listar_fee_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fee_configs = db.query(FeeConfig).offset(skip).limit(limit).all()
    return fee_configs

@app.get("/fee-config/{tipo}", response_model=FeeConfigResponse)
def obter_fee_config_por_tipo(tipo: str, db: Session = Depends(get_db)):
    fee_config = db.query(FeeConfig).filter(FeeConfig.tipo == tipo).first()
    if not fee_config:
        raise HTTPException(status_code=404, detail="Configuração de fee não encontrada")
    return fee_config

@app.put("/fee-config/{tipo}", response_model=FeeConfigResponse)
def atualizar_fee_config(tipo: str, fee_config: FeeConfigCreate, db: Session = Depends(get_db)):
    db_fee_config = db.query(FeeConfig).filter(FeeConfig.tipo == tipo).first()
    if not db_fee_config:
        raise HTTPException(status_code=404, detail="Configuração de fee não encontrada")
    
    for key, value in fee_config.dict().items():
        setattr(db_fee_config, key, value)
    
    db_fee_config.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(db_fee_config)
    return db_fee_config

# Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)