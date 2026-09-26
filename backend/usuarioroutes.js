const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../config/db');

// POST /usuarios/registrar
router.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Os campos "nome", "email" e "senha" são obrigatórios' });
    }

    try {
        const [existentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existentes.length > 0) {
            return res.status(409).json({ error: 'Já existe um usuário com esse email' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );

        res.status(201).json({ id: resultado.insertId, nome, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// POST /usuarios/login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Os campos "email" e "senha" são obrigatórios' });
    }

    try {
        const [linhas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        const usuario = linhas[0];

        if (!usuario) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaOk) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email },
            process.env.JWT_SECRET || 'segredo_dev',
            { expiresIn: '7d' }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

module.exports = router;
