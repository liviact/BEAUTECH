export class Medico {
    #id;
    #nome;
    #email;
    #senha;
    #crm;
    #especializacao;

    constructor(nome, email, senha, crm, especializacao, id = null) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.crm = crm;
        this.especializacao = especializacao;
        this.id = id;
    }

    static criar(dados) {
        return new Medico(
            dados.nome,
            dados.email,
            dados.senha,
            dados.crm,
            dados.especializacao
        );
    }
}
