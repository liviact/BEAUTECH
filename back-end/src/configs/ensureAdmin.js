import bcrypt from 'bcrypt';
import { connection } from './Database.js';

export async function ensureAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@beautech.com';
    const senhaInicial = process.env.ADMIN_PASSWORD || 'Admin@123';

    const [existente] = await connection.execute(
        'SELECT id_usuario FROM usuarios WHERE email=? LIMIT 1',[email]
    );

    let adminId;
    if (!existente.length) {
        const senha=await bcrypt.hash(senhaInicial,10);
        const [result]=await connection.execute(
            `INSERT INTO usuarios
             (nome,email,senha,cpf,telefone,data_nascimento,cep,logradouro,numero,complemento,bairro,cidade,uf,
              foto_perfil,nivel_acesso,ativo)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'admin', TRUE)`,
            [
                'Administrador BEAUTECH',email,senha,'00000000000','(00) 00000-0000','2000-01-01',
                '00000000','BEAUTECH','0',null,'Centro','São Paulo','SP','/uploads/perfil/admin-default.svg'
            ]
        );
        adminId=result.insertId;
        console.log(`Administrador criado: ${email}`);
    } else {
        adminId=existente[0].id_usuario;
    }

    await connection.execute(
        `UPDATE configuracoes_clinica SET atualizado_por=? WHERE id_configuracao=1`,
        [adminId]
    );
}
