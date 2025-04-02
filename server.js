require("dotenv").config();
const express = require("express");
const mercadopago = require("mercadopago");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Configuração do Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// Middlewares de segurança
app.use(helmet());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
});
app.use(limiter);

// Configuração CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

// Rota de saúde
app.get("/health", (req, res) => res.status(200).send("OK"));

// Rota principal
app.post("/criar_preferencia", async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;

    const preferenceData = {
      items: [
        {
          title: title.substring(0, 255),
          unit_price: Number(unit_price),
          quantity: Number(quantity),
          currency_id: "BRL",
        },
      ],
      payment_methods: {
        excluded_payment_types: [{ id: "atm" }],
        installments: 1,
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/sucesso`,
        failure: `${process.env.FRONTEND_URL}/erro`,
        pending: `${process.env.FRONTEND_URL}/pendente`,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preferenceData);
    res.json(response.body);
  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({
      error: "Erro ao processar pagamento",
      details: error.message,
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
