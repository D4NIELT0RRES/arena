#!/usr/bin/env python3
"""
Servidor HTTP simples para testar a aplicação no celular
Execute: python3 server.py
"""

import http.server
import socketserver
import webbrowser
import socket
import os

# Configurações
PORT = 8000
HOST = '0.0.0.0'  # Permite acesso de outros dispositivos na rede

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adicionar headers para permitir acesso mobile
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def get_local_ip():
    """Obtém o IP local da máquina"""
    try:
        # Conecta a um endereço externo para descobrir o IP local
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def main():
    # Mudar para o diretório do projeto
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Criar servidor
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        local_ip = get_local_ip()
        
        print("=" * 60)
        print("🚀 SERVIDOR INICIADO COM SUCESSO!")
        print("=" * 60)
        print(f"📱 Para acessar no celular:")
        print(f"   http://{local_ip}:{PORT}")
        print(f"   http://{local_ip}:{PORT}/index.html")
        print()
        print(f"💻 Para acessar no computador:")
        print(f"   http://localhost:{PORT}")
        print(f"   http://127.0.0.1:{PORT}")
        print()
        print("📋 INSTRUÇÕES:")
        print("1. Certifique-se que o celular está na MESMA rede WiFi")
        print("2. Abra o navegador do celular")
        print("3. Digite o endereço mostrado acima")
        print("4. Teste a aplicação!")
        print()
        print("⚠️  Para parar o servidor: Ctrl+C")
        print("=" * 60)
        
        # Abrir automaticamente no navegador
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        # Iniciar servidor
        httpd.serve_forever()

if __name__ == "__main__":
    main()
