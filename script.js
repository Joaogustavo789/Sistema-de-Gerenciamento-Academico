// Sibebar iniciais do nome e nome da pessoa
function loginSidebar() {
    const usuarioLogin = JSON.parse(localStorage.getItem("usuarios"));
    const loginStorage = localStorage.getItem("login");
    
    const usuarioFind = usuarioLogin.find((element) => (
        element.email === loginStorage
    ));

    // Nome dinâmico
    const iniciaisNomeUser = usuarioFind.nome.trim().split(/\s+/).map((element) => element[0]).slice(0, 2).join("").toUpperCase();
    document.getElementById("nomeUser").textContent = `Prof. ${usuarioFind.nome}`;

    // Iniciais do nome dinâmico
    document.getElementById("iniciaisNome").textContent = iniciaisNomeUser;
    document.getElementById("logoBrand").textContent = iniciaisNomeUser;
    document.getElementById("avatarMenu").textContent = iniciaisNomeUser;
}

loginSidebar();

// Sair/Logout
function logOut() {
    localStorage.removeItem("login");
    window.location.href = "Login-Cadastro/login.html";
}

document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    logOut();
});

function estaVazio(valor) {
    if (valor === undefined || valor === null) {
        return true;
    }
    if (String(valor).trim() === "") {
        return true;
    }
    return false;
}

function converterNota(valor) {
    if (estaVazio(valor)) {
        return 0;
    }
    let texto = String(valor).trim().replace(",", ".");
    return Number(texto);
}

function notaValida(nota) {
    if (isNaN(nota) || nota < 0 || nota > 10) {
        return false;
    }
    return true;
}

function calcularSituacaoAluno(p1, p2, projF1, projF2, notaFinal) {
    let n1 = converterNota(p1);
    let n2 = converterNota(p2);
    let f1 = converterNota(projF1);
    let f2 = converterNota(projF2);

    let erros = [];

    if (notaValida(n1) === false) {
        erros.push("p1");
    }
    if (notaValida(n2) === false) {
        erros.push("p2");
    }
    if (notaValida(f1) === false) {
        erros.push("projF1");
    }
    if (notaValida(f2) === false) {
        erros.push("projF2");
    }

    if (erros.length > 0) {
        return { valido: false, erros: erros };
    }

    // Regra 7.1: médias
    let notaIndividual = (n1 + n2) / 2;
    let notaProjeto = (f1 + f2) / 2;
    let media = notaIndividual * 0.4 + notaProjeto * 0.6;

    media = Math.round(media * 100) / 100;

    // Regra 7.2: status antes da prova final
    let status = "";
    let cor = "";
    let aplicaFinal = false;

    if (media >= 7) {
        status = "Aprovado";
        cor = "#279E5B";
    } else if (notaProjeto < 4) {
        status = "Reprovado";
        cor = "#E63946";
    } else {
        status = "Fará prova final";
        cor = "#F0A019";
        aplicaFinal = true;
    }

    // Regra 7.3: resultado da prova final
    let finalInvalida = false;

    if (aplicaFinal === true && estaVazio(notaFinal) === false) {
        let nf = converterNota(notaFinal);

        if (notaValida(nf) === false) {
            finalInvalida = true;
        } else {
            let soma = Math.round((notaProjeto + nf) * 100) / 100;

            if (soma >= 7) {
                status = "Aprovado";
                cor = "#279E5B";
            } else {
                status = "Reprovado";
                cor = "#E63946";
            }
        }
    }

    return {
        valido: true,
        notaIndividual: notaIndividual,
        notaProjeto: notaProjeto,
        media: media,
        status: status,
        cor: cor,
        aplicaFinal: aplicaFinal,
        finalInvalida: finalInvalida
    };
}

function atualizarAluno(nome) {
    let inputP1 = document.querySelector("#p1-" + nome);
    let inputP2 = document.querySelector("#p2-" + nome);
    let inputProjF1 = document.querySelector("#proj-f1-" + nome);
    let inputProjF2 = document.querySelector("#proj-f2-" + nome);
    let inputFinal = document.querySelector("#nota-final-" + nome);
    let celulaMedia = document.querySelector("#media-" + nome);
    let badge = document.querySelector("#media-" + nome + " + td .badge");

    inputP1.style.borderColor = "";
    inputP2.style.borderColor = "";
    inputProjF1.style.borderColor = "";
    inputProjF2.style.borderColor = "";

    let semNotas = estaVazio(inputP1.value) &&
                   estaVazio(inputP2.value) &&
                   estaVazio(inputProjF1.value) &&
                   estaVazio(inputProjF2.value);

    if (semNotas === true) {
        celulaMedia.textContent = "0,0";

        if (badge) {
            badge.textContent = "Sem notas";
            badge.style.backgroundColor = "#6C757D";
            badge.style.color = "#ffffff";
            badge.style.padding = "4px 12px";
            badge.style.borderRadius = "999px";
        }

        if (inputFinal) {
            inputFinal.disabled = true;
            inputFinal.value = "";
            inputFinal.style.borderColor = "";
        }
        return;
    }

    let r = calcularSituacaoAluno(
        inputP1.value,
        inputP2.value,
        inputProjF1.value,
        inputProjF2.value,
        inputFinal.value
    );

    if (r.valido === false) {
        for (let i = 0; i < r.erros.length; i++) {
            if (r.erros[i] === "p1") {
                inputP1.style.borderColor = "#E63946";
            }
            if (r.erros[i] === "p2") {
                inputP2.style.borderColor = "#E63946";
            }
            if (r.erros[i] === "projF1") {
                inputProjF1.style.borderColor = "#E63946";
            }
            if (r.erros[i] === "projF2") {
                inputProjF2.style.borderColor = "#E63946";
            }
        }
        return;
    }

    celulaMedia.textContent = r.media.toFixed(1).replace(".", ",");

    // Atualiza o status (texto e cor)
    if (badge) {
        badge.textContent = r.status;
        badge.style.backgroundColor = r.cor;
        badge.style.color = "#ffffff";
        badge.style.padding = "4px 12px";
        badge.style.borderRadius = "999px";
    }

    if (inputFinal) {
        inputFinal.placeholder = "-";

        if (r.aplicaFinal === true) {
            inputFinal.disabled = false;

            if (r.finalInvalida === true) {
                inputFinal.style.borderColor = "#E63946";
            } else {
                inputFinal.style.borderColor = "";
            }
        } else {
            inputFinal.disabled = true;
            inputFinal.value = "";
            inputFinal.style.borderColor = "";
        }
    }
}

function ativarAluno(nome) {
    let ids = ["#p1-", "#p2-", "#proj-f1-", "#proj-f2-", "#nota-final-"];

    for (let i = 0; i < ids.length; i++) {
        let campo = document.querySelector(ids[i] + nome);

        if (campo) {
            campo.addEventListener("input", function () {
                atualizarAluno(nome);
            });
        }
    }

    atualizarAluno(nome);
}


let alunos = ["beatriz", "carlos", "daniele", "eduardo", "fernanda", "gustavo", "ana", "bruno", "camila", "diego", "elisa", "felipe", "gabriela", "henrique", "isabela", "joao", "larissa", "marcos", "natalia", "otavio", "paula", "rafael"];

for (let i = 0; i < alunos.length; i++) {
    ativarAluno(alunos[i]);
}