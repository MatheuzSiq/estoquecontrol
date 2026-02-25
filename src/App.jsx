import { BrowserRouter, Routes, Route } from "react-router-dom";
import Consulta from "./pages/Consulta";
import Cadastro from "./pages/Cadastro";
import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Consulta />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
