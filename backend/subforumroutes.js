const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const autenticar = require('../middleware/auth.middleware');

// Transforma "Front-end Dev" em "front-end-dev"
function gerarSlug(nome) {
    return nome
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// GET /subforuns  -> lista todos os subfóruns
router.get('/', async (req, res) => {
    try {
        const [subforuns] = await pool.query(
            `SELECT s.id, s.nome, s.slug, s.descricao, s.criado_em,
                    u.id AS criado_por, u.nome AS criador,
                    (SELECT COUNT(*) FROM posts p WHERE p.subforum_id = s.id) AS total_posts
             FROM subforuns s
             JOIN usuarios u ON u.id = s.criado_por
             ORDER BY s.nome ASC`
        );
        res.json(subforuns);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar subfóruns' });
    }
});

// GET /subforuns/:idOuSlug  -> aceita id numérico ou slug
router.get('/:idOuSlug', async (req, res) => {
    const { idOuSlug } = req.params;
    const campo = /^\d+$/.test(idOuSlug) ? 's.id' : 's.slug';

    try {
        const [linhas] = await pool.query(
            `SELECT s.id, s.nome, s.slug, s.descricao, s.criado_em,
                    u.id AS criado_por, u.nome AS criador
             FROM subforuns s
             JOIN usuarios u ON u.id = s.criado_por
             WHERE ${campo} = ?`,
            [idOuSlug]
        );

        if (linhas.length === 0) {
            return res.status(404).json({ error: 'Subfórum não encontrado' });
        }

        res.json(linhas[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar subfórum' });
    }
});

// GET /subforuns/:idOuSlug/posts  -> posts daquele subfórum
router.get('/:idOuSlug/posts', async (req, res) => {
    const { idOuSlug } = req.params;
    const campo = /^\d+$/.test(idOuSlug) ? 's.id' : 's.slug';

    try {
        const [subforum] = await pool.query(`SELECT id FROM subforuns s WHERE ${campo} = ?`, [idOuSlug]);
        if (subforum.length === 0) {
            return res.status(404).json({ error: 'Subfórum não encontrado' });
        }

        const [posts] = await pool.query(
            `SELECT p.id, p.titulo, p.conteudo, p.criado_em,
                    u.id AS usuario_id, u.nome AS autor
             FROM posts p
             JOIN usuarios u ON u.id = p.usuario_id
             WHERE p.subforum_id = ?
             ORDER BY p.criado_em DESC`,
            [subforum[0].id]
        );

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar posts do subfórum' });
    }
});

// POST /subforuns  (autenticado) -> { nome, descricao }
router.post('/', autenticar, async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ error: 'O campo "nome" é obrigatório' });
    }

    const slug = gerarSlug(nome);

    try {
        const [existente] = await pool.query('SELECT id FROM subforuns WHERE slug = ?', [slug]);
        if (existente.length > 0) {
            return res.status(409).json({ error: 'Já existe um subfórum com esse nome' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO subforuns (nome, slug, descricao, criado_por) VALUES (?, ?, ?, ?)',
            [nome, slug, descricao || null, req.usuario.id]
        );

        res.status(201).json({ id: resultado.insertId, nome, slug, descricao: descricao || null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar subfórum' });
    }
});

// PUT /subforuns/:id  (autenticado, só quem criou pode editar)
router.put('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    const { nome, descricao } = req.body;

    try {
        const [linhas] = await pool.query('SELECT * FROM subforuns WHERE id = ?', [id]);
        const subforum = linhas[0];

        if (!subforum) {
            return res.status(404).json({ error: 'Subfórum não encontrado' });
        }

        if (subforum.criado_por !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este subfórum' });
        }

        const novoNome = nome ?? subforum.nome;
        const novoSlug = nome ? gerarSlug(nome) : subforum.slug;

        await pool.query(
            'UPDATE subforuns SET nome = ?, slug = ?, descricao = ? WHERE id = ?',
            [novoNome, novoSlug, descricao ?? subforum.descricao, id]
        );

        res.json({ id, nome: novoNome, slug: novoSlug, descricao: descricao ?? subforum.descricao });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar subfórum' });
    }
});

// DELETE /subforuns/:id  (autenticado, só quem criou pode excluir)
router.delete('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [linhas] = await pool.query('SELECT * FROM subforuns WHERE id = ?', [id]);
        const subforum = linhas[0];

        if (!subforum) {
            return res.status(404).json({ error: 'Subfórum não encontrado' });
        }

        if (subforum.criado_por !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir este subfórum' });
        }

        await pool.query('DELETE FROM subforuns WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir subfórum' });
    }
});

module.exports = router;