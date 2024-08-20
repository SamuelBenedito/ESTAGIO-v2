const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos (HTML, JS, CSS)

const config = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'localhost',
    database: 'seu_banco_de_dados',
    options: {
        encrypt: true, // Use if on Azure
        trustServerCertificate: true, // Use if self-signed certificate
    }
};

// Rota para obter todos os temas
app.get('/temas', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM TEMA');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para adicionar um novo tema
app.post('/temas', async (req, res) => {
    const { nome } = req.body;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('nome', sql.VarChar, nome)
            .query('INSERT INTO TEMA (nome) VALUES (@nome)');
        res.status(201).send('Tema adicionado');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para atualizar um tema
app.put('/temas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar, nome)
            .query('UPDATE TEMA SET nome = @nome WHERE idTema = @id');
        res.send('Tema atualizado');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Rota para excluir um tema
app.delete('/temas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM TEMA WHERE idTema = @id');
        res.send('Tema excluído');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
