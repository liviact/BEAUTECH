import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import routes from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use(routes);

app.use((error, req, res, next) => {
    if (error?.message === 'Tipo de arquivo não permitido') {
        return res.status(400).json({ message: error.message });
    }
    if (error?.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'A foto deve ter no máximo 5 MB.' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
});

const port = process.env.SERVER_PORT || 8000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
