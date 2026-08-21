import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const baseUploadDir = path.resolve(process.cwd(), 'uploads');

const verificaDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const createMulter = ({ pasta, tiposPermitidos, tamanhoArquivo }) => {
    const pastaFinal = path.join(baseUploadDir, pasta.trim());
    verificaDir(pastaFinal);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, pastaFinal);
        },
        filename: (req, file, cb) => {
            const hash = crypto.randomBytes(12).toString('hex');
            cb(null, `${hash}-${file.originalname}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error("Tipo de arquivo não permitido"));
        }
        cb(null, true);
    }

    return multer({
        storage,
        limits: { fileSize: tamanhoArquivo }, 
        fileFilter
    });
}

export default createMulter;