// Lista fixa de produtos (simula banco principal)
export const catalogo = [
  { codigo: "13.01.0176", descricao: "Caixa multivac" },
  { codigo: "13.01.0145", descricao: "Tampa aerosol" },
  { codigo: "13.01.0142", descricao: "Caixa da secar" }
];

// Estoque
export let produtos = [];

export function adicionarProduto(produto) {
  produtos.push(produto);
}

export function removerProduto(index) {
  produtos.splice(index, 1);
}

export function editarProduto(index, novo) {
  produtos[index] = novo;
}
