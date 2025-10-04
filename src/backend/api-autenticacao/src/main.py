from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

# Importações relativas
from .database import get_db
from .schemas import (
    UsuarioCreate, UsuarioResponse, UsuarioUpdate, UsuarioComWallets,
    StellarWalletCreate, StellarWalletResponse, StellarWalletUpdate,
    LoginRequest
)
from .crud import (
    get_usuario_by_id, get_usuarios, create_usuario, update_usuario, delete_usuario,
    get_wallets_by_usuario, get_wallet_by_id, create_wallet, update_wallet, delete_wallet,
    verificar_login, get_wallets
)
from .database import Base, engine

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stellar Auth Microservice",
    description="Microsserviço para autenticação e gerenciamento de carteiras Stellar",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Rotas para Usuario
# -------------------------

@app.post("/usuarios/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        return create_usuario(db, usuario)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/usuarios/", response_model=List[UsuarioResponse])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_usuarios(db, skip=skip, limit=limit)

@app.get("/usuarios/{usuario_id}", response_model=UsuarioComWallets)
def obter_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    db_usuario = get_usuario_by_id(db, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    wallets = get_wallets_by_usuario(db, usuario_id)
    usuario_data = UsuarioComWallets.model_validate(db_usuario)
    usuario_data.wallets = wallets
    return usuario_data

@app.put("/usuarios/{usuario_id}", response_model=UsuarioResponse)
def atualizar_usuario(usuario_id: uuid.UUID, usuario_update: UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = update_usuario(db, usuario_id, usuario_update)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return db_usuario

@app.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    if not delete_usuario(db, usuario_id):
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"message": "Usuário deletado com sucesso"}

# -------------------------
# Rotas para Autenticação
# -------------------------

@app.post("/login/")
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    usuario = verificar_login(db, login_request.cpf, login_request.senha)
    if not usuario:
        raise HTTPException(status_code=401, detail="CPF ou senha inválidos")
    
    return {
        "message": "Login realizado com sucesso",
        "usuario_id": usuario.id,
        "nome": usuario.nome_completo,
        "email": usuario.email
    }

# -------------------------
# Rotas para StellarWallet
# -------------------------

@app.post("/wallets/", response_model=StellarWalletResponse, status_code=status.HTTP_201_CREATED)
def create_wallet_route(wallet: StellarWalletCreate, db: Session = Depends(get_db)):
    return create_wallet(db=db, wallet=wallet)

@app.get("/wallets/", response_model=List[StellarWalletResponse])
def listar_wallets(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_wallets(db, skip=skip, limit=limit)

@app.get("/usuarios/{usuario_id}/wallets", response_model=List[StellarWalletResponse])
def listar_wallets_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    return get_wallets_by_usuario(db, usuario_id)

@app.get("/wallets/{wallet_id}", response_model=StellarWalletResponse)
def obter_wallet(wallet_id: uuid.UUID, db: Session = Depends(get_db)):
    db_wallet = get_wallet_by_id(db, wallet_id)
    if not db_wallet:
        raise HTTPException(status_code=404, detail="Carteira não encontrada")
    return db_wallet

# @app.get("/usuarios/{usuario_id}/wallet-principal", response_model=StellarWalletResponse)
# def obter_wallet_principal(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
#     db_wallet = get_wallet_principal(db, usuario_id)
#     if not db_wallet:
#         raise HTTPException(status_code=404, detail="Carteira principal não encontrada")
#     return db_wallet

@app.put("/wallets/{wallet_id}", response_model=StellarWalletResponse)
def atualizar_wallet(wallet_id: uuid.UUID, wallet_update: StellarWalletUpdate, db: Session = Depends(get_db)):
    db_wallet = update_wallet(db, wallet_id, wallet_update)
    if not db_wallet:
        raise HTTPException(status_code=404, detail="Carteira não encontrada")
    return db_wallet

@app.delete("/wallets/{wallet_id}")
def deletar_wallet(wallet_id: uuid.UUID, db: Session = Depends(get_db)):
    if not delete_wallet(db, wallet_id):
        raise HTTPException(status_code=404, detail="Carteira não encontrada")
    return {"message": "Carteira deletada com sucesso"}

# -------------------------
# Health Check
# -------------------------

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/")
def root():
    return {"message": "Stellar Auth Microservice API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
