from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_BCRYPT_LENGTH = 72  # Limite do bcrypt em bytes

def get_password_hash(password: str) -> str:
    # Trunca para no máximo 72 bytes antes de gerar o hash
    truncated_password = password[:MAX_BCRYPT_LENGTH]
    return pwd_context.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Também truncar na verificação para consistência
    truncated_password = plain_password[:MAX_BCRYPT_LENGTH]
    return pwd_context.verify(truncated_password, hashed_password)
