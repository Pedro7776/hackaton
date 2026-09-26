const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const autenticar = require('../middleware/auth.middleware');

// GET /comentarios/post/:postId  -> lista comentários de um post
router.get('/post/:postId', async (req, res) => {
    const postId = Number(req.params.postId);

    try {
        const [comentarios] = await pool.query(
            `SELECT c.id, c.conteudo, c.criado_em,
                    u.id AS usuario_id, u.nome AS autor
             FROM comentarios c
             JOIN usuarios u ON u.id = c.usuario_id
             WHERE c.post_id = ?
             ORDER BY c.criado_em ASC`,
            [postId]
        );

        res.json(comentarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// POST /comentarios  (autenticado) -> body: { post_id, conteudo }
router.post('/', autenticar, async (req, res) => {
    const { post_id, conteudo } = req.body;

    if (!post_id || !conteudo) {
        return res.status(400).json({ error: 'Os campos "post_id" e "conteudo" são obrigatórios' });
    }

    try {
        const [posts] = await pool.query('SELECT id FROM posts WHERE id = ?', [post_id]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const [resultado] = await pool.query(
            'INSERT INTO comentarios (conteudo, post_id, usuario_id) VALUES (?, ?, ?)',
            [conteudo, post_id, req.usuario.id]
        );

        res.status(201).json({
            id: resultado.insertId,
            conteudo,
            post_id,
            usuario_id: req.usuario.id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
});

// DELETE /comentarios/:id  (autenticado, só o autor pode excluir)
router.delete('/:id', autenticar, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [linhas] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [id]);
        const comentario = linhas[0];

        if (!comentario) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        if (comentario.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir este comentário' });
        }

        await pool.query('DELETE FROM comentarios WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir comentário' });
    }
});

module.exports = router;
