// Configurações do sistema
const CONFIG = {
    pixKey: '12.345.678/0001-90', // CNPJ da igreja (substitua pelo CNPJ real)
    pixKeyType: 'cnpj', // Tipo da chave: 'email', 'cpf', 'cnpj', 'phone', 'random'
    merchantName: 'Arena Transformados',
    eventName: 'Marmitas de Churrasco',
    amount: 25.00,
    eventDate: 'Sábado, 15 de Setembro',
    description: 'Marmita de Churrasco - Arrecadação para o dia das crianças',
    // Configurações de segurança
    requirePaymentConfirmation: true, // Exige confirmação de pagamento
    paymentTimeout: 30 * 60 * 1000, // 30 minutos para confirmar pagamento
    maxAttempts: 3 // Máximo de tentativas de confirmação
};

// Sistema de rastreamento de pedidos
const ORDER_TRACKING = {
    orders: new Map(),
    generateOrderId: () => 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
    generatePaymentId: () => 'PAY' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza a chave PIX na interface
    document.getElementById('pixKey').textContent = CONFIG.pixKey;

    // Formatação automática do telefone
    document.getElementById('customerPhone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            if (value.length < 14) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        }
        e.target.value = value;
    });
});

// Funções de modal
function openPurchaseModal() {
    document.getElementById('purchaseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('purchaseForm').reset();
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para gerar código PIX
function generatePixCode() {
    const pixData = {
        key: CONFIG.pixKey.replace(/[^\d]/g, ''), // Remove formatação do CNPJ
        amount: CONFIG.amount,
        description: CONFIG.description,
        merchantName: CONFIG.merchantName
    };
    
    // Formato do código PIX (EMV) - versão simplificada para melhor compatibilidade
    const pixCode = `00020126580014br.gov.bcb.pix0136${pixData.key}520400005303986540${pixData.amount.toFixed(2)}5802BR5913${pixData.merchantName}6009SAO PAULO62070503***6304`;
    
    return pixCode;
}

// Função para gerar link PIX para bancos específicos
function generatePixBankLinks() {
    const amount = CONFIG.amount.toFixed(2);
    const key = CONFIG.pixKey.replace(/[^\d]/g, ''); // Remove formatação do CNPJ
    const description = CONFIG.description;
    
    return {
        // Links para bancos populares (funcionam melhor no mobile)
        nubank: `https://nubank.com.br/pix?chave=${key}&valor=${amount}&descricao=${encodeURIComponent(description)}`,
        inter: `https://bancointer.com.br/pix?chave=${key}&valor=${amount}`,
        bradesco: `https://banco.bradesco/html/classic/pix.shtm?chave=${key}&valor=${amount}`,
        itau: `https://www.itau.com.br/pix?chave=${key}&valor=${amount}`,
        santander: `https://www.santander.com.br/pix?chave=${key}&valor=${amount}`,
        caixa: `https://www.caixa.gov.br/pix?chave=${key}&valor=${amount}`,
        bb: `https://www.bb.com.br/pix?chave=${key}&valor=${amount}`
    };
}

// Função para abrir PIX no banco
function openPixPayment() {
    // Sempre mostrar interface visual de seleção de bancos
    showBankSelectionModal();
}

// Função para mostrar modal de seleção de bancos
function showBankSelectionModal() {
    // Mostrar modal de seleção
    document.getElementById('bankSelectionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Atualizar informações
    document.getElementById('bankSelectionAmount').textContent = `R$ ${CONFIG.amount.toFixed(2)}`;
    document.getElementById('bankSelectionPixKey').textContent = CONFIG.pixKey;
}

// Função para fechar modal de seleção de bancos
function closeBankSelectionModal() {
    document.getElementById('bankSelectionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para selecionar banco
function selectBank(bankKey) {
    const banks = generatePixBankLinks();
    const bankUrls = {
        nubank: 'https://nubank.com.br/pix',
        inter: 'https://bancointer.com.br/pix',
        bradesco: 'https://banco.bradesco/html/classic/pix.shtm',
        itau: 'https://www.itau.com.br/pix',
        santander: 'https://www.santander.com.br/pix',
        caixa: 'https://www.caixa.gov.br/pix',
        bb: 'https://www.bb.com.br/pix'
    };
    
    const bankNames = {
        nubank: 'Nubank',
        inter: 'Banco Inter',
        bradesco: 'Bradesco',
        itau: 'Itaú',
        santander: 'Santander',
        caixa: 'Caixa',
        bb: 'Banco do Brasil'
    };
    
    const selectedBank = bankNames[bankKey];
    const bankUrl = bankUrls[bankKey];
    
    // Fechar modal
    closeBankSelectionModal();
    
    // Abrir banco
    window.open(bankUrl, '_blank');
    
    // Mostrar instruções
    setTimeout(() => {
        showBankInstructions(selectedBank);
    }, 1000);
}

// Função para mostrar instruções após selecionar banco
function showBankInstructions(bankName) {
    const instructions = `
🏦 ${bankName} - Instruções para PIX:

1. No app/site do ${bankName}, procure por "PIX" ou "Pagar com PIX"
2. Cole a chave PIX: ${CONFIG.pixKey}
3. Digite o valor: R$ ${CONFIG.amount.toFixed(2)}
4. Complete o pagamento
5. Volte aqui e clique em "Confirmar Pagamento"

💡 Dica: A chave PIX já está copiada na sua área de transferência!
    `;
    
    if (confirm(instructions + '\n\nDeseja copiar a chave PIX agora?')) {
        copyPixKey();
    }
}

// Função para mostrar outros bancos
function showOtherBanks() {
    const otherBanks = [
        'Sicoob', 'Sicredi', 'Banco do Nordeste', 'Banrisul', 
        'Banco Safra', 'BTG Pactual', 'Banco Original', 'Next',
        'C6 Bank', 'Banco Pan', 'Banco Votorantim', 'Banco do Estado do Pará'
    ];
    
    let optionsText = 'Outros bancos disponíveis:\n\n';
    otherBanks.forEach((bank, index) => {
        optionsText += `${index + 1}. ${bank}\n`;
    });
    
    optionsText += '\n0. Voltar ao menu anterior';
    
    const choice = prompt(optionsText);
    const choiceNum = parseInt(choice);
    
    if (choiceNum >= 1 && choiceNum <= otherBanks.length) {
        const selectedBank = otherBanks[choiceNum - 1];
        showBankInstructions(selectedBank);
    } else if (choiceNum === 0) {
        // Voltar ao modal de seleção
        return;
    }
}

// Função para mostrar opções de bancos no mobile
function showBankOptions() {
    const banks = generatePixBankLinks();
    const bankNames = {
        nubank: 'Nubank',
        inter: 'Banco Inter',
        bradesco: 'Bradesco',
        itau: 'Itaú',
        santander: 'Santander',
        caixa: 'Caixa',
        bb: 'Banco do Brasil'
    };
    
    let optionsText = 'Escolha seu banco para pagar com PIX:\n\n';
    let optionNumber = 1;
    
    for (const [key, url] of Object.entries(banks)) {
        optionsText += `${optionNumber}. ${bankNames[key]}\n`;
        optionNumber++;
    }
    
    optionsText += '\n0. Copiar código PIX';
    
    const choice = prompt(optionsText);
    const choiceNum = parseInt(choice);
    
    if (choiceNum >= 1 && choiceNum <= 7) {
        const bankKeys = Object.keys(banks);
        const selectedBank = bankKeys[choiceNum - 1];
        window.open(banks[selectedBank], '_blank');
    } else if (choiceNum === 0) {
        copyPixCode();
    }
}

// Função para mostrar opções no desktop
function showDesktopPixOptions() {
    const choice = confirm('No computador, você pode:\n\n✅ SIM: Abrir página do PIX do Banco Central\n❌ NÃO: Copiar código PIX para colar no banco');
    
    if (choice) {
        // Abrir página do PIX do Banco Central
        const pixUrl = `https://www.bcb.gov.br/estabilidadefinanceira/pix`;
        window.open(pixUrl, '_blank');
        
        // Mostrar instruções
        setTimeout(() => {
            alert('1. Na página do PIX, clique em "Pagar com PIX"\n2. Cole a chave CNPJ: ' + CONFIG.pixKey + '\n3. Digite o valor: R$ ' + CONFIG.amount.toFixed(2) + '\n4. Complete o pagamento');
        }, 1000);
    } else {
        copyPixCode();
    }
}

// Função para copiar código PIX
function copyPixCode() {
    const pixCode = generatePixCode();
    
    navigator.clipboard.writeText(pixCode).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Código PIX Copiado!';
        btn.style.background = 'rgba(39, 174, 96, 0.3)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
        }, 3000);
    }).catch(() => {
        alert('Código PIX copiado! Cole no seu aplicativo bancário.');
    });
}

// Função para copiar chave PIX (mantida para compatibilidade)
function copyPixKey() {
    navigator.clipboard.writeText(CONFIG.pixKey).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Chave Copiada!';
        btn.style.background = 'rgba(39, 174, 96, 0.3)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
        }, 2000);
    }).catch(() => {
        alert('Chave PIX: ' + CONFIG.pixKey);
    });
}

// Função para gerar número do ticket
function generateTicketNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `BBQ${timestamp.slice(-6)}${random}`;
}

// Função para processar compra
async function processPurchase() {
    const form = document.getElementById('purchaseForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();

    // Gerar IDs únicos para o pedido
    const orderId = ORDER_TRACKING.generateOrderId();
    const paymentId = ORDER_TRACKING.generatePaymentId();

    // Criar registro do pedido
    const orderData = {
        id: orderId,
        paymentId: paymentId,
        customer: { name, phone, email },
        amount: CONFIG.amount,
        status: 'pending_payment', // pending_payment, paid, confirmed, cancelled
        createdAt: new Date(),
        paymentConfirmedAt: null,
        attempts: 0,
        maxAttempts: CONFIG.maxAttempts
    };

    // Armazenar pedido
    ORDER_TRACKING.orders.set(orderId, orderData);

    // Log de segurança
    logSecurityEvent('order_created', orderId, {
        customer: orderData.customer,
        amount: orderData.amount
    });

    // Mostrar modal de confirmação de pagamento
    showPaymentConfirmationModal(orderData);
}

// Função para mostrar modal de confirmação de pagamento
function showPaymentConfirmationModal(orderData) {
    // Fechar modal de compra
    closePurchaseModal();
    
    // Mostrar modal de confirmação
    document.getElementById('paymentConfirmationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Atualizar informações no modal
    document.getElementById('confirmationOrderId').textContent = orderData.id;
    document.getElementById('confirmationAmount').textContent = `R$ ${orderData.amount.toFixed(2)}`;
    document.getElementById('confirmationCustomerName').textContent = orderData.customer.name;
    
    // Iniciar timer de timeout
    startPaymentTimeout(orderData.id);
}

// Função para iniciar timer de timeout do pagamento
function startPaymentTimeout(orderId) {
    const order = ORDER_TRACKING.orders.get(orderId);
    if (!order) return;

    setTimeout(() => {
        if (order.status === 'pending_payment') {
            order.status = 'cancelled';
            ORDER_TRACKING.orders.set(orderId, order);
            
            alert('⏰ Tempo esgotado! O pedido foi cancelado. Faça um novo pedido quando estiver pronto para pagar.');
            closePaymentConfirmationModal();
        }
    }, CONFIG.paymentTimeout);
}

// Função para confirmar pagamento
function confirmPayment() {
    const orderId = document.getElementById('confirmationOrderId').textContent;
    const order = ORDER_TRACKING.orders.get(orderId);
    
    if (!order) {
        alert('❌ Pedido não encontrado!');
        return;
    }

    if (order.status !== 'pending_payment') {
        alert('❌ Este pedido já foi processado!');
        return;
    }

    // Verificar se ainda está dentro do prazo
    const now = new Date();
    const timeDiff = now - order.createdAt;
    
    if (timeDiff > CONFIG.paymentTimeout) {
        alert('⏰ Tempo esgotado! O pedido foi cancelado.');
        closePaymentConfirmationModal();
        return;
    }

    // Simular verificação de pagamento (aqui você integraria com sua API de pagamento)
    const paymentConfirmed = simulatePaymentVerification(order);
    
    if (paymentConfirmed) {
        // Marcar como pago
        order.status = 'paid';
        order.paymentConfirmedAt = new Date();
        ORDER_TRACKING.orders.set(orderId, order);
        
        // Log de segurança
        logSecurityEvent('payment_confirmed', orderId, {
            amount: order.amount,
            customer: order.customer
        });
        
        // Gerar e mostrar ticket
        generateAndShowTicket(order);
    } else {
        // Incrementar tentativas
        order.attempts++;
        ORDER_TRACKING.orders.set(orderId, order);
        
        if (order.attempts >= order.maxAttempts) {
            order.status = 'cancelled';
            ORDER_TRACKING.orders.set(orderId, order);
            
            // Log de segurança
            logSecurityEvent('order_cancelled_max_attempts', orderId, {
                attempts: order.attempts,
                maxAttempts: order.maxAttempts
            });
            
            alert('❌ Número máximo de tentativas excedido. O pedido foi cancelado.');
            closePaymentConfirmationModal();
        } else {
            // Log de tentativa de pagamento
            logSecurityEvent('payment_attempt_failed', orderId, {
                attempt: order.attempts,
                remaining: order.maxAttempts - order.attempts
            });
            
            alert(`❌ Pagamento não confirmado. Tentativas restantes: ${order.maxAttempts - order.attempts}`);
        }
    }
}

// Função para simular verificação de pagamento
function simulatePaymentVerification(order) {
    // Em um sistema real, aqui você faria uma consulta à API do banco
    // ou sistema de pagamento para verificar se o PIX foi recebido
    
    // Para demonstração, vamos simular com confirmação do usuário
    return confirm(`Confirme que você realizou o pagamento PIX de R$ ${order.amount.toFixed(2)} para ${CONFIG.pixKey}?\n\n⚠️ IMPORTANTE: Só confirme se realmente fez o pagamento!`);
}

// Função para gerar e mostrar ticket
function generateAndShowTicket(order) {
    const ticketNumber = generateTicketNumber();
    
    // Atualizar informações do ticket
    document.getElementById('ticketNumber').textContent = '#' + ticketNumber;
    document.getElementById('ticketName').textContent = order.customer.name;
    
    // Fechar modal de confirmação e abrir modal do ticket
    closePaymentConfirmationModal();
    document.getElementById('ticketModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Marcar como confirmado
    order.status = 'confirmed';
    order.ticketNumber = ticketNumber;
    ORDER_TRACKING.orders.set(order.id, order);
    
    // Log de segurança
    logSecurityEvent('ticket_generated', order.id, {
        ticketNumber: ticketNumber,
        customer: order.customer
    });
}

// Função para fechar modal de confirmação de pagamento
function closePaymentConfirmationModal() {
    document.getElementById('paymentConfirmationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para verificar status do pedido
function checkOrderStatus(orderId) {
    const order = ORDER_TRACKING.orders.get(orderId);
    if (!order) return null;
    
    return {
        id: order.id,
        status: order.status,
        customer: order.customer,
        amount: order.amount,
        createdAt: order.createdAt,
        paymentConfirmedAt: order.paymentConfirmedAt,
        attempts: order.attempts,
        maxAttempts: order.maxAttempts
    };
}

// Função para listar todos os pedidos (para administração)
function getAllOrders() {
    const orders = [];
    ORDER_TRACKING.orders.forEach((order, id) => {
        orders.push({
            id: order.id,
            status: order.status,
            customer: order.customer,
            amount: order.amount,
            createdAt: order.createdAt,
            paymentConfirmedAt: order.paymentConfirmedAt
        });
    });
    return orders;
}

// Função para cancelar pedido
function cancelOrder(orderId) {
    const order = ORDER_TRACKING.orders.get(orderId);
    if (order && order.status === 'pending_payment') {
        order.status = 'cancelled';
        ORDER_TRACKING.orders.set(orderId, order);
        return true;
    }
    return false;
}

// Função para validar ticket (verificar se é válido)
function validateTicket(ticketNumber) {
    // Em um sistema real, você verificaria no banco de dados
    // Aqui vamos simular verificando se existe um pedido confirmado
    for (const [orderId, order] of ORDER_TRACKING.orders) {
        if (order.status === 'confirmed' && order.ticketNumber === ticketNumber) {
            return {
                valid: true,
                order: order
            };
        }
    }
    return { valid: false };
}

// Função para adicionar logs de segurança
function logSecurityEvent(event, orderId, details = {}) {
    const logEntry = {
        timestamp: new Date(),
        event: event,
        orderId: orderId,
        details: details,
        userAgent: navigator.userAgent,
        ip: 'client-side' // Em um sistema real, você capturaria o IP do servidor
    };
    
    console.log('🔒 Security Log:', logEntry);
    
    // Em um sistema real, você enviaria este log para um serviço de monitoramento
    // sendToSecurityService(logEntry);
}

// Função para compartilhar evento
function shareEvent() {
    const shareText = `🍖 ${CONFIG.eventName} - ${CONFIG.merchantName}\n📅 ${CONFIG.eventDate}\n💰 Apenas R$ ${CONFIG.amount.toFixed(2)}\n\nVenha participar do nosso evento beneficente!`;
    
    if (navigator.share) {
        navigator.share({
            title: CONFIG.eventName,
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + window.location.href)}`;
        window.open(shareUrl, '_blank');
    }
}

// Função para compartilhar ticket
function shareTicket() {
    const ticketNumber = document.getElementById('ticketNumber').textContent;
    const customerName = document.getElementById('ticketName').textContent;
    
    const shareText = `🎫 Comprovante de Compra\n\n${CONFIG.eventName}\n${CONFIG.merchantName}\n\nTicket: ${ticketNumber}\nCliente: ${customerName}\nValor: R$ ${CONFIG.amount.toFixed(2)}\n\nObrigado pela sua participação! 🙏`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Comprovante de Compra',
            text: shareText
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(shareUrl, '_blank');
    }
}

// Fechar modais ao clicar fora deles
window.addEventListener('click', function(event) {
    const purchaseModal = document.getElementById('purchaseModal');
    const bankSelectionModal = document.getElementById('bankSelectionModal');
    const paymentConfirmationModal = document.getElementById('paymentConfirmationModal');
    const ticketModal = document.getElementById('ticketModal');
    
    if (event.target === purchaseModal) {
        closePurchaseModal();
    }
    
    if (event.target === bankSelectionModal) {
        closeBankSelectionModal();
    }
    
    if (event.target === paymentConfirmationModal) {
        closePaymentConfirmationModal();
    }
    
    if (event.target === ticketModal) {
        closeTicketModal();
    }
});

// Fechar modais com tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePurchaseModal();
        closeBankSelectionModal();
        closePaymentConfirmationModal();
        closeTicketModal();
    }
});
