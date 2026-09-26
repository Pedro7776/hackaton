// Importa o framework Express, que cuida de rotas, requisições e respostas HTTP
const express = require('express');

// Importa as rotas do fórum, organizadas por recurso
const usuariosRoutes = require('./routes/usuarios.routes');
const subforunsRoutes = require('./routes/subforuns.routes');
const postsRoutes = require('./routes/posts.routes');
const comentariosRoutes = require('./routes/comentarios.routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'Fórum API' });
});

// Registra as rotas sob seus respectivos prefixos
app.use('/usuarios', usuariosRoutes);
app.use('/subforuns', subforunsRoutes);
app.use('/posts', postsRoutes);
app.use('/comentarios', comentariosRoutes);

// 404 primeiro
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// erro por último
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
    console.log(`Fórum API - porta ${PORT}`);
});