import { useState } from "react";
import { produtos, removerProduto } from "../data";
import { useNavigate } from "react-router-dom";

function Consulta() {
  const [busca, setBusca] = useState("");
  const [, setAtualizar] = useState(false);
  const navigate = useNavigate();

  const filtrados = produtos.filter((p) => p.codigo.includes(busca));

  function excluir(index) {
    removerProduto(index);
    setAtualizar((a) => !a);
  }

  function editar(index) {
    navigate("/cadastro", { state: { index } });
  }

  return (
    <div className="container">
      <h1>Consulta de Produtos</h1>

      <div className="top-bar">
        <input
          placeholder="Buscar código"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={() => navigate("/cadastro")}>Novo</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Lote</th>
            <th>Endereço</th>
            <th>Qtd</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((p, i) => (
            <tr key={i}>
              <td>{p.codigo}</td>
              <td>{p.descricao}</td>
              <td>{p.lote}</td>
              <td>{p.endereco}</td>
              <td>{p.quantidade}</td>
              <td>
                <button className="edit" onClick={() => editar(i)}>
                  Editar
                </button>
                <button className="delete" onClick={() => excluir(i)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Consulta;
