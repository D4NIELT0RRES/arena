# Marmitas de Churrasco - Arena Transformados

Sistema de pedidos online para evento beneficente da Arena Transformados.

## 📁 Estrutura do Projeto

```
Arena/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   └── script.js       # JavaScript
├── assets/             # Imagens e outros recursos
└── README.md          # Este arquivo
```

## 🚀 Como usar

1. Abra o arquivo `index.html` em qualquer navegador
2. O sistema está pronto para uso

## ⚙️ Configurações

Para personalizar o sistema, edite as configurações no arquivo `js/script.js`:

```javascript
const CONFIG = {
    pixKey: '12.345.678/0001-90',              // CNPJ da instituição
    pixKeyType: 'cnpj',                        // Tipo da chave PIX
    merchantName: 'Arena Transformados',        // Nome da instituição
    eventName: 'Marmitas de Churrasco',         // Nome do evento
    amount: 25.00,                              // Valor da marmita
    eventDate: 'Sábado, 15 de Setembro',       // Data do evento
    description: 'Marmita de Churrasco - Arrecadação para o dia das crianças'
};
```

## 🎨 Personalização

- **Cores**: Edite as variáveis CSS no arquivo `css/styles.css`
- **Conteúdo**: Modifique o HTML no arquivo `index.html`
- **Funcionalidades**: Ajuste o JavaScript no arquivo `js/script.js`

## 📱 Funcionalidades

- ✅ Interface responsiva para mobile
- ✅ Formulário de pedido com validação
- ✅ Integração com PIX
- ✅ Geração de comprovante digital
- ✅ Compartilhamento via WhatsApp
- ✅ Formatação automática de telefone

## 🔧 Tecnologias

- HTML5
- CSS3 (com variáveis CSS)
- JavaScript (ES6+)
- Web Share API (opcional)
- Clipboard API

## 📄 Licença

Este projeto foi desenvolvido para uso da Arena Transformados.
# arena
