
const express = require('express');
const app = express();
const PORT = 8000;

app.set('json spaces', 4);
app.use(express.urlencoded({ extended: true }));

const messages = {
    'pt-br': 'Olá, mundo!',
    'es': '¡Hola, mundo!',
    'en': 'Hello, world!'
};

function createGreeting(lang, name) {
    const greetings = {
        'pt-br': 'Olá',
        'es': 'Hola',
        'en': 'Hello'
    };

    if (name) {
        return `${greetings[lang]}, ${name.toUpperCase()}`;
    }

    return messages[lang];
}

app.get('/v1/hi', function(req, res) {
    const out = {
        msg: 'Hello, world!'
    };

    res.status(200).json(out);
});

app.get('/v1/hi/user/:name', function(req, res) {
    const out = {
        msg: 'Hello, ' + req.params.name.toUpperCase()
    };

    res.status(200).json(out);
});

app.post('/v1/hi', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Name is required'
        });
    }

    const out = {
        msg: `Hello, ${name.toUpperCase()} from POST!`
    };

    res.status(200).json(out);
});

app.get('/v2/hi', (req, res) => {
    const lang = req.query.lang || 'pt-br';
    const { name } = req.query;

    if (!messages[lang]) {
        return res.status(400).json({
            error: 'Idioma inválido',
            supportedLanguages: ['pt-br', 'es', 'en']
        });
    }

    res.status(200).json({
        msg: createGreeting(lang, name)
    });
});

app.post('/v2/hi', (req, res) => {
    const { name, lang = 'pt-br' } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            error: 'Name is required'
        });
    }

    if (!messages[lang]) {
        return res.status(400).json({
            error: 'Idioma inválido',
            supportedLanguages: ['pt-br', 'es', 'en']
        });
    }

    res.status(200).json({
        msg: createGreeting(lang, name.trim())
    });
});

app.get('/*splat', function(req, res) {
    res.status(404).json({
        error: 'Invalid endpoint'
    });
});

app.listen(PORT, () => {
    const msg = `Hello API running on PORT ${PORT}`;
    const link = `http://localhost:${PORT}`;

    console.log(msg + '\n' + link);
});
