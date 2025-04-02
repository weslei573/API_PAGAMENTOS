const express = require("express");
const mercadopago = require("mercadopago");
const app = express();

// Configuração do Mercado Pago (versão 1.5.x)
mercadopago.configurations.setAccessToken(
  "APP_USR-5808808895685245-040216-5db517eb05b8135d7ccef1ae8a6fbf8f-2350134427"
);

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Rota de criação de preferência
app.post("/criar_preferencia", async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;

    const preferenceData = {
      items: [
        {
          title: title.substring(0, 255), // Limita o título
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
        success: "http://localhost:3000/sucesso",
        failure: "http://localhost:3000/erro",
        pending: "http://localhost:3000/pendente",
      },
      auto_return: "approved",
      statement_descriptor: "CONTRIBUICAO",
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

// Rotas de redirecionamento
app.get("/sucesso", (req, res) =>
  res.send("Pagamento aprovado! Obrigado pela contribuição.")
);
app.get("/erro", (req, res) =>
  res.send("Pagamento recusado. Tente novamente.")
);
app.get("/pendente", (req, res) =>
  res.send("Pagamento pendente. Aguarde confirmação.")
);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
