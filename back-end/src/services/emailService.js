import nodemailer from 'nodemailer';

function criarTransporter() {
    const obrigatorios = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const ausentes = obrigatorios.filter((campo) => !process.env[campo]);

    if (ausentes.length) {
        throw new Error(`Configure no .env: ${ausentes.join(', ')}`);
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

export async function enviarSenhaMedico({ nome, email, senha }) {
    const transporter = criarTransporter();
    const remetente = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from: remetente,
        to: email,
        subject: 'Acesso médico - BEAUTECH',
        text: `Olá, ${nome}!

Seu acesso de médico à BEAUTECH foi criado pelo administrador.

E-mail: ${email}
Senha temporária: ${senha}

Guarde essas informações com segurança.

BEAUTECH`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;line-height:1.6"><h2>BEAUTECH</h2><p>Olá, <strong>${nome}</strong>!</p><p>Seu acesso de médico foi criado pelo administrador.</p><p><strong>E-mail:</strong> ${email}<br><strong>Senha temporária:</strong> ${senha}</p><p>Guarde essas informações com segurança.</p><p>BEAUTECH</p></div>`
    });
}
