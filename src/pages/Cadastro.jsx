import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { catalogo, produtos, adicionarProduto, editarProduto } from "../data";

function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const editIndex = location.state?.index;

  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lote, setLote] = useState("");
  const [linhas, setLinhas] = useState([{ endereco: "", quantidade: "" }]);

  useEffect(() => {
    if (editIndex !== undefined) {
      const produto = produtos[editIndex];
      setCodigo(produto.codigo);
      setDescricao(produto.descricao);
      setLote(produto.lote);
      setLinhas([
        { endereco: produto.endereco, quantidade: produto.quantidade },
      ]);
    }
  }, [editIndex]);

  function buscarDescricao(cod) {
    const item = catalogo.find((p) => p.codigo === cod);
    setDescricao(item ? item.descricao : "");
  }

  function adicionarLinha() {
    setLinhas([...linhas, { endereco: "", quantidade: "" }]);
  }

  function atualizarLinha(i, campo, valor) {
    const novas = [...linhas];
    novas[i][campo] = valor;
    setLinhas(novas);
  }

  function salvar() {
    linhas.forEach((linha) => {
      const novo = {
        codigo,
        descricao,
        lote,
        endereco: linha.endereco,
        quantidade: linha.quantidade,
      };

      if (editIndex !== undefined) {
        editarProduto(editIndex, novo);
      } else {
        adicionarProduto(novo);
      }
    });

    navigate("/");
  }

  function voltar() {
    navigate("/");
  }

  return (
    <div className="container">
      <h1>{editIndex !== undefined ? "Editar" : "Novo"} Produto</h1>

      <input
        placeholder="Código"
        value={codigo}
        onChange={(e) => {
          setCodigo(e.target.value);
          buscarDescricao(e.target.value);
        }}
      />

      <input placeholder="Descrição" value={descricao} disabled />

      <input
        placeholder="Lote"
        value={lote}
        onChange={(e) => setLote(e.target.value)}
      />

      <h3>Endereços</h3>

      {linhas.map((linha, i) => (
        <div key={i} className="linha">
          <input
            placeholder="Endereço"
            value={linha.endereco}
            onChange={(e) => atualizarLinha(i, "endereco", e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={linha.quantidade}
            onChange={(e) => atualizarLinha(i, "quantidade", e.target.value)}
          />
        </div>
      ))}

      <button onClick={adicionarLinha}>Adicionar Linha</button>
      <button onClick={salvar} className="primary">
        Salvar
      </button>
      <button onClick={voltar} className="delete">
        Voltar
      </button>
    </div>
  );
}

export default Cadastro;
