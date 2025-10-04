from sqlalchemy.orm import Session
from .models import Usuario, Autenticacao, StellarWallet
from .schemas import UsuarioCreate, UsuarioUpdate, StellarWalletCreate, StellarWalletUpdate
from .auth import get_password_hash, verify_password
from fastapi import HTTPException, status
import uuid
from datetime import datetime, timedelta


# CRUD para Usuario
def get_usuario_by_id(db: Session, usuario_id: uuid.UUID):
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()

def get_usuario_by_cpf(db: Session, cpf: str):
    return db.query(Usuario).filter(Usuario.cpf == cpf).first()

def get_usuario_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Usuario).offset(skip).limit(limit).all()

def create_usuario(db: Session, usuario: UsuarioCreate):
    if get_usuario_by_cpf(db, usuario.cpf):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CPF já cadastrado")
    if get_usuario_by_email(db, usuario.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado")

    db_usuario = Usuario(
        cpf=usuario.cpf,
        email=usuario.email,
        nome_completo=usuario.nome_completo,
        telefone=usuario.telefone,
        data_nascimento=usuario.data_nascimento
    )
    db.add(db_usuario)
    db.flush()  # garante id disponível antes do commit

    auth = Autenticacao(
        usuario_id=db_usuario.id,
        senha_hash=get_password_hash(usuario.senha)
    )
    db.add(auth)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def update_usuario(db: Session, usuario_id: uuid.UUID, usuario_update: UsuarioUpdate):
    db_usuario = get_usuario_by_id(db, usuario_id)
    if not db_usuario:
        return None

    update_data = usuario_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_usuario, field, value)

    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def delete_usuario(db: Session, usuario_id: uuid.UUID):
    db_usuario = get_usuario_by_id(db, usuario_id)
    if not db_usuario:
        return None
    db.delete(db_usuario)
    db.commit()
    return db_usuario


# CRUD para Autenticacao
def get_autenticacao_by_usuario_id(db: Session, usuario_id: uuid.UUID):
    return db.query(Autenticacao).filter(Autenticacao.usuario_id == usuario_id).first()

def update_ultimo_acesso(db: Session, usuario_id: uuid.UUID):
    usuario = get_usuario_by_id(db, usuario_id)
    if usuario:
        usuario.ultimo_acesso = datetime.utcnow()
        db.commit()

def verificar_login(db: Session, cpf: str, senha: str):
    usuario = get_usuario_by_cpf(db, cpf)
    if not usuario or not usuario.ativo:
        return None

    auth = get_autenticacao_by_usuario_id(db, usuario.id)
    if not auth or auth.bloqueado:
        return None

    if verify_password(senha, auth.senha_hash):
        auth.ultimo_login = datetime.utcnow()
        auth.tentativas_falhas = 0
        db.commit()
        update_ultimo_acesso(db, usuario.id)
        return usuario

    # Incrementa tentativas falhas
    auth.tentativas_falhas += 1
    if auth.tentativas_falhas >= 5:
        auth.bloqueado = True
        auth.bloqueado_ate = datetime.utcnow() + timedelta(minutes=15)  # bloqueio temporário
    db.commit()
    return None


# CRUD para StellarWallet
def create_wallet(db: Session, wallet: StellarWalletCreate):
    db_wallet = StellarWallet(**wallet.model_dump())
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet

def get_wallets(db: Session, skip: int = 0, limit: int = 10):
    return db.query(StellarWallet).offset(skip).limit(limit).all()

def get_wallet_by_id(db: Session, wallet_id: uuid.UUID):
    return db.query(StellarWallet).filter(StellarWallet.id == wallet_id).first()

def get_wallets_by_usuario(db: Session, usuario_id: str):
    """
    Retorna todas as wallets de um usuário específico.
    """
    return db.query(StellarWallet).filter(StellarWallet.usuario_id == usuario_id).all()

def update_wallet(db: Session, wallet_id: uuid.UUID, wallet: StellarWalletUpdate):
    db_wallet = get_wallet_by_id(db, wallet_id)
    if not db_wallet:
        return None
    for field, value in wallet.model_dump(exclude_unset=True).items():
        setattr(db_wallet, field, value)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet

def delete_wallet(db: Session, wallet_id: uuid.UUID):
    db_wallet = get_wallet_by_id(db, wallet_id)
    if not db_wallet:
        return None
    db.delete(db_wallet)
    db.commit()
    return db_wallet
