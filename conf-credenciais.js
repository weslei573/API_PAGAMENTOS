document.addEventListener('DOMContentLoaded', () => {
  const mp = new MercadoPago('APP_USR-d4f099fe-592b-45fc-ba4a-eef0324848c5', {
      locale: 'pt-BR'
  });

  document.querySelectorAll('.btn-missoes').forEach(button => {
      button.addEventListener('click', async (e) => {
          e.preventDefault();
          
          // Limpa todos os checkouts anteriores
          document.querySelectorAll('.checkout-container').forEach(container => {
              container.innerHTML = '';
          });

          const amount = parseFloat(button.dataset.value);
          const parentSection = button.closest('.apoiar__box');
          const checkoutContainer = parentSection.querySelector('.checkout-container');

          try {
              // Exibe loading
              checkoutContainer.innerHTML = '<p>Carregando...</p>';
              
              const preference = await createPreference(amount);
              
              // Renderiza o checkout na seção específica
              mp.checkout({
                  preference: { id: preference.id },
                  render: {
                      container: checkoutContainer,
                      label: 'Pagar com Mercado Pago',
                      type: 'wallet', // Tipo de checkout
                  }
              });

          } catch (error) {
              checkoutContainer.innerHTML = `<p class="error">${error.message}</p>`;
              console.error('Erro completo:', error);
          }
      });
  });

  async function createPreference(amount) {
      try {
          const response = await fetch('http://localhost:3000/criar_preferencia', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  title: `Contribuição Mensal - R$ ${amount}`,
                  unit_price: amount,
                  quantity: 1
              })
          });

          const data = await response.json();
          
          if (!response.ok) {
              throw new Error(data.error || 'Erro ao criar pagamento');
          }

          return data;
      } catch (error) {
          throw new Error(`Falha na comunicação: ${error.message}`);
      }
  }
});