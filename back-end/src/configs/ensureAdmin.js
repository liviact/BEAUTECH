import bcrypt from 'bcrypt';
import { connection } from './Database.js';

export async function ensureAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@beautech.com';
    const senhaInicial = process.env.ADMIN_PASSWORD || 'Admin@123';

    const [existente] = await connection.execute(
        'SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1',
        [email]
    );

    if (existente.length) return;

    const senha = await bcrypt.hash(senhaInicial, 10);
    await connection.execute(
        `INSERT INTO usuarios
        (nome, email, senha, cpf, telefone, data_nascimento, endereco,
         foto_perfil, data_cadastro, nivel_acesso, ativo, tipo_pele, crm, especializacao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'admin', TRUE, NULL, NULL, NULL)`,
        [
            'Administrador BEAUTECH',
            email,
            senha,
            '00000000000',
            '(00) 00000-0000',
            '2000-01-01',
            'BEAUTECH',
            '/uploads/perfil/admin-default.svg'
        ]
    );

    console.log(`Administrador criado: ${email}`);
}
