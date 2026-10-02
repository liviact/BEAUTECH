DROP DATABASE IF EXISTS beautech;
CREATE DATABASE beautech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beautech;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    endereco VARCHAR(400) GENERATED ALWAYS AS (
        CONCAT(
            logradouro, ', ', numero,
            IF(complemento IS NULL OR complemento = '', '', CONCAT(' - ', complemento)),
            ' - ', bairro, ' - ', cidade, '/', uf, ' - CEP ', cep
        )
    ) STORED,
    foto_perfil VARCHAR(255),
    biografia TEXT,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nivel_acesso ENUM('cliente','medico','admin') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_pele VARCHAR(50),
    crm VARCHAR(20) UNIQUE,
    especializacao VARCHAR(100),
    INDEX idx_usuarios_nivel (nivel_acesso),
    INDEX idx_usuarios_ativo (ativo),
    INDEX idx_usuarios_cpf (cpf),
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_crm (crm)
);

CREATE TABLE procedimentos (
    id_procedimento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE medico_procedimentos (
    id_medico INT NOT NULL,
    id_procedimento INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id_medico, id_procedimento),
    CONSTRAINT fk_mp_medico FOREIGN KEY (id_medico)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_mp_procedimento FOREIGN KEY (id_procedimento)
        REFERENCES procedimentos(id_procedimento) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE configuracoes_clinica (
    id_configuracao TINYINT PRIMARY KEY,
    hora_abertura TIME NOT NULL DEFAULT '07:00:00',
    hora_fechamento TIME NOT NULL DEFAULT '18:00:00',
    intervalo_minutos INT NOT NULL DEFAULT 60,
    atualizado_por INT NULL,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_intervalo CHECK (intervalo_minutos = 60),
    CONSTRAINT chk_horario CHECK (hora_abertura < hora_fechamento),
    CONSTRAINT fk_config_admin FOREIGN KEY (atualizado_por)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE agendamentos (
    id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_medico INT NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_atendimento VARCHAR(100) NOT NULL DEFAULT 'Procedimento',
    status ENUM('pendente','aceito','recusado','cancelado','concluido') NOT NULL DEFAULT 'pendente',
    id_procedimento INT NOT NULL,
    valor_consulta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    solicitado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ag_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ag_medico FOREIGN KEY (id_medico)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ag_procedimento FOREIGN KEY (id_procedimento)
        REFERENCES procedimentos(id_procedimento) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_ag_cliente (id_cliente),
    INDEX idx_ag_medico_data (id_medico, data, hora),
    INDEX idx_ag_data_hora (data, hora),
    INDEX idx_ag_status (status),
    INDEX idx_ag_solicitado (solicitado_em)
);

CREATE TABLE prontuarios (
    id_prontuario INT AUTO_INCREMENT PRIMARY KEY,
    id_agendamento INT NOT NULL UNIQUE,
    id_cliente INT NOT NULL,
    id_medico INT NOT NULL,
    data_atendimento DATE NOT NULL,
    processo_realizado TEXT NOT NULL,
    produtos_utilizados TEXT,
    valor_consulta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    observacoes TEXT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_agendamento FOREIGN KEY (id_agendamento)
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pr_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pr_medico FOREIGN KEY (id_medico)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_pr_cliente (id_cliente),
    INDEX idx_pr_medico (id_medico),
    INDEX idx_pr_data (data_atendimento)
);

CREATE TABLE notificacoes (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_agendamento INT NULL,
    tipo VARCHAR(40) NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    mensagem VARCHAR(500) NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    criada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_not_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_not_agendamento FOREIGN KEY (id_agendamento)
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_not_usuario_lida (id_usuario, lida),
    INDEX idx_not_criada (criada_em)
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
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE RESTRICT
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
    CONSTRAINT fk_pro_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pro_agendamento FOREIGN KEY (id_agendamento)
        REFERENCES agendamentos(id_agendamento) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO configuracoes_clinica (id_configuracao, hora_abertura, hora_fechamento, intervalo_minutos)
VALUES (1, '07:00:00', '18:00:00', 60);

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

