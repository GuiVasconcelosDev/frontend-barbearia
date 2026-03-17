import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import './App.css';

const API_URL = 'https://barbearia-saas-api-production.up.railway.app';

// ==========================================
// COMPONENTE FOOTER (REUTILIZÁVEL)
// ==========================================
function Footer() {
  return (
    <footer className="footer-container">
      <div className="redes-sociais">
        <a href="https://www.instagram.com/ickisz/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.linkedin.com/in/guilherme-vasconcelos-dev/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/GuiVasconcelosDev" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <p className="footer-copy">&copy; 2026 Guilherme Vasconcelos. Todos os direitos reservados.</p>
    </footer>
  );
}

// ==========================================
// 1. TELA DE LOGIN E CADASTRO
// ==========================================
function TelaLogin() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [chavePix, setChavePix] = useState('');

  useEffect(() => {
    if (localStorage.getItem('barbeariaLogada')) navigate('/painel');
  }, [navigate]);

  const submeterFormulario = (e) => {
    e.preventDefault();
    setMensagem("A processar...");
    if (modoCadastro) {
      const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-');
      fetch(`${API_URL}/api/barbearias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, slug, telefone, email, senha, chavePix })
      })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(() => {
        alert("✅ Conta criada com sucesso!");
        setModoCadastro(false);
        setMensagem("");
      })
      .catch((erro) => { alert(`❌ ${erro.message}`); setMensagem(""); });
    } else {
      fetch(`${API_URL}/api/barbearias/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
      .then(res => res.ok ? res.json() : Promise.reject("Credenciais inválidas."))
      .then(dados => {
        localStorage.setItem('barbeariaLogada', JSON.stringify(dados));
        navigate('/painel');
      })
      .catch(err => setMensagem("❌ " + err));
    }
  };

  return (
    <div style={{ padding: '50px 20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center' }}>SaaS Barbearia ✂️</h1>
      <p style={{ color: '#dc2626', textAlign: 'center', fontWeight: 'bold' }}>{mensagem}</p>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>{modoCadastro ? 'Criar Conta' : 'Entrar no Painel'}</h2>
        <form onSubmit={submeterFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {modoCadastro && (
            <>
              <input type="text" placeholder="Nome da Barbearia" value={nome} onChange={e=>setNome(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Sua Chave Pix" value={chavePix} onChange={e=>setChavePix(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </>
          )}
          <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {modoCadastro ? 'Registar' : 'Entrar'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
          {modoCadastro ? 'Já tem conta? ' : 'Não tem conta? '}
          <span onClick={() => {setModoCadastro(!modoCadastro); setMensagem("");}} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>
            {modoCadastro ? 'Faça Login' : 'Crie a sua barbearia'}
          </span>
        </p>
      </div>
      <Footer />
    </div>
  );
}

// ==========================================
// 2. TELA DO PAINEL ADMIN
// ==========================================
function TelaPainel() {
  const navigate = useNavigate();
  const [barbearia, setBarbearia] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('barbeariaLogada');
    if (!dadosSalvos) { navigate('/'); return; }
    const barbeariaLogada = JSON.parse(dadosSalvos);
    setBarbearia(barbeariaLogada);
    fetch(`${API_URL}/api/agendamentos/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setAgendamentos);
    fetch(`${API_URL}/api/servicos/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setServicos);
    fetch(`${API_URL}/api/barbeiros/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setBarbeiros);
  }, [navigate]);

  if (!barbearia) return null;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1>Painel: {barbearia.nome}</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <Link to={`/${barbearia.slug}`} target="_blank" style={{ padding: '10px 15px', backgroundColor: '#8b5cf6', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>🌍 Ver Meu Site</Link>
          <button onClick={() => {localStorage.removeItem('barbeariaLogada'); navigate('/');}} style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
        </div>
      </div>
      
      {/* Resto do seu código do painel (omitido aqui para brevidade, mas mantenha o seu) */}
      <p style={{textAlign: 'center', color: '#666'}}>Role para baixo para ver o rodapé</p>
      
      <Footer />
    </div>
  );
}

// ==========================================
// 3. TELA PÚBLICA DO CLIENTE
// ==========================================
function TelaCliente() {
  const { slug } = useParams();
  const [barbearia, setBarbearia] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [barbeiroId, setBarbeiroId] = useState('');
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/barbearias/slug/${slug}`)
      .then(res => res.ok ? res.json() : Promise.reject("Não encontrada."))
      .then(dados => {
        setBarbearia(dados);
        fetch(`${API_URL}/api/servicos/barbearia/${dados.id}`).then(r => r.json()).then(setServicos);
        fetch(`${API_URL}/api/barbeiros/barbearia/${dados.id}`).then(r => r.json()).then(setBarbeiros);
      })
      .catch(err => setErro(err.message));
  }, [slug]);

  const agendar = (e) => {
    e.preventDefault();
    setMensagem("A agendar...");
    fetch(`${API_URL}/api/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barbearia: { id: barbearia.id },
        barbeiro: { id: parseInt(barbeiroId) },
        servico: { id: parseInt(servicoId) },
        cliente: { nome: clienteNome, telefone: clienteTelefone },
        dataHoraInicio: dataHora
      })
    })
    .then(async res => {
      if (!res.ok) throw new Error(await res.text());
      alert(`✅ Horário Reservado!\nPix: ${barbearia.chavePix}`);
      setMensagem(""); setClienteNome(''); setClienteTelefone(''); setDataHora(''); setServicoId(''); setBarbeiroId('');
    })
    .catch(err => setMensagem("❌ " + err.message));
  };

  if (erro) return <h1 style={{textAlign: 'center', marginTop: '50px'}}>{erro} 😢</h1>;
  if (!barbearia) return <h3 style={{textAlign: 'center'}}>A carregar...</h3>;

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '5px' }}>✂️ {barbearia.nome}</h1>
        <p style={{ color: '#64748b', margin: 0 }}>📞 {barbearia.telefone}</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center', marginBottom: '25px' }}>Agende seu horário</h2>
        <form onSubmit={agendar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group-mobile" style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Nome" value={clienteNome} onChange={e=>setClienteNome(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="tel" placeholder="WhatsApp" value={clienteTelefone} onChange={e=>setClienteTelefone(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          
          <label>1. Serviço:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {servicos.map(s => (
              <div key={s.id} onClick={() => setServicoId(s.id)} style={{ padding: '15px', borderRadius: '10px', cursor: 'pointer', border: parseInt(servicoId) === s.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', backgroundColor: parseInt(servicoId) === s.id ? '#eff6ff' : '#fff' }}>
                <strong>{s.nome}</strong><br/>R$ {s.preco}
              </div>
            ))}
          </div>

          <label>2. Profissional:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {barbeiros.map(b => (
              <div key={b.id} onClick={() => setBarbeiroId(b.id)} style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer', border: parseInt(barbeiroId) === b.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', backgroundColor: parseInt(barbeiroId) === b.id ? '#eff6ff' : '#fff' }}>
                {b.nome}
              </div>
            ))}
          </div>

          <label>3. Data e Hora:</label>
          <input type="datetime-local" value={dataHora} onChange={e=>setDataHora(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />

          <button type="submit" style={{ padding: '16px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar Agendamento</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/painel" element={<TelaPainel />} />
        <Route path="/:slug" element={<TelaCliente />} />
      </Routes>
    </Router>
  );
}

export default App;