from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, ForeignKey, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid
from enum import Enum as PyEnum

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
class ClassificacaoScoreEnum(str, PyEnum):
    EXCELENTE = "EXCELENTE"
    BOM = "BOM"
    REGULAR = "REGULAR"
    RUIM = "RUIM"

classificacao_score_enum = ENUM('EXCELENTE', 'BOM', 'REGULAR', 'RUIM', name='classificacao_score_enum')

# Modelos SQLAlchemy
class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

class ScoreCredito(Base):
    __tablename__ = "score_credito"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    score_interno = Column(Integer, CheckConstraint('score_interno BETWEEN 0 AND 1000'))
    score_serasa = Column(Integer)
    score_open_finance = Column(Integer)
    score_consolidado = Column(Integer, CheckConstraint('score_consolidado BETWEEN 0 AND 1000'))
    classificacao = Column(classificacao_score_enum)
    detalhamento = Column(JSONB)
    calculado_em = Column(DateTime, default=datetime.utcnow)
    valido_ate = Column(DateTime)
    
    usuario = relationship("Usuario")
    historicos = relationship("HistoricoScore", back_populates="score_credito")

class ScoreInvestidor(Base):
    __tablename__ = "score_investidor"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    score_investidor = Column(Integer, CheckConstraint('score_investidor BETWEEN 0 AND 1000'))
    classificacao = Column(classificacao_score_enum)
    fatores = Column(JSONB)
    calculado_em = Column(DateTime, default=datetime.utcnow)
    
    usuario = relationship("Usuario")

class HistoricoScore(Base):
    __tablename__ = "historico_score"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    score_credito_id = Column(UUID(as_uuid=True), ForeignKey('score_credito.id', ondelete='CASCADE'), nullable=False)
    score_anterior = Column(Integer)
    score_novo = Column(Integer)
    motivo_alteracao = Column(Text)
    dados_calculo = Column(JSONB)
    registrado_em = Column(DateTime, default=datetime.utcnow)
    
    score_credito = relationship("ScoreCredito", back_populates="historicos")

class ConsultaSerasa(Base):
    __tablename__ = "consulta_serasa"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    score_retornado = Column(Integer)
    dados_completos = Column(JSONB)
    consultado_em = Column(DateTime, default=datetime.utcnow)
    protocolo_serasa = Column(String(255))
    
    usuario = relationship("Usuario")

class DadosOpenFinance(Base):
    __tablename__ = "dados_open_finance"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    instituicao = Column(String(255), nullable=False)
    contas = Column(JSONB)
    transacoes = Column(JSONB)
    investimentos = Column(JSONB)
    sincronizado_em = Column(DateTime, default=datetime.utcnow)
    expira_em = Column(DateTime)
    
    usuario = relationship("Usuario")

# Pydantic Models
class ScoreCreditoBase(BaseModel):
    usuario_id: uuid.UUID
    score_interno: Optional[int] = Field(None, ge=0, le=1000)
    score_serasa: Optional[int] = None
    score_open_finance: Optional[int] = None
    score_consolidado: Optional[int] = Field(None, ge=0, le=1000)
    classificacao: Optional[ClassificacaoScoreEnum] = None
    detalhamento: Optional[Dict[str, Any]] = None
    valido_ate: Optional[datetime] = None

class ScoreCreditoCreate(ScoreCreditoBase):
    pass

class ScoreCreditoUpdate(BaseModel):
    score_interno: Optional[int] = Field(None, ge=0, le=1000)
    score_serasa: Optional[int] = None
    score_open_finance: Optional[int] = None
    score_consolidado: Optional[int] = Field(None, ge=0, le=1000)
    classificacao: Optional[ClassificacaoScoreEnum] = None
    detalhamento: Optional[Dict[str, Any]] = None
    valido_ate: Optional[datetime] = None

class ScoreCreditoResponse(ScoreCreditoBase):
    id: uuid.UUID
    calculado_em: datetime
    
    class Config:
        from_attributes = True

class ScoreInvestidorBase(BaseModel):
    usuario_id: uuid.UUID
    score_investidor: Optional[int] = Field(None, ge=0, le=1000)
    classificacao: Optional[ClassificacaoScoreEnum] = None
    fatores: Optional[Dict[str, Any]] = None

class ScoreInvestidorCreate(ScoreInvestidorBase):
    pass

class ScoreInvestidorUpdate(BaseModel):
    score_investidor: Optional[int] = Field(None, ge=0, le=1000)
    classificacao: Optional[ClassificacaoScoreEnum] = None
    fatores: Optional[Dict[str, Any]] = None

class ScoreInvestidorResponse(ScoreInvestidorBase):
    id: uuid.UUID
    calculado_em: datetime
    
    class Config:
        from_attributes = True

class HistoricoScoreBase(BaseModel):
    score_credito_id: uuid.UUID
    score_anterior: Optional[int] = None
    score_novo: Optional[int] = None
    motivo_alteracao: Optional[str] = None
    dados_calculo: Optional[Dict[str, Any]] = None

class HistoricoScoreCreate(HistoricoScoreBase):
    pass

class HistoricoScoreResponse(HistoricoScoreBase):
    id: uuid.UUID
    registrado_em: datetime
    
    class Config:
        from_attributes = True

class ConsultaSerasaBase(BaseModel):
    usuario_id: uuid.UUID
    score_retornado: Optional[int] = None
    dados_completos: Optional[Dict[str, Any]] = None
    protocolo_serasa: Optional[str] = None

class ConsultaSerasaCreate(ConsultaSerasaBase):
    pass

class ConsultaSerasaResponse(ConsultaSerasaBase):
    id: uuid.UUID
    consultado_em: datetime
    
    class Config:
        from_attributes = True

class DadosOpenFinanceBase(BaseModel):
    usuario_id: uuid.UUID
    instituicao: str
    contas: Optional[Dict[str, Any]] = None
    transacoes: Optional[Dict[str, Any]] = None
    investimentos: Optional[Dict[str, Any]] = None
    expira_em: Optional[datetime] = None

class DadosOpenFinanceCreate(DadosOpenFinanceBase):
    pass

class DadosOpenFinanceUpdate(BaseModel):
    instituicao: Optional[str] = None
    contas: Optional[Dict[str, Any]] = None
    transacoes: Optional[Dict[str, Any]] = None
    investimentos: Optional[Dict[str, Any]] = None
    expira_em: Optional[datetime] = None

class DadosOpenFinanceResponse(DadosOpenFinanceBase):
    id: uuid.UUID
    sincronizado_em: datetime
    
    class Config:
        from_attributes = True

# Função auxiliar
def calcular_classificacao(score: int) -> ClassificacaoScoreEnum:
    if score >= 800:
        return ClassificacaoScoreEnum.EXCELENTE
    elif score >= 600:
        return ClassificacaoScoreEnum.BOM
    elif score >= 400:
        return ClassificacaoScoreEnum.REGULAR
    else:
        return ClassificacaoScoreEnum.RUIM

# Inicialização do FastAPI
app = FastAPI(title="Sistema de Scores Financeiros", version="1.0.0")

# Rotas para ScoreCredito
@app.post("/scores-credito/", response_model=ScoreCreditoResponse, status_code=status.HTTP_201_CREATED)
def criar_score_credito(score: ScoreCreditoCreate, db: Session = Depends(get_db)):
    # Calcular classificação automaticamente se não for fornecida
    score_data = score.dict()
    
    # Se score_consolidado foi fornecido e classificacao não foi, calcular automaticamente
    if score_data.get('score_consolidado') is not None and score_data.get('classificacao') is None:
        score_data['classificacao'] = calcular_classificacao(score_data['score_consolidado'])
    
    # Se nenhum score foi fornecido, definir valores padrão
    if score_data.get('score_consolidado') is None:
        score_data['score_consolidado'] = 0
        score_data['classificacao'] = ClassificacaoScoreEnum.RUIM
    
    db_score = ScoreCredito(**score_data)
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/scores-credito/", response_model=List[ScoreCreditoResponse])
def listar_scores_credito(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    scores = db.query(ScoreCredito).offset(skip).limit(limit).all()
    return scores

@app.get("/scores-credito/{score_id}", response_model=ScoreCreditoResponse)
def obter_score_credito(score_id: uuid.UUID, db: Session = Depends(get_db)):
    score = db.query(ScoreCredito).filter(ScoreCredito.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score de crédito não encontrado")
    return score

@app.get("/usuarios/{usuario_id}/scores-credito/", response_model=List[ScoreCreditoResponse])
def obter_scores_credito_por_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    scores = db.query(ScoreCredito).filter(ScoreCredito.usuario_id == usuario_id).all()
    return scores

@app.put("/scores-credito/{score_id}", response_model=ScoreCreditoResponse)
def atualizar_score_credito(score_id: uuid.UUID, score_update: ScoreCreditoUpdate, db: Session = Depends(get_db)):
    db_score = db.query(ScoreCredito).filter(ScoreCredito.id == score_id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score de crédito não encontrado")
    
    # Registrar histórico antes da atualização
    historico = HistoricoScore(
        score_credito_id=score_id,
        score_anterior=db_score.score_consolidado,
        score_novo=score_update.score_consolidado,
        motivo_alteracao="Atualização manual",
        dados_calculo={"tipo": "atualizacao_manual"}
    )
    db.add(historico)
    
    # Atualizar score
    update_data = score_update.dict(exclude_unset=True)
    
    # Se score_consolidado foi atualizado e classificacao não foi, calcular automaticamente
    if update_data.get('score_consolidado') is not None and update_data.get('classificacao') is None:
        update_data['classificacao'] = calcular_classificacao(update_data['score_consolidado'])
    
    for field, value in update_data.items():
        setattr(db_score, field, value)
    
    db.commit()
    db.refresh(db_score)
    return db_score

@app.delete("/scores-credito/{score_id}")
def deletar_score_credito(score_id: uuid.UUID, db: Session = Depends(get_db)):
    db_score = db.query(ScoreCredito).filter(ScoreCredito.id == score_id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score de crédito não encontrado")
    
    db.delete(db_score)
    db.commit()
    return {"message": "Score de crédito deletado com sucesso"}

# Rotas para ScoreInvestidor
@app.post("/scores-investidor/", response_model=ScoreInvestidorResponse, status_code=status.HTTP_201_CREATED)
def criar_score_investidor(score: ScoreInvestidorCreate, db: Session = Depends(get_db)):
    score_data = score.dict()
    
    # Calcular classificação automaticamente se não for fornecida
    if score_data.get('score_investidor') is not None and score_data.get('classificacao') is None:
        score_data['classificacao'] = calcular_classificacao(score_data['score_investidor'])
    
    # Se nenhum score foi fornecido, definir valores padrão
    if score_data.get('score_investidor') is None:
        score_data['score_investidor'] = 0
        score_data['classificacao'] = ClassificacaoScoreEnum.RUIM
    
    db_score = ScoreInvestidor(**score_data)
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/scores-investidor/", response_model=List[ScoreInvestidorResponse])
def listar_scores_investidor(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    scores = db.query(ScoreInvestidor).offset(skip).limit(limit).all()
    return scores

@app.get("/usuarios/{usuario_id}/scores-investidor/", response_model=List[ScoreInvestidorResponse])
def obter_scores_investidor_por_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    scores = db.query(ScoreInvestidor).filter(ScoreInvestidor.usuario_id == usuario_id).all()
    return scores

# Rotas para Histórico de Scores
@app.post("/historico-scores/", response_model=HistoricoScoreResponse, status_code=status.HTTP_201_CREATED)
def criar_historico_score(historico: HistoricoScoreCreate, db: Session = Depends(get_db)):
    db_historico = HistoricoScore(**historico.dict())
    db.add(db_historico)
    db.commit()
    db.refresh(db_historico)
    return db_historico

@app.get("/scores-credito/{score_id}/historico/", response_model=List[HistoricoScoreResponse])
def obter_historico_score(score_id: uuid.UUID, db: Session = Depends(get_db)):
    historico = db.query(HistoricoScore).filter(HistoricoScore.score_credito_id == score_id).all()
    return historico

# Rotas para Consulta Serasa
@app.post("/consultas-serasa/", response_model=ConsultaSerasaResponse, status_code=status.HTTP_201_CREATED)
def criar_consulta_serasa(consulta: ConsultaSerasaCreate, db: Session = Depends(get_db)):
    db_consulta = ConsultaSerasa(**consulta.dict())
    db.add(db_consulta)
    db.commit()
    db.refresh(db_consulta)
    return db_consulta

@app.get("/usuarios/{usuario_id}/consultas-serasa/", response_model=List[ConsultaSerasaResponse])
def obter_consultas_serasa_por_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    consultas = db.query(ConsultaSerasa).filter(ConsultaSerasa.usuario_id == usuario_id).all()
    return consultas

# Rotas para Dados Open Finance
@app.post("/dados-open-finance/", response_model=DadosOpenFinanceResponse, status_code=status.HTTP_201_CREATED)
def criar_dados_open_finance(dados: DadosOpenFinanceCreate, db: Session = Depends(get_db)):
    db_dados = DadosOpenFinance(**dados.dict())
    db.add(db_dados)
    db.commit()
    db.refresh(db_dados)
    return db_dados

@app.get("/usuarios/{usuario_id}/dados-open-finance/", response_model=List[DadosOpenFinanceResponse])
def obter_dados_open_finance_por_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    dados = db.query(DadosOpenFinance).filter(DadosOpenFinance.usuario_id == usuario_id).all()
    return dados

@app.put("/dados-open-finance/{dados_id}", response_model=DadosOpenFinanceResponse)
def atualizar_dados_open_finance(dados_id: uuid.UUID, dados_update: DadosOpenFinanceUpdate, db: Session = Depends(get_db)):
    db_dados = db.query(DadosOpenFinance).filter(DadosOpenFinance.id == dados_id).first()
    if not db_dados:
        raise HTTPException(status_code=404, detail="Dados Open Finance não encontrados")
    
    for field, value in dados_update.dict(exclude_unset=True).items():
        setattr(db_dados, field, value)
    
    db.commit()
    db.refresh(db_dados)
    return db_dados

# Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)