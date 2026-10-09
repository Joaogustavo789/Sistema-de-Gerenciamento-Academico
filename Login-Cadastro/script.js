function pegarValores(id) {
    const input = document.getElementById(id);
    if (!input) {
        console.error(`Elemento com id "${id}" não encontrado.`);
    }
    console.log(`Valor do input com id "${id}":`, input.value);
    return input
}

function salvarUsuario(event) {

    event.preventDefault();
    const nome = pegarValores("name").value;
    const email = pegarValores("email").value;
    const disciplina = pegarValores("subject").value;
    const senha = pegarValores("password").value;
    const confirmSenha = pegarValores("confirm-password").value;

    if (senha !== confirmSenha) {
        pegarValores("alert-container").querySelector("p").textContent = "As senhas não coincidem. Por favor, tente novamente.";
        return;
    }

    if (!nome || !email || !disciplina || !senha) {
        pegarValores("alert-container").querySelector("p").textContent = "Por favor, preencha todos os campos.";
        return;
    }

    if (!email.endsWith("@maisunifacisa.com.br")) {
        pegarValores("alert-container").querySelector("p").textContent = "Por favor, use um email institucional válido.";
        return;
    }

    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/[0-9]/.test(senha)) {
        pegarValores("alert-container").querySelector("p").textContent = "A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula e um número.";
        return;
    }

    const usuario = { 
    "nome": nome, 
    "email": email, 
    "disciplina": disciplina, 
    "senha": senha 
};

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

if (usuarios.some(u => u.email === email)) {
    pegarValores("alert-container").querySelector("p").textContent = "Este email já está cadastrado. Por favor, use outro email.";
    return;
}

usuarios.push(usuario);

localStorage.setItem("usuarios", JSON.stringify(usuarios));
alert("Cadastro salvo!");
window.location.href = "login.html";

}

function loginUsuario(event) {

    event.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const email = pegarValores("email").value;
    const senha = pegarValores("password").value;

    if (!email || !senha) {
        pegarValores("alert-container").querySelector("p").textContent = "Por favor, preencha todos os campos";
        return;
    }

    if (usuarios.length === 0) {
        pegarValores("alert-container").querySelector("p").textContent = "Nenhum usuário cadastrado";
        return;
    }

    for (const usuario of usuarios) {
        if (usuario.email === email && usuario.senha === senha) {
            pegarValores("alert-container").querySelector("p").textContent = "Login bem-sucedido!";
            window.location.href = "../menu.html";
            return;
        }
    }

    pegarValores("alert-container").querySelector("p").textContent = "Email ou senha incorretos";
}
