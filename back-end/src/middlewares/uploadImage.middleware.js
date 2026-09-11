import createMulter from '../configs/upload.multer.js';

const uploadPerfil = createMulter({
    pasta: 'perfil',
    tiposPermitidos: ['image/png', 'image/jpeg', 'image/webp'],
    tamanhoArquivo: 5 * 1024 * 1024
}).single('foto');

export default uploadPerfil;
