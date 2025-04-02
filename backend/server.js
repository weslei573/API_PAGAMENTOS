require('dotenv').config();
const express = require('express');
const mercadopago = require('mercadopago');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
const app = express();

// Configuração do Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// Middlewares de Segurança
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX
});
app.use(limiter);

// CORS para produção
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    next();
});

// Rotas
app.post('/criar_preferencia', async (req, res) => {
    try {
        const { title, unit_price, quantity } = req.body;
        
        const preferenceData = {
            items: [{
                title: title.substring(0, 255),
                unit_price: Number(unit_price),
                quantity: Number(quantity),
                currency_id: 'BRL'
            }],
            payment_methods: {
                excluded_payment_types: [{ id: 'atm' }],
                installments: 1
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/sucesso`,
                failure: `${process.env.FRONTEND_URL}/erro`,
                pending: `${process.env.FRONTEND_URL}/pendente`
            },
            auto_return: "approved",
            notification_url: `${process.env.FRONTEND_URL}/notificacoes`
        };

        const response = await mercadopago.preferences.create(preferenceData);
        res.json(response.body);

    } catch (error) {
        console.error('Erro no backend:', error);
        res.status(500).json({
            error: 'Erro ao processar pagamento',
            details: error.message
        });
    }
});

// Redirecionamento HTTP -> HTTPS
if (process.env.NODE_ENV === 'production') {
    const httpApp = express();
    httpApp.get('*', (req, res) => {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    });
    httpApp.listen(80);
}

// Iniciar servidor HTTPS
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`Servidor HTTPS rodando na porta ${process.env.PORT}`);
});