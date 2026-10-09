// SGA - avatar.js (compartilhado entre as telas)
// localStorage: sga_usuarioLogado, sga_professores, sga_fotoPerfil_<email>

const PREFIXO_FOTO = "sga_fotoPerfil_";

function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
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
