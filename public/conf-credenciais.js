document.addEventListener("DOMContentLoaded", () => {
  const mp = new MercadoPago("APP_USR-59168eef-c0e5-4e67-9a45-ae08de9d9693", {
    locale: "pt-BR",
  });

  document.querySelectorAll(".btn-missoes").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const amount = button.dataset.value;
      const container = document.getElementById(`checkout-${amount}`);

      // Limpa todos os checkouts
      document
        .querySelectorAll(".checkout-container")
        .forEach((c) => (c.innerHTML = ""));

      try {
        container.innerHTML = "<p>Carregando...</p>";

        const response = await fetch(
          "https://seuservidor.com/criar_preferencia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: `Contribuição Mensal - R$ ${amount}`,
              unit_price: amount,
              quantity: 1,
            }),
          }
        );

        const preference = await response.json();

        mp.checkout({
          preference: { id: preference.id },
          render: {
            container: `#checkout-${amount}`,
            label: "Pagar Agora",
            type: "wallet",
          },
        });
      } catch (error) {
        container.innerHTML = `<p class="error">Erro: ${error.message}</p>`;
        console.error(error);
      }
    });
  });
});
