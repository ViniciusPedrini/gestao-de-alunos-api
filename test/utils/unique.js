export function gerarSufixoUnico(indice = 0) {
  return `${Date.now()}${indice}${Math.floor(Math.random() * 1000)}`;
}
