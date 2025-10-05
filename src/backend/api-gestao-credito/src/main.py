from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, String, Text, DateTime, Date, Numeric, Integer, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum as PyEnum
import uuid
import os
from dotenv import load_dotenv

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
class RedeBlockchainEnum(str, PyEnum):
    TESTNET = "TESTNET"
    MAINNET = "MAINNET"

class StatusContratoEnum(str, PyEnum):
    ATIVO = "ATIVO"
    QUITADO = "QUITADO"
    INADIMPLENTE = "INADIMPLENTE"
    CANCELADO = "CANCELADO"

class StatusParcelaEnum(str, PyEnum):
    PENDENTE = "PENDENTE"
    PAGO = "PAGO"
    ATRASADO = "ATRASADO"
    CANCELADO = "CANCELADO"

# Models SQLAlchemy
class SmartContract(Base):
    __tablename__ = "smart_contract"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id = Column(String(255), unique=True, nullable=False)
    nome = Column(String(255), nullable=False)
    descricao = Column(Text)
    rede = Column(Enum(RedeBlockchainEnum), nullable=False)
    endereco_deploy = Column(String(255))
    wasm_hash = Column(String(255))
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    contratos = relationship("Contrato", back_populates="smart_contract")

class Contrato(Base):
    __tablename__ = "contrato"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    solicitacao_credito_id = Column(UUID(as_uuid=True), nullable=False)
    oferta_investimento_id = Column(UUID(as_uuid=True), nullable=False)
    tomador_id = Column(UUID(as_uuid=True), nullable=False)
    investidor_id = Column(UUID(as_uuid=True), nullable=False)
    valor_total = Column(Numeric(15, 2), nullable=False)
    taxa_juros = Column(Numeric(5, 2), nullable=False)
    prazo_meses = Column(Integer, nullable=False)
    valor_parcela = Column(Numeric(15, 2), nullable=False)
    data_primeiro_vencimento = Column(Date, nullable=False)
    status = Column(Enum(StatusContratoEnum), default=StatusContratoEnum.ATIVO)
    documento_hash = Column(String(255))
    stellar_tx_id = Column(String(255))
    smart_contract_id = Column(UUID(as_uuid=True), ForeignKey('smart_contract.id'))
    assinado_em = Column(DateTime)
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    smart_contract = relationship("SmartContract", back_populates="contratos")
    parcelas = relationship("Parcela", back_populates="contrato", cascade="all, delete-orphan")

class Parcela(Base):
    __tablename__ = "parcela"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contrato_id = Column(UUID(as_uuid=True), ForeignKey('contrato.id', ondelete='CASCADE'), nullable=False)
    numero_parcela = Column(Integer, nullable=False)
    valor_principal = Column(Numeric(15, 2), nullable=False)
    valor_juros = Column(Numeric(15, 2), nullable=False)
    valor_total = Column(Numeric(15, 2), nullable=False)
    data_vencimento = Column(Date, nullable=False)
    data_pagamento = Column(Date)
    status = Column(Enum(StatusParcelaEnum), default=StatusParcelaEnum.PENDENTE)
    multa = Column(Numeric(15, 2), default=0.00)
    juros_atraso = Column(Numeric(15, 2), default=0.00)
    stellar_tx_id = Column(String(255))
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    contrato = relationship("Contrato", back_populates="parcelas")

# Pydantic Models
class SmartContractBase(BaseModel):
    contract_id: str
    nome: str
    descricao: Optional[str] = None
    rede: RedeBlockchainEnum
    endereco_deploy: Optional[str] = None
    wasm_hash: Optional[str] = None

class SmartContractCreate(SmartContractBase):
    pass

class SmartContractResponse(SmartContractBase):
    id: str
    criado_em: datetime
    
    class Config:
        from_attributes = True
    
    @validator('id', pre=True)
    def convert_uuid_to_str(cls, value):
        if isinstance(value, uuid.UUID):
            return str(value)
        return value

class ContratoBase(BaseModel):
    solicitacao_credito_id: str
    oferta_investimento_id: str
    tomador_id: str
    investidor_id: str
    valor_total: float = Field(gt=0)
    taxa_juros: float = Field(ge=0)
    prazo_meses: int = Field(gt=0)
    valor_parcela: float = Field(gt=0)
    data_primeiro_vencimento: date
    documento_hash: Optional[str] = None
    stellar_tx_id: Optional[str] = None
    smart_contract_id: Optional[str] = None

class ContratoCreate(ContratoBase):
    pass

class ContratoResponse(ContratoBase):
    id: str
    status: StatusContratoEnum
    assinado_em: Optional[datetime] = None
    criado_em: datetime
    
    class Config:
        from_attributes = True
    
    @validator('id', 'solicitacao_credito_id', 'oferta_investimento_id', 'tomador_id', 'investidor_id', 'smart_contract_id', pre=True)
    def convert_uuid_to_str(cls, value):
        if isinstance(value, uuid.UUID):
            return str(value)
        return value

class ParcelaBase(BaseModel):
    contrato_id: str
    numero_parcela: int = Field(gt=0)
    valor_principal: float = Field(gt=0)
    valor_juros: float = Field(ge=0)
    valor_total: float = Field(gt=0)
    data_vencimento: date
    data_pagamento: Optional[date] = None
    multa: float = Field(ge=0, default=0.00)
    juros_atraso: float = Field(ge=0, default=0.00)
    stellar_tx_id: Optional[str] = None

class ParcelaCreate(ParcelaBase):
    pass

class ParcelaResponse(ParcelaBase):
    id: str
    status: StatusParcelaEnum
    criado_em: datetime
    
    class Config:
        from_attributes = True
    
    @validator('id', 'contrato_id', pre=True)
    def convert_uuid_to_str(cls, value):
        if isinstance(value, uuid.UUID):
            return str(value)
        return value

# Models com relacionamentos
class ContratoWithRelations(ContratoResponse):
    smart_contract: Optional[SmartContractResponse] = None
    parcelas: List[ParcelaResponse] = []

class ParcelaWithRelations(ParcelaResponse):
    contrato: ContratoResponse

# FastAPI App
app = FastAPI(title="API de Contratos Inteligentes", version="1.0.0")

# CRUD para SmartContract
@app.post("/smart-contracts/", response_model=SmartContractResponse, status_code=status.HTTP_201_CREATED)
def create_smart_contract(contract: SmartContractCreate, db: Session = Depends(get_db)):
    db_contract = SmartContract(**contract.dict())
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.get("/smart-contracts/", response_model=List[SmartContractResponse])
def read_smart_contracts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contracts = db.query(SmartContract).offset(skip).limit(limit).all()
    return contracts

@app.get("/smart-contracts/{contract_id}", response_model=SmartContractResponse)
def read_smart_contract(contract_id: str, db: Session = Depends(get_db)):
    try:
        contract_uuid = uuid.UUID(contract_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    contract = db.query(SmartContract).filter(SmartContract.id == contract_uuid).first()
    if contract is None:
        raise HTTPException(status_code=404, detail="Smart contract não encontrado")
    return contract

@app.put("/smart-contracts/{contract_id}", response_model=SmartContractResponse)
def update_smart_contract(contract_id: str, contract: SmartContractCreate, db: Session = Depends(get_db)):
    try:
        contract_uuid = uuid.UUID(contract_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_contract = db.query(SmartContract).filter(SmartContract.id == contract_uuid).first()
    if db_contract is None:
        raise HTTPException(status_code=404, detail="Smart contract não encontrado")
    
    for key, value in contract.dict().items():
        setattr(db_contract, key, value)
    
    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.delete("/smart-contracts/{contract_id}")
def delete_smart_contract(contract_id: str, db: Session = Depends(get_db)):
    try:
        contract_uuid = uuid.UUID(contract_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    contract = db.query(SmartContract).filter(SmartContract.id == contract_uuid).first()
    if contract is None:
        raise HTTPException(status_code=404, detail="Smart contract não encontrado")
    
    db.delete(contract)
    db.commit()
    return {"message": "Smart contract deletado com sucesso"}

# CRUD para Contrato
@app.post("/contratos/", response_model=ContratoResponse, status_code=status.HTTP_201_CREATED)
def create_contrato(contrato: ContratoCreate, db: Session = Depends(get_db)):
    # Converter strings para UUID
    contrato_data = contrato.dict()
    contrato_data['solicitacao_credito_id'] = uuid.UUID(contrato_data['solicitacao_credito_id'])
    contrato_data['oferta_investimento_id'] = uuid.UUID(contrato_data['oferta_investimento_id'])
    contrato_data['tomador_id'] = uuid.UUID(contrato_data['tomador_id'])
    contrato_data['investidor_id'] = uuid.UUID(contrato_data['investidor_id'])
    
    if contrato_data.get('smart_contract_id'):
        contrato_data['smart_contract_id'] = uuid.UUID(contrato_data['smart_contract_id'])
    
    db_contrato = Contrato(**contrato_data)
    db.add(db_contrato)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato

@app.get("/contratos/", response_model=List[ContratoResponse])
def read_contratos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contratos = db.query(Contrato).offset(skip).limit(limit).all()
    return contratos

@app.get("/contratos/{contrato_id}", response_model=ContratoWithRelations)
def read_contrato(contrato_id: str, db: Session = Depends(get_db)):
    try:
        contrato_uuid = uuid.UUID(contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    contrato = db.query(Contrato).filter(Contrato.id == contrato_uuid).first()
    if contrato is None:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    return contrato

@app.put("/contratos/{contrato_id}", response_model=ContratoResponse)
def update_contrato(contrato_id: str, contrato: ContratoCreate, db: Session = Depends(get_db)):
    try:
        contrato_uuid = uuid.UUID(contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_contrato = db.query(Contrato).filter(Contrato.id == contrato_uuid).first()
    if db_contrato is None:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    
    # Converter strings para UUID
    contrato_data = contrato.dict()
    contrato_data['solicitacao_credito_id'] = uuid.UUID(contrato_data['solicitacao_credito_id'])
    contrato_data['oferta_investimento_id'] = uuid.UUID(contrato_data['oferta_investimento_id'])
    contrato_data['tomador_id'] = uuid.UUID(contrato_data['tomador_id'])
    contrato_data['investidor_id'] = uuid.UUID(contrato_data['investidor_id'])
    
    if contrato_data.get('smart_contract_id'):
        contrato_data['smart_contract_id'] = uuid.UUID(contrato_data['smart_contract_id'])
    
    for key, value in contrato_data.items():
        setattr(db_contrato, key, value)
    
    db.commit()
    db.refresh(db_contrato)
    return db_contrato

@app.patch("/contratos/{contrato_id}/status")
def update_contrato_status(contrato_id: str, status: StatusContratoEnum, db: Session = Depends(get_db)):
    try:
        contrato_uuid = uuid.UUID(contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_contrato = db.query(Contrato).filter(Contrato.id == contrato_uuid).first()
    if db_contrato is None:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    
    db_contrato.status = status
    db.commit()
    db.refresh(db_contrato)
    return db_contrato

@app.delete("/contratos/{contrato_id}")
def delete_contrato(contrato_id: str, db: Session = Depends(get_db)):
    try:
        contrato_uuid = uuid.UUID(contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    contrato = db.query(Contrato).filter(Contrato.id == contrato_uuid).first()
    if contrato is None:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    
    db.delete(contrato)
    db.commit()
    return {"message": "Contrato deletado com sucesso"}

# CRUD para Parcela
@app.post("/parcelas/", response_model=ParcelaResponse, status_code=status.HTTP_201_CREATED)
def create_parcela(parcela: ParcelaCreate, db: Session = Depends(get_db)):
    # Verifica se o contrato existe
    try:
        contrato_uuid = uuid.UUID(parcela.contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID do contrato inválido")
    
    contrato = db.query(Contrato).filter(Contrato.id == contrato_uuid).first()
    if contrato is None:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    
    parcela_data = parcela.dict()
    parcela_data['contrato_id'] = contrato_uuid
    
    db_parcela = Parcela(**parcela_data)
    db.add(db_parcela)
    db.commit()
    db.refresh(db_parcela)
    return db_parcela

@app.get("/parcelas/", response_model=List[ParcelaResponse])
def read_parcelas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    parcelas = db.query(Parcela).offset(skip).limit(limit).all()
    return parcelas

@app.get("/parcelas/{parcela_id}", response_model=ParcelaWithRelations)
def read_parcela(parcela_id: str, db: Session = Depends(get_db)):
    try:
        parcela_uuid = uuid.UUID(parcela_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    parcela = db.query(Parcela).filter(Parcela.id == parcela_uuid).first()
    if parcela is None:
        raise HTTPException(status_code=404, detail="Parcela não encontrada")
    return parcela

@app.get("/contratos/{contrato_id}/parcelas", response_model=List[ParcelaResponse])
def read_parcelas_por_contrato(contrato_id: str, db: Session = Depends(get_db)):
    try:
        contrato_uuid = uuid.UUID(contrato_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    parcelas = db.query(Parcela).filter(Parcela.contrato_id == contrato_uuid).all()
    return parcelas

@app.put("/parcelas/{parcela_id}", response_model=ParcelaResponse)
def update_parcela(parcela_id: str, parcela: ParcelaCreate, db: Session = Depends(get_db)):
    try:
        parcela_uuid = uuid.UUID(parcela_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_parcela = db.query(Parcela).filter(Parcela.id == parcela_uuid).first()
    if db_parcela is None:
        raise HTTPException(status_code=404, detail="Parcela não encontrada")
    
    # Converter string para UUID
    parcela_data = parcela.dict()
    parcela_data['contrato_id'] = uuid.UUID(parcela_data['contrato_id'])
    
    for key, value in parcela_data.items():
        setattr(db_parcela, key, value)
    
    db.commit()
    db.refresh(db_parcela)
    return db_parcela

@app.patch("/parcelas/{parcela_id}/status")
def update_parcela_status(parcela_id: str, status: StatusParcelaEnum, db: Session = Depends(get_db)):
    try:
        parcela_uuid = uuid.UUID(parcela_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_parcela = db.query(Parcela).filter(Parcela.id == parcela_uuid).first()
    if db_parcela is None:
        raise HTTPException(status_code=404, detail="Parcela não encontrada")
    
    db_parcela.status = status
    db.commit()
    db.refresh(db_parcela)
    return db_parcela

@app.patch("/parcelas/{parcela_id}/pagamento")
def registrar_pagamento_parcela(
    parcela_id: str, 
    data_pagamento: date, 
    stellar_tx_id: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    try:
        parcela_uuid = uuid.UUID(parcela_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    db_parcela = db.query(Parcela).filter(Parcela.id == parcela_uuid).first()
    if db_parcela is None:
        raise HTTPException(status_code=404, detail="Parcela não encontrada")
    
    db_parcela.data_pagamento = data_pagamento
    db_parcela.status = StatusParcelaEnum.PAGO
    if stellar_tx_id:
        db_parcela.stellar_tx_id = stellar_tx_id
    
    db.commit()
    db.refresh(db_parcela)
    return db_parcela

@app.delete("/parcelas/{parcela_id}")
def delete_parcela(parcela_id: str, db: Session = Depends(get_db)):
    try:
        parcela_uuid = uuid.UUID(parcela_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="ID inválido")
    
    parcela = db.query(Parcela).filter(Parcela.id == parcela_uuid).first()
    if parcela is None:
        raise HTTPException(status_code=404, detail="Parcela não encontrada")
    
    db.delete(parcela)
    db.commit()
    return {"message": "Parcela deletada com sucesso"}

# Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)