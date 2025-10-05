from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, String, Numeric, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID, ENUM
import uuid
from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from enum import Enum

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

# Enums do PostgreSQL
finalidade_credito_enum = ENUM('PESSOAL', 'EDUCACAO', 'SAUDE', 'NEGOCIO', 'OUTROS', name='finalidade_credito_enum')
status_solicitacao_enum = ENUM('PENDENTE', 'ANALISE', 'APROVADO', 'REPROVADO', 'CANCELADO', name='status_solicitacao_enum')
status_oferta_enum = ENUM('PENDENTE', 'ACEITA', 'RECUSADA', 'EXPIRADA', name='status_oferta_enum')
perfil_risco_enum = ENUM('CONSERVADOR', 'MODERADO', 'ARROJADO', name='perfil_risco_enum')
ocupacao_enum = ENUM('EMPREGADO', 'AUTONOMO', 'EMPREENDEDOR', 'DESEMPREGADO', 'ESTUDANTE', 'APOSENTADO', name='ocupacao_enum')

class FinalidadeCreditoEnum(str, Enum):
    PESSOAL = "PESSOAL"
    EDUCACAO = "EDUCACAO"
    SAUDE = "SAUDE"
    NEGOCIO = "NEGOCIO"
    OUTROS = "OUTROS"

# Models SQLAlchemy
class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Outras colunas do usuário conforme necessário

class SolicitacaoCredito(Base):
    __tablename__ = "solicitacao_credito"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tomador_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id'), nullable=False)
    valor_solicitado = Column(Numeric(15, 2), nullable=False)
    prazo_meses = Column(Integer, nullable=False)
    finalidade = Column(finalidade_credito_enum, nullable=False)
    descricao = Column(Text)
    status = Column(status_solicitacao_enum, default='PENDENTE')
    taxa_juros_sugerida = Column(Numeric(5, 2))
    analise_ia = Column(JSON)
    solicitado_em = Column(DateTime, default=datetime.utcnow)
    respondido_em = Column(DateTime)
    
    # Relacionamentos
    tomador = relationship("Usuario")
    ofertas = relationship("OfertaInvestimento", back_populates="solicitacao_credito")

class OfertaInvestimento(Base):
    __tablename__ = "oferta_investimento"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    solicitacao_credito_id = Column(UUID(as_uuid=True), ForeignKey('solicitacao_credito.id'), nullable=False)
    investidor_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id'), nullable=False)
    valor_ofertado = Column(Numeric(15, 2), nullable=False)
    taxa_juros_oferecida = Column(Numeric(5, 2), nullable=False)
    status = Column(status_oferta_enum, default='PENDENTE')
    mensagem = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)
    expira_em = Column(DateTime)
    respondido_em = Column(DateTime)
    
    # Relacionamentos
    solicitacao_credito = relationship("SolicitacaoCredito", back_populates="ofertas")
    investidor = relationship("Usuario")

class PerfilInvestidor(Base):
    __tablename__ = "perfil_investidor"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id'), unique=True, nullable=False)
    saldo_disponivel = Column(Numeric(15, 2), default=0.00)
    total_investido = Column(Numeric(15, 2), default=0.00)
    retorno_acumulado = Column(Numeric(15, 2), default=0.00)
    perfil_risco = Column(perfil_risco_enum)
    preferencias = Column(JSON)
    atualizado_em = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    usuario = relationship("Usuario")

class PerfilTomador(Base):
    __tablename__ = "perfil_tomador"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id'), unique=True, nullable=False)
    renda_mensal = Column(Numeric(15, 2))
    ocupacao = Column(ocupacao_enum)
    empresa = Column(String(255))
    limite_credito = Column(Numeric(15, 2), default=0.00)
    credito_utilizado = Column(Numeric(15, 2), default=0.00)
    atualizado_em = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    usuario = relationship("Usuario")

# Pydantic Models
class SolicitacaoCreditoBase(BaseModel):
    tomador_id: uuid.UUID
    valor_solicitado: float = Field(..., gt=0)
    prazo_meses: int = Field(..., gt=0)
    finalidade: FinalidadeCreditoEnum
    descricao: Optional[str] = None
    taxa_juros_sugerida: Optional[float] = None

class SolicitacaoCreditoCreate(SolicitacaoCreditoBase):
    pass

class SolicitacaoCreditoResponse(SolicitacaoCreditoBase):
    id: uuid.UUID
    status: str
    analise_ia: Optional[dict] = None
    solicitado_em: datetime
    respondido_em: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class OfertaInvestimentoBase(BaseModel):
    solicitacao_credito_id: uuid.UUID
    investidor_id: uuid.UUID
    valor_ofertado: float = Field(..., gt=0)
    taxa_juros_oferecida: float = Field(..., gt=0)
    mensagem: Optional[str] = None
    expira_em: Optional[datetime] = None

class OfertaInvestimentoCreate(OfertaInvestimentoBase):
    pass

class OfertaInvestimentoResponse(OfertaInvestimentoBase):
    id: uuid.UUID
    status: str
    criado_em: datetime
    respondido_em: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class PerfilInvestidorBase(BaseModel):
    usuario_id: uuid.UUID
    saldo_disponivel: float = Field(0.00, ge=0)
    total_investido: float = Field(0.00, ge=0)
    retorno_acumulado: float = Field(0.00)
    perfil_risco: Optional[str] = None
    preferencias: Optional[dict] = None

class PerfilInvestidorCreate(PerfilInvestidorBase):
    pass

class PerfilInvestidorResponse(PerfilInvestidorBase):
    id: uuid.UUID
    atualizado_em: datetime
    
    class Config:
        orm_mode = True

class PerfilTomadorBase(BaseModel):
    usuario_id: uuid.UUID
    renda_mensal: Optional[float] = None
    ocupacao: Optional[str] = None
    empresa: Optional[str] = None
    limite_credito: float = Field(0.00, ge=0)
    credito_utilizado: float = Field(0.00, ge=0)

class PerfilTomadorCreate(PerfilTomadorBase):
    pass

class PerfilTomadorResponse(PerfilTomadorBase):
    id: uuid.UUID
    atualizado_em: datetime
    
    class Config:
        orm_mode = True

# FastAPI App
app = FastAPI(title="Sistema de Crédito e Investimento")

# Rotas para SolicitacaoCredito
@app.post("/solicitacoes-credito/", response_model=SolicitacaoCreditoResponse, status_code=status.HTTP_201_CREATED)
def criar_solicitacao_credito(solicitacao: SolicitacaoCreditoCreate, db: Session = Depends(get_db)):
    db_solicitacao = SolicitacaoCredito(**solicitacao.dict())
    db.add(db_solicitacao)
    db.commit()
    db.refresh(db_solicitacao)
    return db_solicitacao

@app.get("/solicitacoes-credito/", response_model=List[SolicitacaoCreditoResponse])
def listar_solicitacoes_credito(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    solicitacoes = db.query(SolicitacaoCredito).offset(skip).limit(limit).all()
    return solicitacoes

@app.get("/solicitacoes-credito/{solicitacao_id}", response_model=SolicitacaoCreditoResponse)
def obter_solicitacao_credito(solicitacao_id: uuid.UUID, db: Session = Depends(get_db)):
    solicitacao = db.query(SolicitacaoCredito).filter(SolicitacaoCredito.id == solicitacao_id).first()
    if not solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação de crédito não encontrada")
    return solicitacao

@app.put("/solicitacoes-credito/{solicitacao_id}", response_model=SolicitacaoCreditoResponse)
def atualizar_solicitacao_credito(solicitacao_id: uuid.UUID, solicitacao_update: SolicitacaoCreditoCreate, db: Session = Depends(get_db)):
    db_solicitacao = db.query(SolicitacaoCredito).filter(SolicitacaoCredito.id == solicitacao_id).first()
    if not db_solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação de crédito não encontrada")
    
    for field, value in solicitacao_update.dict().items():
        setattr(db_solicitacao, field, value)
    
    db.commit()
    db.refresh(db_solicitacao)
    return db_solicitacao

@app.patch("/solicitacoes-credito/{solicitacao_id}/status")
def atualizar_status_solicitacao(solicitacao_id: uuid.UUID, status: str, db: Session = Depends(get_db)):
    db_solicitacao = db.query(SolicitacaoCredito).filter(SolicitacaoCredito.id == solicitacao_id).first()
    if not db_solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação de crédito não encontrada")
    
    db_solicitacao.status = status
    if status in ['APROVADO', 'REPROVADO', 'CANCELADO']:
        db_solicitacao.respondido_em = datetime.utcnow()
    
    db.commit()
    db.refresh(db_solicitacao)
    return db_solicitacao

# Rotas para OfertaInvestimento
@app.post("/ofertas-investimento/", response_model=OfertaInvestimentoResponse, status_code=status.HTTP_201_CREATED)
def criar_oferta_investimento(oferta: OfertaInvestimentoCreate, db: Session = Depends(get_db)):
    # Verificar se a solicitação de crédito existe
    solicitacao = db.query(SolicitacaoCredito).filter(SolicitacaoCredito.id == oferta.solicitacao_credito_id).first()
    if not solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação de crédito não encontrada")
    
    db_oferta = OfertaInvestimento(**oferta.dict())
    if not db_oferta.expira_em:
        db_oferta.expira_em = datetime.utcnow() + timedelta(days=7)  # Expira em 7 dias por padrão
    
    db.add(db_oferta)
    db.commit()
    db.refresh(db_oferta)
    return db_oferta

@app.get("/ofertas-investimento/", response_model=List[OfertaInvestimentoResponse])
def listar_ofertas_investimento(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ofertas = db.query(OfertaInvestimento).offset(skip).limit(limit).all()
    return ofertas

@app.get("/ofertas-investimento/{oferta_id}", response_model=OfertaInvestimentoResponse)
def obter_oferta_investimento(oferta_id: uuid.UUID, db: Session = Depends(get_db)):
    oferta = db.query(OfertaInvestimento).filter(OfertaInvestimento.id == oferta_id).first()
    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta de investimento não encontrada")
    return oferta

@app.patch("/ofertas-investimento/{oferta_id}/status")
def atualizar_status_oferta(oferta_id: uuid.UUID, status: str, db: Session = Depends(get_db)):
    db_oferta = db.query(OfertaInvestimento).filter(OfertaInvestimento.id == oferta_id).first()
    if not db_oferta:
        raise HTTPException(status_code=404, detail="Oferta de investimento não encontrada")
    
    db_oferta.status = status
    if status in ['ACEITA', 'RECUSADA']:
        db_oferta.respondido_em = datetime.utcnow()
    
    db.commit()
    db.refresh(db_oferta)
    return db_oferta

# Rotas para PerfilInvestidor
@app.post("/perfis-investidor/", response_model=PerfilInvestidorResponse, status_code=status.HTTP_201_CREATED)
def criar_perfil_investidor(perfil: PerfilInvestidorCreate, db: Session = Depends(get_db)):
    db_perfil = PerfilInvestidor(**perfil.dict())
    db.add(db_perfil)
    db.commit()
    db.refresh(db_perfil)
    return db_perfil

@app.get("/perfis-investidor/{usuario_id}", response_model=PerfilInvestidorResponse)
def obter_perfil_investidor(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    perfil = db.query(PerfilInvestidor).filter(PerfilInvestidor.usuario_id == usuario_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil de investidor não encontrado")
    return perfil

@app.put("/perfis-investidor/{usuario_id}", response_model=PerfilInvestidorResponse)
def atualizar_perfil_investidor(usuario_id: uuid.UUID, perfil_update: PerfilInvestidorCreate, db: Session = Depends(get_db)):
    db_perfil = db.query(PerfilInvestidor).filter(PerfilInvestidor.usuario_id == usuario_id).first()
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil de investidor não encontrado")
    
    for field, value in perfil_update.dict().items():
        setattr(db_perfil, field, value)
    
    db_perfil.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(db_perfil)
    return db_perfil

# Rotas para PerfilTomador
@app.post("/perfis-tomador/", response_model=PerfilTomadorResponse, status_code=status.HTTP_201_CREATED)
def criar_perfil_tomador(perfil: PerfilTomadorCreate, db: Session = Depends(get_db)):
    db_perfil = PerfilTomador(**perfil.dict())
    db.add(db_perfil)
    db.commit()
    db.refresh(db_perfil)
    return db_perfil

@app.get("/perfis-tomador/{usuario_id}", response_model=PerfilTomadorResponse)
def obter_perfil_tomador(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    perfil = db.query(PerfilTomador).filter(PerfilTomador.usuario_id == usuario_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil de tomador não encontrado")
    return perfil

@app.put("/perfis-tomador/{usuario_id}", response_model=PerfilTomadorResponse)
def atualizar_perfil_tomador(usuario_id: uuid.UUID, perfil_update: PerfilTomadorCreate, db: Session = Depends(get_db)):
    db_perfil = db.query(PerfilTomador).filter(PerfilTomador.usuario_id == usuario_id).first()
    if not db_perfil:
        raise HTTPException(status_code=404, detail="Perfil de tomador não encontrado")
    
    for field, value in perfil_update.dict().items():
        setattr(db_perfil, field, value)
    
    db_perfil.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(db_perfil)
    return db_perfil

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)