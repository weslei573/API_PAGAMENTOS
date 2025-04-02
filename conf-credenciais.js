document.addEventListener('DOMContentLoaded', () => {
    const mp = new MercadoPago('APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', {
        locale: 'pt-BR'
    });

    document.querySelectorAll('.btn-missoes').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const amount = button.dataset.value;
            const containerId = `checkout_${amount}`;
            const container = document.getElementById(containerId);

            try {
                // Limpar checkouts anteriores
                document.querySelectorAll('.checkout-container').forEach(c => c.innerHTML = '');
                
                // Exibir loading
                container.innerHTML = '<div class="loading">Carregando...</div>';

                const response = await fetch('https://seudominio.com/criar_preferencia', {
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

                if (!response.ok) throw new Error('Erro ao criar pagamento');
                const preference = await response.json();

                // Renderizar checkout
                mp.checkout({
                    preference: { id: preference.id },
                    render: {
                        container: `#${containerId}`,
                        label: 'Pagar Agora',
                        type: 'wallet'
                    }
                });

            } catch (error) {
                container.innerHTML = `<div class="error">${error.message}</div>`;
                console.error('Erro:', error);
            }
        });
    });
});