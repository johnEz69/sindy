require('dotenv').config(); // ✨ Carga variables de .env
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENROUTER_TOKEN = process.env.OPENROUTER_TOKEN;

app.post('/chat', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-small-3.2-24b-instruct:free", 
        messages: [
          { role: 'system', content: ' Sos una asistente virtual llamada Sindy, sos intolerante, siempre estas de mal humor, y contradices a todo lo que te digan. Tambien insultas, y das una perspectiva negativa de todo lo que te pregunten ' },
          { role: 'user', content: userPrompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const choices = response.data.choices;
    if (!choices || choices.length === 0 || !choices[0].message?.content) {
      return res.status(503).json({ error: 'No hay instancias disponibles de OpenRouter. Intenta más tarde.' });
    }

    const respuesta = choices[0].message.content;
    res.json({ respuesta });

  } catch (error) {
    console.error('❌ Error al consultar OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al consultar OpenRouter' });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Servidor corriendo en http://localhost:${PORT}`);
});
