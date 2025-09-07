# 📱 Como Testar no Celular

## 🚀 Opção 1: Servidor Local (Recomendado)

### Passo 1: Iniciar o Servidor
```bash
cd /Users/danieltorres/Documents/Arena
python3 server.py
```

### Passo 2: Acessar no Celular
1. **Certifique-se** que o celular está na **mesma rede WiFi** do computador
2. **Abra o navegador** do celular (Chrome, Safari, etc.)
3. **Digite o endereço** que aparece no terminal (ex: `http://192.168.1.100:8000`)
4. **Teste a aplicação** completa!

---

## 🌐 Opção 2: Hospedagem Gratuita

### Netlify (Mais Fácil)
1. Acesse: https://netlify.com
2. Faça login com GitHub
3. Arraste a pasta `Arena` para a área de deploy
4. Pronto! Sua aplicação estará online

### Vercel (Rápido)
1. Acesse: https://vercel.com
2. Conecte com GitHub
3. Importe o repositório
4. Deploy automático

### GitHub Pages
1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages nas configurações
4. Acesse: `https://seuusuario.github.io/nome-do-repo`

---

## 🔧 Opção 3: Servidor com Node.js

Se preferir Node.js:
```bash
# Instalar servidor global
npm install -g http-server

# Na pasta do projeto
cd /Users/danieltorres/Documents/Arena
http-server -p 8000 -a 0.0.0.0
```

---

## 📋 Checklist de Teste

### ✅ Funcionalidades para Testar:
- [ ] Abertura do modal de pedido
- [ ] Preenchimento do formulário
- [ ] Seleção de banco no PIX
- [ ] Abertura do banco no celular
- [ ] Cópia da chave PIX
- [ ] Confirmação de pagamento
- [ ] Geração do ticket
- [ ] Compartilhamento do ticket

### ✅ Testes de Responsividade:
- [ ] Layout em tela pequena
- [ ] Botões clicáveis
- [ ] Modais funcionando
- [ ] Texto legível
- [ ] Navegação fluida

---

## 🐛 Problemas Comuns

### "Não consegue acessar"
- ✅ Verifique se estão na mesma rede WiFi
- ✅ Desative firewall temporariamente
- ✅ Use o IP correto mostrado no terminal

### "Página não carrega"
- ✅ Verifique se o servidor está rodando
- ✅ Teste primeiro no computador
- ✅ Verifique a porta 8000

### "PIX não abre"
- ✅ Teste em diferentes navegadores
- ✅ Verifique se o banco tem app instalado
- ✅ Use a opção "Copiar Código PIX"

---

## 📞 Suporte

Se tiver problemas:
1. Verifique o terminal para mensagens de erro
2. Teste primeiro no computador
3. Verifique a conexão de rede
4. Tente diferentes navegadores

**Boa sorte com os testes! 🎉**
