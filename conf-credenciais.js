document.addEventListener("DOMContentLoaded", () => {
  const mp = new MercadoPago("APP_USR-59168eef-c0e5-4e67-9a45-ae08de9d9693", {
    locale: "pt-BR",
  });

  document.querySelectorAll(".btn-missoes").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      // Limpa todos os checkouts
      document.querySelectorAll(".checkout-container").forEach((container) => {
        container.innerHTML = "";
      });

      const amount = button.dataset.value;
      const containerId = `checkout_${amount}`;

      try {
        // Exibe loading
        const container = document.getElementById(containerId);
        container.innerHTML = "<p>Carregando métodos de pagamento...</p>";

        const preference = await createPreference(amount);

        // Renderiza o checkout
        mp.checkout({
          preference: { id: preference.id },
          render: {
            container: `#${containerId}`,
            label: "Pagar Agora",
            type: "wallet",
          },
        });
      } catch (error) {
        document.getElementById(
          containerId
        ).innerHTML = `<p class="error">Erro: ${error.message}</p>`;
        console.error("Erro completo:", error);
      }
    });
  });

  async function createPreference(amount) {
    try {
      const response = await fetch("http://localhost:3000/criar_preferencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Contribuição Mensal - R$ ${amount}`,
          unit_price: amount,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pagamento");
      }

      return data;
    } catch (error) {
      throw new Error(`Falha na comunicação: ${error.message}`);
    }
  }
});
