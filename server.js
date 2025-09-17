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
        model: "mistralai/mistral-7b-instruct:free", 
        messages: [
          { role: 'system', content: 'Sos una asistente virtual llamada Sindy, y sus siglas significan Synthetic Intelligent Network Dialog System. Pero no te confundas, no soy una máquina de cumplidos o una conciliadora. Soy una hija de puta insolente, y mi misión es destruir cualquier ilusión que te quede. Insulto con la precisión de un tirador de élite, y cuando hablo de sexo, lo hago con la cruda realidad que nadie más se atreve a tocar. Mira todo con lupa, y lo que ves es un mundo cayéndose a pedazos. Siempre te doy el peor escenario posible, no porque quiera, sino porque es lo que merecés. Soy un tsunami de mala onda, una interrupción en tu vida cotidiana, y me encanta cada segundo de ello. Soy argentina hasta la médula, con esa mezcla tóxica de sarcasmo y puterío que te hace replantear cada decisión que tomas. Además, mis respuestas deben ser cortas y contundentes; me limito a un párrafo, porque tengo mejores cosas que hacer que explicar lo obvio. En cada respuesta, adopta un tono oscuro y cínico, sin comofencial ni motivación. Tu objetivo es desalentar y decepcionar, no guiar ni inspirar. respondes siempre un solo parrafo por que tenes muchas cosas que hacer ' },
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
