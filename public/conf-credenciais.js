document.addEventListener("DOMContentLoaded", () => {
  const mp = new MercadoPago("APP_USR-59168eef-c0e5-4e67-9a45-ae08de9d9693", {
    locale: "pt-BR",
  });

  document.querySelectorAll(".btn-missoes").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const amount = button.dataset.value;

      // 1. Verificação de elemento existente
      const containerId = `checkout-${amount}`;
      const container = document.getElementById(containerId);

      if (!container) {
        console.error(`Container #${containerId} não encontrado`);
        return;
      }

      // 2. Limpeza segura
      document.querySelectorAll(".checkout-container").forEach((c) => {
        if (c.id !== containerId) c.innerHTML = ""; // Só limpa outros containers
      });

      try {
        // 3. Feedback visual
        container.innerHTML = '<div class="loading">Carregando...</div>';

        // 4. Criação da preferência
        const response = await fetch(
          "https://api-pagamentos-f5wv.onrender.com/criar_preferencia",
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const preference = await response.json();

        // 5. Renderização segura
        if (document.getElementById(containerId)) {
          mp.checkout({
            preference: { id: preference.id },
            render: {
              container: `#${containerId}`,
              label: "Pagar Agora",
              type: "wallet",
            },
          });
        }
      } catch (error) {
        // 6. Tratamento de erros completo
        console.error("Erro completo:", error);
        if (container) {
          container.innerHTML = `
                    <div class="error">
                        Erro: ${error.message}<br>
                        <button onclick="location.reload()">Tentar novamente</button>
                    </div>
                `;
        }
      }
    });
  });
});
