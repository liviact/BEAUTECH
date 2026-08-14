export class Cliente {

    constructor(
        nome,
        telefone,
        cpf,
        senha,
        tipo_pele,
        endereco,
        data_cadastro = new Date(),
        id = null
    ){
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.cpf = cpf;
        this.senha = senha;
        this.tipo_pele = tipo_pele;
        this.endereco = endereco;
        this.data_cadastro = data_cadastro;
    }

    static criar(dados){
        return new Cliente(
            dados.nome,
            dados.telefone,
            dados.cpf,
            dados.senha,
            dados.tipo_pele,
            dados.endereco
        );
    }
}
