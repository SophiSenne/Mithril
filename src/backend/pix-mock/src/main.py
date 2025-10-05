from fastapi import FastAPI, HTTPException, BackgroundTasks, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
import uuid
from datetime import datetime, timedelta
import random
import time
from enum import Enum

app = FastAPI(
    title="Plataforma de Pagamentos PIX - Mock",
    description="API mockada para simular pagamentos PIX em plataformas",
    version="1.0.0"
)

# Enums para status
class StatusPagamento(str, Enum):
    PENDENTE = "pendente"
    PROCESSANDO = "processando"
    CONCLUIDO = "concluido"
    EXPIRADO = "expirado"
    CANCELADO = "cancelado"
    FALHOU = "falhou"

class StatusWebhook(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"

class StatusPedido(str, Enum):
    CRIADO = "criado"
    AGUARDANDO_PAGAMENTO = "aguardando_pagamento"
    PAGO = "pago"
    PROCESSANDO = "processando"
    ENVIADO = "enviado"
    ENTREGUE = "entregue"
    CANCELADO = "cancelado"
    ESTORNADO = "estornado"

# Modelos de dados
class CriarPagamentoRequest(BaseModel):
    valor: float = Field(..., gt=0, description="Valor do pagamento")
    chave_pix_destino: str = Field(..., description="Chave PIX do recebedor")
    descricao: str = Field(..., description="Descrição do pagamento")
    id_pedido: str = Field(..., description="ID do pedido na plataforma")
    tempo_expiracao: int = Field(default=3600, description="Tempo em segundos para expiração")
    metadata: Optional[Dict] = Field(default=None, description="Metadados adicionais")

class ItemPedido(BaseModel):
    id_produto: str = Field(..., description="ID do produto")
    nome: str = Field(..., description="Nome do produto")
    quantidade: int = Field(..., gt=0, description="Quantidade")
    preco_unitario: float = Field(..., gt=0, description="Preço unitário")
    categoria: Optional[str] = Field(None, description="Categoria do produto")

class CriarPedidoRequest(BaseModel):
    cliente: Dict = Field(..., description="Dados do cliente")
    itens: List[ItemPedido] = Field(..., description="Itens do pedido")
    endereco_entrega: Optional[Dict] = Field(None, description="Endereço de entrega")
    metadata: Optional[Dict] = Field(default=None, description="Metadados adicionais")

class PedidoResponse(BaseModel):
    id: str
    id_cliente: str
    itens: List[ItemPedido]
    valor_total: float
    status: StatusPedido
    data_criacao: datetime
    data_atualizacao: Optional[datetime] = None
    endereco_entrega: Optional[Dict] = None
    id_pagamento: Optional[str] = None
    metadata: Optional[Dict] = None

class PagamentoResponse(BaseModel):
    id: str
    id_pedido: str
    valor: float
    chave_pix_destino: str
    descricao: str
    status: StatusPagamento
    qr_code: Optional[str] = None
    qr_code_texto: Optional[str] = None
    data_criacao: datetime
    data_expiracao: datetime
    data_atualizacao: Optional[datetime] = None
    metadata: Optional[Dict] = None

class WebhookPayload(BaseModel):
    id_pagamento: str
    id_pedido: str
    status: StatusPagamento
    valor: float
    data_atualizacao: datetime
    assinatura: Optional[str] = None

class WebhookConfig(BaseModel):
    url: str
    secret: Optional[str] = None

# Banco de dados mock
db_pagamentos = {}
db_pedidos = {}
db_webhooks = []
db_webhook_logs = []

# Configurações
WEBHOOK_RETRY_DELAY = 5  # segundos

# Funções auxiliares
def gerar_id_pagamento():
    return f"pix_{uuid.uuid4().hex[:16]}"

def gerar_id_pedido():
    return f"ped_{uuid.uuid4().hex[:16]}"

def gerar_id_cliente():
    return f"cli_{uuid.uuid4().hex[:16]}"

def gerar_qr_code_texto(valor: float, chave: str, nome: str):
    """Gera um texto mock para QR Code PIX"""
    return f"00020126580014BR.GOV.BCB.PIX0136{chave}5204000053039865406{valor:.2f}5802BR5913{nome[:13]}6008BRASILIA62070503***6304"

def simular_processamento_pagamento():
    """Simula o processamento do PIX (70% sucesso, 20% falha, 10% expirado)"""
    rand = random.random()
    if rand <= 0.7:
        return StatusPagamento.CONCLUIDO
    elif rand <= 0.9:
        return StatusPagamento.FALHOU
    else:
        return StatusPagamento.EXPIRADO

async def processar_webhook(pagamento_id: str):
    """Processa webhooks para notificar mudanças de status"""
    pagamento = db_pagamentos.get(pagamento_id)
    if not pagamento:
        return

    for webhook in db_webhooks:
        payload = WebhookPayload(
            id_pagamento=pagamento_id,
            id_pedido=pagamento["id_pedido"],
            status=pagamento["status"],
            valor=pagamento["valor"],
            data_atualizacao=datetime.now()
        )
        
        # Simular envio de webhook
        success = random.random() > 0.3  # 70% de sucesso
        
        log_entry = {
            "id": str(uuid.uuid4()),
            "webhook_url": webhook.url,
            "payload": payload.dict(),
            "status": StatusWebhook.SENT if success else StatusWebhook.FAILED,
            "tentativas": 1,
            "ultima_tentativa": datetime.now()
        }
        
        db_webhook_logs.append(log_entry)

async def atualizar_status_pedido_por_pagamento(pagamento_id: str):
    """Atualiza o status do pedido baseado no status do pagamento"""
    pagamento = db_pagamentos.get(pagamento_id)
    if not pagamento:
        return
    
    pedido_id = pagamento["id_pedido"]
    pedido = db_pedidos.get(pedido_id)
    if not pedido:
        return
    
    # Mapear status de pagamento para status de pedido
    status_map = {
        StatusPagamento.CONCLUIDO: StatusPedido.PAGO,
        StatusPagamento.FALHOU: StatusPedido.CANCELADO,
        StatusPagamento.EXPIRADO: StatusPedido.CANCELADO,
        StatusPagamento.CANCELADO: StatusPedido.CANCELADO
    }
    
    novo_status_pedido = status_map.get(pagamento["status"])
    if novo_status_pedido:
        db_pedidos[pedido_id]["status"] = novo_status_pedido
        db_pedidos[pedido_id]["data_atualizacao"] = datetime.now()

async def simular_callback_pagamento(pagamento_id: str):
    """Simula o callback de confirmação do PIX após um tempo"""
    # Aguarda entre 5 e 30 segundos para simular processamento
    delay = random.randint(5, 30)
    await asyncio.sleep(delay)
    
    pagamento = db_pagamentos.get(pagamento_id)
    if pagamento and pagamento["status"] == StatusPagamento.PENDENTE:
        novo_status = simular_processamento_pagamento()
        
        db_pagamentos[pagamento_id]["status"] = novo_status
        db_pagamentos[pagamento_id]["data_atualizacao"] = datetime.now()
        
        # Atualizar pedido e disparar webhooks
        await atualizar_status_pedido_por_pagamento(pagamento_id)
        await processar_webhook(pagamento_id)

# Endpoints principais
@app.post("/pedidos", response_model=PedidoResponse)
async def criar_pedido(request: CriarPedidoRequest):
    """Cria um novo pedido"""
    
    pedido_id = gerar_id_pedido()
    cliente_id = gerar_id_cliente()
    data_criacao = datetime.now()
    
    # Calcular valor total
    valor_total = sum(item.quantidade * item.preco_unitario for item in request.itens)
    
    pedido_data = {
        "id": pedido_id,
        "id_cliente": cliente_id,
        "cliente": request.cliente,
        "itens": [item.dict() for item in request.itens],
        "valor_total": valor_total,
        "status": StatusPedido.CRIADO,
        "data_criacao": data_criacao,
        "data_atualizacao": None,
        "endereco_entrega": request.endereco_entrega,
        "id_pagamento": None,
        "metadata": request.metadata or {}
    }
    
    db_pedidos[pedido_id] = pedido_data
    
    return PedidoResponse(**pedido_data)

@app.get("/pedidos/{pedido_id}", response_model=PedidoResponse)
async def consultar_pedido(pedido_id: str):
    """Consulta um pedido pelo ID"""
    pedido = db_pedidos.get(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    return PedidoResponse(**pedido)

@app.post("/pedidos/{pedido_id}/pagamento", response_model=PagamentoResponse)
async def criar_pagamento_para_pedido(pedido_id: str, background_tasks: BackgroundTasks):
    """Cria um pagamento PIX para um pedido existente"""
    
    pedido = db_pedidos.get(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    # Verificar se já existe pagamento para este pedido
    if pedido["id_pagamento"]:
        pagamento_existente = db_pagamentos.get(pedido["id_pagamento"])
        if pagamento_existente:
            return PagamentoResponse(**pagamento_existente)
    
    # Atualizar status do pedido
    db_pedidos[pedido_id]["status"] = StatusPedido.AGUARDANDO_PAGAMENTO
    db_pedidos[pedido_id]["data_atualizacao"] = datetime.now()
    
    # Criar pagamento
    pagamento_id = gerar_id_pagamento()
    data_criacao = datetime.now()
    data_expiracao = data_criacao + timedelta(hours=1)
    
    # Simular dados do recebedor
    nomes_recebedores = ["Loja Online LTDA", "Serviços Digitais ME", "Comércio Eletrônico"]
    nome_recebedor = random.choice(nomes_recebedores)
    chaves_pix = ["loja@email.com", "11999999999", "123.456.789-00"]
    chave_pix = random.choice(chaves_pix)
    
    pagamento_data = {
        "id": pagamento_id,
        "id_pedido": pedido_id,
        "valor": pedido["valor_total"],
        "chave_pix_destino": chave_pix,
        "descricao": f"Pagamento pedido {pedido_id}",
        "status": StatusPagamento.PENDENTE,
        "qr_code": f"data:image/png;base64,MOCK_QR_CODE_{pagamento_id}",
        "qr_code_texto": gerar_qr_code_texto(pedido["valor_total"], chave_pix, nome_recebedor),
        "data_criacao": data_criacao,
        "data_expiracao": data_expiracao,
        "data_atualizacao": None,
        "metadata": {"pedido_id": pedido_id, "cliente_id": pedido["id_cliente"]}
    }
    
    db_pagamentos[pagamento_id] = pagamento_data
    
    # Vincular pagamento ao pedido
    db_pedidos[pedido_id]["id_pagamento"] = pagamento_id
    
    # Simular processamento em background
    background_tasks.add_task(simular_callback_pagamento, pagamento_id)
    
    return PagamentoResponse(**pagamento_data)

@app.post("/pagamentos", response_model=PagamentoResponse)
async def criar_pagamento(request: CriarPagamentoRequest, background_tasks: BackgroundTasks):
    """Cria um novo pagamento PIX (endpoint original mantido para compatibilidade)"""
    
    pagamento_id = gerar_id_pagamento()
    data_criacao = datetime.now()
    data_expiracao = data_criacao + timedelta(seconds=request.tempo_expiracao)
    
    # Simular dados do recebedor
    nomes_recebedores = ["Loja Online LTDA", "Serviços Digitais ME", "Comércio Eletrônico"]
    nome_recebedor = random.choice(nomes_recebedores)
    
    pagamento_data = {
        "id": pagamento_id,
        "id_pedido": request.id_pedido,
        "valor": request.valor,
        "chave_pix_destino": request.chave_pix_destino,
        "descricao": request.descricao,
        "status": StatusPagamento.PENDENTE,
        "qr_code": f"data:image/png;base64,MOCK_QR_CODE_{pagamento_id}",
        "qr_code_texto": gerar_qr_code_texto(request.valor, request.chave_pix_destino, nome_recebedor),
        "data_criacao": data_criacao,
        "data_expiracao": data_expiracao,
        "data_atualizacao": None,
        "metadata": request.metadata or {}
    }
    
    db_pagamentos[pagamento_id] = pagamento_data
    
    # Simular processamento em background
    background_tasks.add_task(simular_callback_pagamento, pagamento_id)
    
    return PagamentoResponse(**pagamento_data)

@app.get("/pagamentos/{pagamento_id}", response_model=PagamentoResponse)
async def consultar_pagamento(pagamento_id: str):
    """Consulta um pagamento pelo ID"""
    pagamento = db_pagamentos.get(pagamento_id)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    # Verificar expiração
    if (pagamento["status"] == StatusPagamento.PENDENTE and 
        datetime.now() > pagamento["data_expiracao"]):
        pagamento["status"] = StatusPagamento.EXPIRADO
        pagamento["data_atualizacao"] = datetime.now()
    
    return PagamentoResponse(**pagamento)

@app.get("/pagamentos/pedido/{id_pedido}", response_model=PagamentoResponse)
async def consultar_pagamento_por_pedido(id_pedido: str):
    """Consulta pagamento pelo ID do pedido"""
    for pagamento in db_pagamentos.values():
        if pagamento["id_pedido"] == id_pedido:
            # Verificar expiração
            if (pagamento["status"] == StatusPagamento.PENDENTE and 
                datetime.now() > pagamento["data_expiracao"]):
                pagamento["status"] = StatusPagamento.EXPIRADO
                pagamento["data_atualizacao"] = datetime.now()
            
            return PagamentoResponse(**pagamento)
    
    raise HTTPException(status_code=404, detail="Pagamento não encontrado")

@app.post("/pagamentos/{pagamento_id}/webhook")
async def simular_webhook_externo(pagamento_id: str):
    """Endpoint para simular webhook externo (confirmação de pagamento)"""
    pagamento = db_pagamentos.get(pagamento_id)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    # Simular confirmação de pagamento
    if pagamento["status"] == StatusPagamento.PENDENTE:
        novo_status = simular_processamento_pagamento()
        db_pagamentos[pagamento_id]["status"] = novo_status
        db_pagamentos[pagamento_id]["data_atualizacao"] = datetime.now()
        
        await atualizar_status_pedido_por_pagamento(pagamento_id)
        await processar_webhook(pagamento_id)
    
    return {"message": "Webhook processado", "novo_status": pagamento["status"]}

@app.post("/webhooks")
async def configurar_webhook(config: WebhookConfig):
    """Configura URL para receber webhooks"""
    webhook_id = str(uuid.uuid4())
    webhook_data = {
        "id": webhook_id,
        "url": config.url,
        "secret": config.secret,
        "data_criacao": datetime.now()
    }
    db_webhooks.append(webhook_data)
    
    return {"id": webhook_id, "message": "Webhook configurado com sucesso"}

@app.get("/webhooks/logs")
async def consultar_logs_webhook():
    """Consulta logs de webhooks enviados"""
    return db_webhook_logs

# Endpoints administrativos
@app.post("/pagamentos/{pagamento_id}/simular/{status}")
async def simular_status_pagamento(pagamento_id: str, status: StatusPagamento):
    """Simula mudança de status (para testes)"""
    pagamento = db_pagamentos.get(pagamento_id)
    if not pagamento:
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    db_pagamentos[pagamento_id]["status"] = status
    db_pagamentos[pagamento_id]["data_atualizacao"] = datetime.now()
    
    await atualizar_status_pedido_por_pagamento(pagamento_id)
    await processar_webhook(pagamento_id)
    
    return {"message": f"Status alterado para {status}"}

@app.post("/pedidos/{pedido_id}/simular/{status}")
async def simular_status_pedido(pedido_id: str, status: StatusPedido):
    """Simula mudança de status do pedido (para testes)"""
    pedido = db_pedidos.get(pedido_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    
    db_pedidos[pedido_id]["status"] = status
    db_pedidos[pedido_id]["data_atualizacao"] = datetime.now()
    
    return {"message": f"Status do pedido alterado para {status}"}

@app.get("/dashboard")
async def dashboard():
    """Dashboard com estatísticas dos pagamentos e pedidos"""
    total_pagamentos = len(db_pagamentos)
    total_pedidos = len(db_pedidos)
    
    status_pagamento_count = {}
    status_pedido_count = {}
    valor_total = 0
    
    for pagamento in db_pagamentos.values():
        status = pagamento["status"]
        status_pagamento_count[status] = status_pagamento_count.get(status, 0) + 1
        if status == StatusPagamento.CONCLUIDO:
            valor_total += pagamento["valor"]
    
    for pedido in db_pedidos.values():
        status = pedido["status"]
        status_pedido_count[status] = status_pedido_count.get(status, 0) + 1
    
    return {
        "total_pagamentos": total_pagamentos,
        "total_pedidos": total_pedidos,
        "status_pagamento_count": status_pagamento_count,
        "status_pedido_count": status_pedido_count,
        "valor_total_processado": valor_total,
        "webhooks_configurados": len(db_webhooks),
        "webhooks_enviados": len(db_webhook_logs)
    }

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "total_pagamentos": len(db_pagamentos),
        "total_pedidos": len(db_pedidos),
        "ambiente": "mock"
    }

# Popula com dados iniciais
@app.on_event("startup")
async def startup_event():
    """Popula com alguns pedidos e pagamentos de exemplo"""
    
    # Pedidos de exemplo
    exemplos_pedidos = [
        {
            "cliente": {
                "nome": "João Silva",
                "email": "joao@email.com",
                "telefone": "11999999999"
            },
            "itens": [
                {
                    "id_produto": "prod_001",
                    "nome": "Smartphone XYZ",
                    "quantidade": 1,
                    "preco_unitario": 1500.00,
                    "categoria": "Eletrônicos"
                }
            ],
            "endereco_entrega": {
                "rua": "Rua das Flores, 123",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01234-567"
            }
        },
        {
            "cliente": {
                "nome": "Maria Santos",
                "email": "maria@email.com",
                "telefone": "11888888888"
            },
            "itens": [
                {
                    "id_produto": "prod_002",
                    "nome": "Livro Python Avançado",
                    "quantidade": 2,
                    "preco_unitario": 89.90,
                    "categoria": "Livros"
                },
                {
                    "id_produto": "prod_003", 
                    "nome": "Caneta Esferográfica",
                    "quantidade": 5,
                    "preco_unitario": 2.50,
                    "categoria": "Papelaria"
                }
            ]
        }
    ]
    
    for exemplo in exemplos_pedidos:
        pedido_id = gerar_id_pedido()
        cliente_id = gerar_id_cliente()
        data_criacao = datetime.now() - timedelta(hours=random.randint(1, 24))
        
        valor_total = sum(item["quantidade"] * item["preco_unitario"] for item in exemplo["itens"])
        
        db_pedidos[pedido_id] = {
            "id": pedido_id,
            "id_cliente": cliente_id,
            "cliente": exemplo["cliente"],
            "itens": exemplo["itens"],
            "valor_total": valor_total,
            "status": StatusPedido.CRIADO,
            "data_criacao": data_criacao,
            "data_atualizacao": None,
            "endereco_entrega": exemplo.get("endereco_entrega"),
            "id_pagamento": None,
            "metadata": {"fonte": "exemplo_inicial"}
        }

    # Pagamentos de exemplo
    exemplos_pagamentos = [
        {
            "valor": 150.50,
            "chave_pix_destino": "loja@email.com",
            "descricao": "Compra #001",
            "id_pedido": "PED001",
            "status": StatusPagamento.CONCLUIDO
        },
        {
            "valor": 89.90,
            "chave_pix_destino": "11999999999",
            "descricao": "Assinatura mensal",
            "id_pedido": "PED002",
            "status": StatusPagamento.PENDENTE
        }
    ]
    
    for exemplo in exemplos_pagamentos:
        pagamento_id = gerar_id_pagamento()
        data_criacao = datetime.now() - timedelta(hours=random.randint(1, 24))
        
        db_pagamentos[pagamento_id] = {
            "id": pagamento_id,
            "id_pedido": exemplo["id_pedido"],
            "valor": exemplo["valor"],
            "chave_pix_destino": exemplo["chave_pix_destino"],
            "descricao": exemplo["descricao"],
            "status": exemplo["status"],
            "qr_code": f"data:image/png;base64,MOCK_QR_CODE_{pagamento_id}",
            "qr_code_texto": gerar_qr_code_texto(exemplo["valor"], exemplo["chave_pix_destino"], "Loja Mock"),
            "data_criacao": data_criacao,
            "data_expiracao": data_criacao + timedelta(hours=1),
            "data_atualizacao": data_criacao if exemplo["status"] != StatusPagamento.PENDENTE else None,
            "metadata": {"plataforma": "mock"}
        }

import asyncio

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)