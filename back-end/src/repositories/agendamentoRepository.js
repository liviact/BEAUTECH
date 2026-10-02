import { connection } from '../configs/Database.js';

const ativos = ['pendente','aceito'];

const agendamentoRepository = {
    limparPendentesExpirados: async () => {
        const [result]=await connection.execute(
            `DELETE FROM agendamentos
             WHERE status='pendente'
               AND (solicitado_em <= DATE_SUB(NOW(), INTERVAL 48 HOUR)
                    OR TIMESTAMP(data,hora) <= NOW())`
        );
        return result;
    },

    criarComDisponibilidade: async (agendamento) => {
        const conn=await connection.getConnection();
        const chave=`beautech:slot:${agendamento.idMedico}:${agendamento.data}:${String(agendamento.hora).slice(0,5)}`;
        let bloqueio=false;
        try {
            const [lockRows]=await conn.execute('SELECT GET_LOCK(?,10) AS bloqueado',[chave]);
            if (Number(lockRows[0]?.bloqueado)!==1) throw new Error('Não foi possível reservar o horário. Tente novamente.');
            bloqueio=true;

            const [ocupados]=await conn.execute(
                `SELECT id_agendamento FROM agendamentos
                 WHERE id_medico=? AND data=? AND hora=? AND status IN ('pendente','aceito')
                 LIMIT 1`,
                [agendamento.idMedico,agendamento.data,agendamento.hora]
            );
            if (ocupados.length) throw new Error('Este horário acabou de ser reservado por outro usuário. Escolha outro horário.');

            await conn.beginTransaction();
            const [result]=await conn.execute(
                `INSERT INTO agendamentos
                 (id_cliente,id_medico,data,hora,tipo_atendimento,id_procedimento,valor_consulta,status)
                 VALUES(?,?,?,?,?,?,?,'pendente')`,
                [
                    agendamento.idCliente,agendamento.idMedico,agendamento.data,agendamento.hora,
                    agendamento.tipoAtendimento || 'Procedimento',agendamento.idProcedimento,agendamento.valorConsulta
                ]
            );
            await conn.commit();
            return result;
        } catch(error) {
            try { await conn.rollback(); } catch {}
            throw error;
        } finally {
            if (bloqueio) { try { await conn.execute('SELECT RELEASE_LOCK(?)',[chave]); } catch {} }
            conn.release();
        }
    },

    selecionarPorUsuario: async (usuario) => {
        await agendamentoRepository.limparPendentesExpirados();
        const campo=usuario.tipo==='medico'?'a.id_medico':'a.id_cliente';
        const [rows]=await connection.execute(
            `SELECT a.*,c.nome AS cliente,m.nome AS medico,p.nome AS procedimento
             FROM agendamentos a
             INNER JOIN usuarios c ON c.id_usuario=a.id_cliente
             INNER JOIN usuarios m ON m.id_usuario=a.id_medico
             INNER JOIN procedimentos p ON p.id_procedimento=a.id_procedimento
             WHERE ${campo}=?
             ORDER BY a.data,a.hora`,
            [usuario.id]
        );
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows]=await connection.execute(
            `SELECT a.*,c.nome AS cliente,m.nome AS medico,p.nome AS procedimento
             FROM agendamentos a
             INNER JOIN usuarios c ON c.id_usuario=a.id_cliente
             INNER JOIN usuarios m ON m.id_usuario=a.id_medico
             INNER JOIN procedimentos p ON p.id_procedimento=a.id_procedimento
             WHERE a.id_agendamento=? LIMIT 1`,
            [id]
        );
        return rows[0];
    },

    buscarConsultasDoMedico: async (idMedico) => {
        return agendamentoRepository.selecionarPorUsuario({tipo:'medico',id:idMedico});
    },

    buscarConsultasDoMedicoNaData: async (idMedico,data) => {
        const [rows]=await connection.execute(
            `SELECT id_agendamento,id_medico,data,hora,status
             FROM agendamentos WHERE id_medico=? AND data=? AND status IN ('pendente','aceito')
             ORDER BY hora`,
            [idMedico,data]
        );
        return rows;
    },

    buscarDisponibilidade: async (idMedico,data) => {
        await agendamentoRepository.limparPendentesExpirados();
        const [configRows]=await connection.execute(
            `SELECT TIME_FORMAT(hora_abertura,'%H:%i') abertura,TIME_FORMAT(hora_fechamento,'%H:%i') fechamento
             FROM configuracoes_clinica WHERE id_configuracao=1`
        );
        const config=configRows[0];
        if (!config) throw new Error('Configuração de funcionamento não encontrada.');

        const [ocupados]=await connection.execute(
            `SELECT TIME_FORMAT(hora,'%H:%i') hora FROM agendamentos
             WHERE id_medico=? AND data=? AND status IN ('pendente','aceito')`,
            [idMedico,data]
        );
        const ocupadas=new Set(ocupados.map(x=>x.hora));

        const [ano,mes,dia]=String(data).slice(0,10).split('-').map(Number);
        const dataObj=new Date(ano,mes-1,dia);
        if (dataObj.getDay()===0) return [];

        const [ah,am]=config.abertura.split(':').map(Number);
        const [fh,fm]=config.fechamento.split(':').map(Number);
        const inicio=ah*60+am;
        const fim=fh*60+fm;
        const slots=[];
        for(let minutos=inicio;minutos+60<=fim;minutos+=60) {
            const hora=`${String(Math.floor(minutos/60)).padStart(2,'0')}:${String(minutos%60).padStart(2,'0')}`;
            const slotDate=new Date(ano,mes-1,dia,Math.floor(minutos/60),minutos%60);
            const passado=slotDate.getTime()<=Date.now();
            slots.push({hora,disponivel:!ocupadas.has(hora)&&!passado});
        }
        return slots;
    },

    atualizarStatus: async (id,status) => {
        const [result]=await connection.execute(`UPDATE agendamentos SET status=? WHERE id_agendamento=?`,[status,id]);
        return result;
    },

    reagendar: async (id,data,hora) => {
        const [result]=await connection.execute(
            `UPDATE agendamentos SET data=?,hora=?,status='pendente',solicitado_em=NOW() WHERE id_agendamento=?`,
            [data,hora,id]
        );
        return result;
    },

    excluir: async (id) => {
        const [result]=await connection.execute(`DELETE FROM agendamentos WHERE id_agendamento=?`,[id]);
        return result;
    },

    concluirComProntuario: async ({idAgendamento,processo,produtos,valor,observacoes}) => {
        const conn=await connection.getConnection();
        try {
            await conn.beginTransaction();
            const [agRows]=await conn.execute(
                `SELECT id_agendamento,id_cliente,id_medico,data,status,valor_consulta
                 FROM agendamentos WHERE id_agendamento=? FOR UPDATE`,
                [idAgendamento]
            );
            const ag=agRows[0];
            if (!ag) throw new Error('Agendamento não encontrado.');
            if (ag.status!=='aceito') throw new Error('Somente consultas aceitas podem ser concluídas.');

            const valorFinal=Number.isFinite(Number(valor)) ? Number(valor) : Number(ag.valor_consulta);
            await conn.execute(
                `INSERT INTO prontuarios
                 (id_agendamento,id_cliente,id_medico,data_atendimento,processo_realizado,produtos_utilizados,valor_consulta,observacoes)
                 VALUES(?,?,?,?,?,?,?,?)`,
                [idAgendamento,ag.id_cliente,ag.id_medico,ag.data,processo,produtos||null,valorFinal,observacoes||null]
            );
            await conn.execute(
                `UPDATE agendamentos SET status='concluido',valor_consulta=? WHERE id_agendamento=?`,
                [valorFinal,idAgendamento]
            );
            await conn.commit();
            return { ...ag, valor_consulta:valorFinal };
        } catch(error) {
            try { await conn.rollback(); } catch {}
            throw error;
        } finally { conn.release(); }
    }
};

export default agendamentoRepository;
