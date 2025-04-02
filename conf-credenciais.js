document.addEventListener("DOMContentLoaded", () => {
  const mp = new MercadoPago("APP_USR-59168eef-c0e5-4e67-9a45-ae08de9d9693", {
    locale: "pt-BR",
  });

  document.querySelectorAll(".btn-missoes").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const amount = button.dataset.value;
      const containerId = `checkout_${amount}`;

      // Limpar checkouts anteriores
      document
        .querySelectorAll(".checkout-container")
        .forEach((c) => (c.innerHTML = ""));

      try {
        // Mostrar loading
        const container = document.getElementById(containerId);
        container.innerHTML = "<p>Carregando...</p>";

        // Criar preferência
        const response = await fetch("/criar_preferencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `Apoio Mensal - R$ ${amount}`,
            unit_price: amount,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao criar pagamento");
        }

        const preference = await response.json();

        // Renderizar checkout
        mp.checkout({
          preference: { id: preference.id },
          render: {
            container: `#${containerId}`,
            label: "Continuar Pagamento",
            type: "wallet",
          },
        });
      } catch (error) {
        document.getElementById(containerId).innerHTML = `
                    <p class="error">Erro: ${error.message}</p>
                `;
        console.error("Erro:", error);
      }
    });
  });
});
