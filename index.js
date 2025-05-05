const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// SUA URL DO WEB APP DO GOOGLE SCRIPT
const googleWebhook = "https://script.google.com/macros/s/AKfycbwcUWuoruFBSlHd428VkN4u9FXndqGWq2gVq-vWSf2eBY1eeGHx3UFB6eGXWmTD8PtOUw/exec";

// Rota raiz só para teste
app.get('/', (req, res) => {
    res.send('Proxy do checkout ativo!');
});

// Rota POST para quem quiser enviar por POST
app.post('/enviar', async (req, res) => {
    const { checkout_start, checkout_end, tempo_checkout, pagina } = req.body;

    if (!checkout_start || !checkout_end || !tempo_checkout || !pagina) {
        return res.status(400).send('Faltam parâmetros.');
    }

    const params = new URLSearchParams();
    params.append("checkout_start", checkout_start);
    params.append("checkout_end", checkout_end);
    params.append("tempo_checkout", tempo_checkout);
    params.append("pagina", pagina);

    try {
        const response = await fetch(`${googleWebhook}?${params.toString()}`);
        const text = await response.text();
        res.send(`Dados enviados para o Google Sheets (POST): ${text}`);
    } catch (error) {
        console.error('Erro ao enviar dados (POST):', error);
        res.status(500).send('Erro ao enviar dados (POST).');
    }
});

// Rota GET (para aceitar o que o Cartpanda está enviando hoje)
app.get('/enviar', async (req, res) => {
    const { checkout_start, checkout_end, tempo_checkout, pagina } = req.query;

    if (!checkout_start || !checkout_end || !tempo_checkout || !pagina) {
        return res.status(400).send('Faltam parâmetros.');
    }

    const params = new URLSearchParams();
    params.append("checkout_start", checkout_start);
    params.append("checkout_end", checkout_end);
    params.append("tempo_checkout", tempo_checkout);
    params.append("pagina", pagina);

    try {
        const response = await fetch(`${googleWebhook}?${params.toString()}`);
        const text = await response.text();
        res.send(`Dados enviados para o Google Sheets (GET): ${text}`);
    } catch (error) {
        console.error('Erro ao enviar dados (GET):', error);
        res.status(500).send('Erro ao enviar dados (GET).');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
