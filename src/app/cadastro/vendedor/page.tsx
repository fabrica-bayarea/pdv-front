import * as Yup from "yup";

export default function Vendedor() {
    const form = Yup.object().shape({
        cpf: Yup.string()
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
            .required("CPF é obrigatório"),
        email: Yup.string()
            .email("Digite um email válido!")
            .required("O campo e-mail é obrigatório!"),
        nome: Yup.string()
            .min(4, "O nome precisa ter mais de 10 caracters")
            .max(100)
            .matches(/^[aA-zZ\s]+$/, "Digite um nome válido!"),
        telefone: Yup.string()
            .required("Telefone é obrigatório!")
            .matches(/\(\d{2}\) \d{5}-\d{4}/, "Digite um telefone válido!"),
        endereco: Yup.string().required("Endereço é obrigatório"),
        nascimento: Yup.string().required("Nascimento é obrigatório"),
    });

    return
}