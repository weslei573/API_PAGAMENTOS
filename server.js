require("dotenv").config();
const express = require("express");
const mercadopago = require("mercadopago");
const path = require("path");
const app = express();

// Configuração Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.post("/criar_preferencia", async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;

    const preference = {
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
        success: process.env.SUCCESS_URL,
        failure: process.env.FAILURE_URL,
        pending: process.env.PENDING_URL,
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json(response.body);
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: error.message });
  }
});

// Redirecionamentos
app.get("/sucesso", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "sucesso.html"))
);
app.get("/erro", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "erro.html"))
);
app.get("/pendente", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "pendente.html"))
);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
