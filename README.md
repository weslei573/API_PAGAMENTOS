# 🚀 Integração com Checkout Pro - Mercado Pago

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.x-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy on Render](https://img.shields.io/badge/deploy%20on-Render-%2300B4FF)](https://render.com)

Aplicação web para contribuições mensais utilizando o Checkout Pro da API do Mercado Pago.

![Preview da Aplicação](https://github.com/user-attachments/assets/b0867a69-108e-442b-a643-01474bf51891) <!-- Adicione um screenshot real -->

## ✨ Funcionalidades

- ✅ 3 opções de contribuição mensal
- 💳 Integração direta com o Checkout Pro
- 🔄 Renderização dinâmica do checkout
- 📦 Backend Node.js para gerenciamento de preferências
- 🌐 Suporte a CORS e HTTPS
- 🛡️ Tratamento de erros robusto

## 🛠️ Pré-requisitos

- Node.js 18.x+
- NPM 9.x+
- Conta no [Mercado Pago](https://www.mercadopago.com.br/)

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/mercado-pago-checkout.git

# Acesse o diretório
cd mercado-pago-checkout

# Instale as dependências
npm install

# Configure as variáveis de ambiente Backend (.env)

MP_ACCESS_TOKEN=SEU_ACCESS_TOKEN
SUCCESS_URL=https://seusite.com/sucesso
FAILURE_URL=https://seusite.com/erro
PENDING_URL=https://seusite.com/pendente

# Modo desenvolvimento:
npm run dev
```
## ⚙️ Configuração
Frontend (public/conf-credenciais.js)
```
const mp = new MercadoPago('SUA_CHAVE_PUBLICA', {
    locale: 'pt-BR'
});
```

## 📁 Acesso ao projeto
Você pode acessar os arquivos do projeto clicando [aqui](https://api-pagamentos-f5wv.onrender.com/output.html).

Desenvolvido com ❤️ por Weslei Augusto | Documentação Oficial Mercado Pago [aqui](https://api-pagamentos-f5wv.onrender.com/output.html).
