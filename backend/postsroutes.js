const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const autenticar = require('../middleware/auth.middleware');

// GET /posts
// Suporta filtros via query string:
//   ?subforum_id=2
//   ?usuario_id=3
//   ?busca=palavra-chave  (procura no título e no conteúdo)
router.get('/', async (req, res) => {
    const { subforum_id, usuario_id, busca } = req.query;

    let sql = `
        SELECT p.id, p.titulo, p.conteudo, p.criado_em,
               s.id AS subforum_id, s.nome AS subforum, s.slug AS subforum_slug,
               u.id AS usuario_id, u.nome AS autor
        FROM posts p
        JOIN usuarios u ON u.id = p.usuario_id
        JOIN subforuns s ON s.id = p.subforum_id
        WHERE 1 = 1
    `;
    const params = [];

    if (subforum_id) {
        sql += ' AND p.subforum_id = ?';
        params.push(Number(subforum_id));
    }

    if (usuario_id) {
        sql += ' AND p.usuario_id = ?';
        params.push(Number(usuario_id));
    }

    if (busca) {
        sql += ' AND (p.titulo LIKE ? OR p.conteudo LIKE ?)';
        params.push(`%${busca}%`, `%${busca}%`);
    }

    sql += ' ORDER BY p.criado_em DESC';

    try {
        const [posts] = await pool.query(sql, params);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

// GET /posts/:id
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [linhas] = await pool.query(
            `SELECT p.id, p.titulo, p.conteudo, p.criado_em,
                    s.id AS subforum_id, s.nome AS subforum, s.slug AS subforum_slug,
                    u.id AS usuario_id, u.nome AS autor
             FROM posts p
             JOIN usuarios u ON u.id = p.usuario_id
             JOIN subforuns s ON s.id = p.subforum_id
             WHERE p.id = ?`,
            [id]
        );

        if (linhas.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        res.json(linhas[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
});

// POST /posts  (autenticado) -> { titulo, conteudo, subforum_id }
router.post('/', autenticar, async (req, res) => {
    const { titulo, conteudo, subforum_id } = req.body;

    if (!titulo || !conteudo || !subforum_id) {
        return res.status(400).json({ error: 'Os campos "titulo", "conteudo" e "subforum_id" são obrigatórios' });
    }

    try {
        const [subforuns] = await pool.query('SELECT id FROM subforuns WHERE id = ?', [subforum_id]);
        if (subforuns.length === 0) {
            return res.status(404).json({ error: 'Subfórum não encontrado' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO posts (titulo, conteudo, subforum_id, usuario_id) VALUES (?, ?, ?, ?)',
            [titulo, conteudo, subforum_id, req.usuario.id]
        );

        res.status(201).json({
            id: resultado.insertId,
            titulo,
            conteudo,
            subforum_id,
            usuario_id: req.usuario.id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar post' });
    }
});

// PUT /posts/:id  (autenticado, só o autor pode editar)
router.put('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, conteudo, subforum_id } = req.body;

    try {
        const [linhas] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        const post = linhas[0];

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        if (post.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este post' });
        }

        if (subforum_id) {
            const [subforuns] = await pool.query('SELECT id FROM subforuns WHERE id = ?', [subforum_id]);
            if (subforuns.length === 0) {
                return res.status(404).json({ error: 'Subfórum não encontrado' });
            }
        }

        await pool.query(
            'UPDATE posts SET titulo = ?, conteudo = ?, subforum_id = ? WHERE id = ?',
            [titulo ?? post.titulo, conteudo ?? post.conteudo, subforum_id ?? post.subforum_id, id]
        );

        res.json({ id, titulo: titulo ?? post.titulo, conteudo: conteudo ?? post.conteudo, subforum_id: subforum_id ?? post.subforum_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar post' });
    }
});

// DELETE /posts/:id  (autenticado, só o autor pode excluir)
router.delete('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [linhas] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        const post = linhas[0];

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        if (post.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir este post' });
        }

        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir post' });
    }
});

module.exports = router;