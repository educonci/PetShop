const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; // Use PORT consistentemente, já que é padrão para definir portas.

app.use(express.json());
app.use(cors({ origin: '*' })); // Use '*' para aceitar todas as origens ou especifique uma origem específica.



const connection = require('./db_config.js');

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// === CLIENTE ===

// Cadastrar Cliente
app.post('/cliente/cadastrar', (req, res) => {
    const query = 'INSERT INTO cliente (nome, telefone, endereco) VALUES (?, ?, ?)';
    const params = [
        req.body.nome,
        req.body.telefone,
        req.body.endereco];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar cliente.' });
        }
        res.status(201).json({ success: true, message: 'Cliente cadastrado com sucesso.' });
    });
});

// Rota para listar clientes
app.get('/clientes/listar', (req, res) => {
    const query = 'SELECT * FROM cliente';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar clientes:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar clientes.',
            });
        }

        res.status(200).json(results); // Retorna a lista de clientes
    });
});

// Deletar Cliente
app.delete('/cliente/deletar/:id', (req, res) => {
    const query = 'DELETE FROM cliente WHERE id = ?';
    const params = [req.params.id];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao deletar cliente:', err);
            return res.status(500).json({ success: false, message: 'Erro ao deletar cliente.' });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Cliente deletado com sucesso.' });
        } else {
            res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        }
    });
});

// Rota para listar animais
app.get('/animais/listar', (req, res) => {
    const query = 'SELECT * FROM animais';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar animais:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar animais.',
            });
        }

        res.status(200).json(results);
    });
});

//LISTAR NOMES DE ANIMAIS
app.get('/animais/listarNames', (req, res) => {
    const query = 'SELECT nome FROM animais';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar animais:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar animais.',
            });
        }

        res.status(200).json(results);
    });
});

//CADASTRAR ANIMAIS
app.post('/animais/cadastrar', (req, res) => {
    const query = 'INSERT INTO animais (nome, idade, tipo, nome_dono) VALUES (?, ?, ?, ?)';
    const params = [req.body.nome, req.body.idade, req.body.tipo, req.body.donos];

    connection.query(query, params, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'Já existe um animal com esse nome.' });
            }
            return res.status(500).json({ success: false, message: 'ERRO FATAL' });
        }
        res.status(201).json({ success: true, message: 'Animal cadastrado com sucesso.' });
    });
});


//LISTAR NOMES DE ANIMAIS
app.get('/animais/getID', (req, res) => {
    const query = 'SELECT id FROM animais WHERE nome = ?';
    const params = [
        req.query.nome,
    ]

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao listar animais:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar animais.',
            });
        }

        res.status(200).json(results);
    });
});

//UPDATE BICHO
app.post('/animais/editAnimal', (req, res) => {
    const query = 'UPDATE animais SET nome = ?, idade = ?, tipo = ?, nome_dono = ? WHERE id = ?';
    const params = [
        req.body.valorEditName,
        req.body.valorEditAge,
        req.body.valorEditType,
        req.body.valorEditDonos,
        req.body.idAtual
    ];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar animalLLLL.' });
        }
        res.status(201).json({ success: true, message: 'Animal atualizado com sucesso.' });
    });
});

//LISTAR NOMES DE ANIMAIS
app.get('/animais/getIDinfo', (req, res) => {
    const query = 'SELECT * FROM animais WHERE id = ?';
    const params = [
        req.query.id,
    ]

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao listar animais:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar animais.',
            });
        }

        res.status(200).json(results);
    });
});


//LISTAR NOMES DE ANIMAIS
app.get('/cliente/listarNames', (req, res) => {
    const query = 'SELECT nome FROM cliente';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar clientes:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar clientes.',
            });
        }

        res.status(200).json(results);
    });
});


//LISTAR NOMES DE ANIMAIS
app.get('/cliente/getID', (req, res) => {
    const query = 'SELECT id FROM cliente WHERE nome = ?';
    const params = [
        req.query.nome,
    ]

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao listar clientes:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar clientes.',
            });
        }

        res.status(200).json(results);
    });
});

//UPDATE BICHO
app.post('/cliente/editClient', (req, res) => {
    const query = 'UPDATE cliente SET nome = ?, telefone = ?, endereco = ? WHERE id = ?';

    const params = [
        req.body.valorEditName,
        req.body.valorEditNumber,
        req.body.valorEditAdress,
        req.body.idAtual
    ];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar cliente.' });
        }
        res.status(201).json({ success: true, message: 'cliente atualizado com sucesso.' });
    });
});

//LISTAR NOMES DE ANIMAIS
app.get('/cliente/getIDinfo', (req, res) => {
    const query = 'SELECT * FROM cliente WHERE id = ?';
    const params = [
        req.query.id,
    ]

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao listar animais:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar animais.',
            });
        }

        res.status(200).json(results);
    });
});

app.post('/cliente/deleteClient', (req, res) => {
    const query = 'DELETE FROM cliente WHERE id = ?;';

    const params = [
        req.body.idAtual
    ];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar cliente.' });
        }
        res.status(201).json({ success: true, message: 'cliente deletado com sucesso.' });
    });
});

app.post('/animais/deleteAnimal', (req, res) => {
    const query = 'DELETE FROM animais WHERE id = ?;';

    const params = [
        req.body.idAtual
    ];

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar animal.' });
        }
        res.status(201).json({ success: true, message: 'animal deletado com sucesso.' });
    });
});