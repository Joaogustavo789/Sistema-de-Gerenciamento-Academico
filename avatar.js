// SGA - avatar.js (compartilhado entre as telas)
// localStorage: sga_usuarioLogado, sga_professores, sga_fotoPerfil_<email>

const CHAVE_LOGADO = "sga_usuarioLogado";
const PREFIXO_FOTO = "sga_fotoPerfil_";

function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
}

function obterUsuarioLogado() {
  return lerJSON(CHAVE_LOGADO, null);
}

function obterFoto(email) {
  return localStorage.getItem(PREFIXO_FOTO + email);
}

function obterIniciais(nome) {
  const partes = (nome || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

// Aplica a foto (ou as iniciais) em todo elemento com [data-avatar]
function carregarAvatar() {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  const foto = obterFoto(usuario.email);
  document.querySelectorAll("[data-avatar]").forEach((el) => {
    if (foto) {
      el.style.backgroundImage = `url("${foto}")`;
      el.textContent = "";
    } else {
      el.style.backgroundImage = "none";
      el.textContent = obterIniciais(usuario.nome);
    }
  });
}

document.addEventListener("DOMContentLoaded", carregarAvatar);
