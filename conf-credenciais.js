document.addEventListener("DOMContentLoaded", () => {
  const mp = new MercadoPago("SUA_CHAVE_PUBLICA_RENDER", {
    locale: "pt-BR",
  });

  document.querySelectorAll(".btn-missoes").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();

      const amount = button.dataset.value;
      const containerId = `checkout_${amount}`;
      const container = document.getElementById(containerId);

      try {
        // Limpar checkouts anteriores
        document
          .querySelectorAll(".checkout-container")
          .forEach((c) => (c.innerHTML = ""));

        // Exibir loading
        container.innerHTML = '<div class="loading">Carregando...</div>';

        const response = await fetch("/criar_preferencia", {
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
        if (!response.ok) throw new Error(data.error || "Erro no servidor");

        mp.checkout({
          preference: { id: data.id },
          render: {
            container: `#${containerId}`,
            label: "Pagar Agora",
            type: "wallet",
          },
        });
      } catch (error) {
        container.innerHTML = `<div class="error">${error.message}</div>`;
        console.error("Erro:", error);
      }
    });
  });
});
