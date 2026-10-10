// SGA - Meu Perfil
// Depende do avatar.js (importar antes deste arquivo).

const CHAVE_PROFESSORES = "usuarios"; // mesma chave usada no cadastro do Jose
const CHAVE_LOGIN = "login";
const PAGINA_LOGIN = "login.html";
const TAMANHO_MAX = 2 * 1024 * 1024; // 2 MB
const TIPOS_ACEITOS = ["image/png", "image/jpeg"];

function getUserPerfil() {
  const userLogado = localStorage.getItem(CHAVE_LOGIN);
  const professores = lerJSON( CHAVE_PROFESSORES, []);

  return professores.find((professor) => (
    professor.email === userLogado
  ))
}

function carregarAvatarPerfil(usuario) {
  const foto = obterFoto(usuario.email);

  document.querySelectorAll("[data-avatar]").forEach((element) => {
    if (foto) {
      element.style.backgroundImage = `url(${foto})`;
      element.textContent = "";
    } else {
      element.style.backgroundImage = "none";
      element.textContent = obterIniciais(usuario.nome)
    }
  })
}

function mostrarMensagem(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "mensagem " + (tipo || "");
}

function preencherTela(usuario) {
  document.getElementById("nome").value = usuario.nome || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("disciplina").value = usuario.disciplina || "";
  document.getElementById("menuNome").textContent = "Prof. " + (usuario.nome || "");
  carregarAvatarPerfil(usuario);
}

function validarImagem(arquivo) {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    return "Formato inválido. Envie uma imagem PNG ou JPG.";
  }
  if (arquivo.size > TAMANHO_MAX) {
    return "A imagem tem mais de 2 MB. Escolha um arquivo menor.";
  }
  return null;
}

function tratarSelecaoFoto(evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const erro = validarImagem(arquivo);
  if (erro) {
    mostrarMensagem("msgFoto", erro, "erro");
    evento.target.value = "";
    return;
  }

  const leitor = new FileReader();
  leitor.onload = () => {
    const usuario = getUserPerfil();
    try {
      localStorage.setItem(PREFIXO_FOTO + usuario.email, leitor.result);
      carregarAvatarPerfil(usuario);
      mostrarMensagem("msgFoto", "Foto atualizada.", "sucesso");
    } catch {
      mostrarMensagem("msgFoto", "Não foi possível salvar a foto. Tente uma imagem menor.", "erro");
    }
  };
  leitor.onerror = () => mostrarMensagem("msgFoto", "Erro ao ler o arquivo.", "erro");
  leitor.readAsDataURL(arquivo);
  evento.target.value = "";
}

function removerFoto() {
  const usuario = getUserPerfil();
  localStorage.removeItem(PREFIXO_FOTO + usuario.email);
  carregarAvatarPerfil(usuario);
  mostrarMensagem("msgFoto", "Foto removida.", "sucesso");
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarFormulario(dados) {
  if (!dados.nome || !dados.email || !dados.disciplina) {
    return "Preencha todos os campos.";
  }
  if (!emailValido(dados.email)) {
    return "Informe um e-mail válido.";
  }
  return null;
}

function salvarPerfil(evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    disciplina: document.getElementById("disciplina").value.trim(),
  };

  ["nome", "email", "disciplina"].forEach((id) => {
    document.getElementById(id).classList.toggle("erro", !dados[id]);
  });

  const erro = validarFormulario(dados);
  if (erro) {
    mostrarMensagem("msgForm", erro, "erro");
    return;
  }

  const logado = getUserPerfil();
  const emailAntigo = logado.email;
  const professores = lerJSON(CHAVE_PROFESSORES, []);

  const duplicado = professores.some((p) => p.email === dados.email && p.email !== emailAntigo);
  if (duplicado) {
    mostrarMensagem("msgForm", "Este e-mail já está em uso por outro professor.", "erro");
    return;
  }

  const atualizado = professores.map((professor) => {
    if (professor.email === emailAntigo) {
      return {
        ...professor,
        ...dados,
      }
    }

    return professor;
  })

  localStorage.setItem(CHAVE_PROFESSORES, JSON.stringify(atualizado));
  localStorage.setItem(CHAVE_LOGIN, dados.email);

  // Se o e-mail mudou, a foto acompanha a nova chave
  if (emailAntigo !== dados.email) {
    const foto = obterFoto(emailAntigo);
    if (foto) {
      localStorage.setItem(PREFIXO_FOTO + dados.email, foto);
      localStorage.removeItem(PREFIXO_FOTO + emailAntigo);
    }
  }

  const usuarioAtualizado = {
    ...logado,
    ...dados,
  }

  preencherTela(usuarioAtualizado);
  mostrarMensagem("msgForm", "Dados salvos com sucesso.", "sucesso");
}

function sair(evento) {
  evento.preventDefault();
  localStorage.removeItem(CHAVE_LOGIN);
  window.location.href = PAGINA_LOGIN;
}

function iniciar() {
  const usuario = getUserPerfil();
  
  preencherTela(usuario);

  const inputFoto = document.getElementById("inputFoto");
  document.getElementById("btnAlterar").addEventListener("click", () => inputFoto.click());
  document.getElementById("btnCamera").addEventListener("click", () => inputFoto.click());
  inputFoto.addEventListener("change", tratarSelecaoFoto);
  document.getElementById("btnRemover").addEventListener("click", removerFoto);
  document.getElementById("formPerfil").addEventListener("submit", salvarPerfil);
  document.getElementById("btnSair").addEventListener("click", sair);
}

document.addEventListener("DOMContentLoaded", iniciar);
