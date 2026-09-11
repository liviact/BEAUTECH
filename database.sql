DROP DATABASE IF EXISTS beautech;
CREATE DATABASE beautech;
USE beautech;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    foto_perfil VARCHAR(255) NOT NULL,
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
    nivel_acesso ENUM('cliente', 'medico') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_pele VARCHAR(50),
    crm VARCHAR(20) UNIQUE,
    especializacao VARCHAR(100),
    CONSTRAINT chk_usuario_tipo CHECK (
        nivel_acesso = 'cliente'
        OR (nivel_acesso = 'medico' AND crm IS NOT NULL AND especializacao IS NOT NULL)
    ),
    INDEX idx_usuarios_nivel_acesso (nivel_acesso),
    INDEX idx_usuarios_ativo (ativo),
    INDEX idx_usuarios_cpf (cpf),
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_crm (crm)
);

CREATE TABLE procedimentos (
    id_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE medico_procedimentos (
    id_medico INT NOT NULL,
    id_procedimento INT NOT NULL,
    PRIMARY KEY (id_medico, id_procedimento),
    CONSTRAINT fk_mp_medico FOREIGN KEY (id_medico)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_mp_procedimento FOREIGN KEY (id_procedimento)
        REFERENCES procedimentos(id_procedimento) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE agendamentos (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_medico INT NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_atendimento VARCHAR(100) NOT NULL DEFAULT 'Procedimento',
    status ENUM('pendente','aceito','recusado','cancelado','agendado','concluido','realizado') NOT NULL DEFAULT 'pendente',
    id_procedimento INT NOT NULL,
    CONSTRAINT fk_ag_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ag_medico FOREIGN KEY (id_medico)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ag_procedimento FOREIGN KEY (id_procedimento)
        REFERENCES procedimentos(id_procedimento) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_ag_cliente (id_cliente),
    INDEX idx_ag_medico (id_medico),
    INDEX idx_ag_procedimento (id_procedimento),
    INDEX idx_ag_data (data),
    INDEX idx_ag_status (status)
);

CREATE TABLE atendimentos (
    id_atendimento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_agendamento INT NOT NULL UNIQUE,
    data DATE NOT NULL,
    descricao_procedimento TEXT NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_at_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_at_agendamento FOREIGN KEY (id_agendamento)
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_at_cliente (id_cliente)
);

CREATE TABLE protocolos (
    id_protocolo INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_agendamento INT NOT NULL,
    descricao TEXT NOT NULL,
    etapas TEXT,
    produtos_utilizados TEXT,
    prognostico TEXT NOT NULL,
    recomendacoes TEXT,
    quantidade_sessoes INT,
    data_avaliacao DATE NOT NULL,
    CONSTRAINT fk_pr_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pr_agendamento FOREIGN KEY (id_agendamento)
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_pr_cliente (id_cliente),
    INDEX idx_pr_agendamento (id_agendamento)
);

INSERT INTO procedimentos (nome, descricao) VALUES
('Limpeza de Pele Profunda','Procedimento para limpeza e higienização profunda da pele.'),
('Peeling Químico','Procedimento estético realizado para renovação da pele.'),
('Botox','Procedimento estético utilizando toxina botulínica.'),
('Ácido Hialurônico','Procedimento para preenchimento e hidratação da pele.'),
('Microagulhamento','Procedimento realizado para estimular a renovação da pele.'),
('Skinbooster','Procedimento de hidratação profunda da pele.'),
('Bioestimulador de Colágeno','Procedimento destinado a estimular a produção de colágeno.'),
('Preenchimento Facial','Procedimento para harmonização e preenchimento facial.'),
('Peeling de Diamante','Procedimento de esfoliação e renovação superficial da pele.'),
('Drenagem Linfática','Técnica de massagem utilizada para auxiliar a circulação linfática.'),
('Massagem Relaxante','Procedimento corporal destinado ao relaxamento muscular.'),
('Depilação a Laser','Procedimento para redução dos pelos por meio de tecnologia a laser.'),
('Radiofrequência','Procedimento estético que utiliza radiofrequência para tratamento da pele.'),
('Criolipólise','Procedimento estético para redução localizada de gordura.'),
('Carboxiterapia','Procedimento estético que utiliza aplicação de dióxido de carbono.'),
('Ultrassom Estético','Procedimento que utiliza ondas ultrassônicas para tratamentos estéticos.'),
('Peeling de Diamante Facial','Procedimento de renovação e esfoliação da pele facial.'),
('Hidratação Facial','Procedimento destinado à hidratação e revitalização da pele.'),
('Tratamento para Acne','Procedimento destinado ao controle e tratamento da acne.'),
('Tratamento de Manchas','Procedimento destinado à redução e controle de manchas na pele.');
