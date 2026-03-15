import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = 'https://barbearia-saas-api-production.up.railway.app';

// ==========================================
// 1. TELA DE LOGIN E CADASTRO (Rota: / )
// ==========================================
function TelaLogin() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  // Se já estiver logado, manda direto pro painel
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
        body: JSON.stringify({ nome, slug, telefone, email, senha })
      })
      .then(res => res.ok ? res.json() : Promise.reject("Erro ao criar conta."))
      .then(() => {
        alert("Conta criada! Faça login.");
        setModoCadastro(false);
        setMensagem("");
      })
      .catch(err => setMensagem("❌ " + err));
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
    </div>
  );
}

// ==========================================
// 2. TELA DO PAINEL ADMIN (Rota: /painel )
// ==========================================
function TelaPainel() {
  const navigate = useNavigate();
  const [barbearia, setBarbearia] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);

  // Estados para Novos Cadastros
  const [novoServicoNome, setNovoServicoNome] = useState('');
  const [novoServicoPreco, setNovoServicoPreco] = useState('');
  const [novoServicoDuracao, setNovoServicoDuracao] = useState('');
  const [novoBarbeiroNome, setNovoBarbeiroNome] = useState('');

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('barbeariaLogada');
    if (!dadosSalvos) {
      navigate('/'); 
      return;
    }
    const barbeariaLogada = JSON.parse(dadosSalvos);
    setBarbearia(barbeariaLogada);

    // Carregar tudo da barbearia logada
    fetch(`${API_URL}/api/agendamentos/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setAgendamentos);
    fetch(`${API_URL}/api/servicos/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setServicos);
    fetch(`${API_URL}/api/barbeiros/barbearia/${barbeariaLogada.id}`).then(r => r.json()).then(setBarbeiros);
  }, [navigate]);

  const sair = () => {
    localStorage.removeItem('barbeariaLogada');
    navigate('/');
  };

  const adicionarServico = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/servicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: novoServicoNome, preco: novoServicoPreco, duracaoMinutos: novoServicoDuracao, barbearia: { id: barbearia.id }
      })
    }).then(() => {
      alert('Serviço adicionado!');
      setNovoServicoNome(''); setNovoServicoPreco(''); setNovoServicoDuracao('');
      // Recarrega a lista
      fetch(`${API_URL}/api/servicos/barbearia/${barbearia.id}`).then(r => r.json()).then(setServicos);
    });
  };

  const adicionarBarbeiro = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/barbeiros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoBarbeiroNome, ativo: true, barbearia: { id: barbearia.id } })
    }).then(() => {
      alert('Barbeiro adicionado!');
      setNovoBarbeiroNome('');
      // Recarrega a lista
      fetch(`${API_URL}/api/barbeiros/barbearia/${barbearia.id}`).then(r => r.json()).then(setBarbeiros);
    });
  };

  if (!barbearia) return null;

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1>Painel: {barbearia.nome}</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <Link to={`/${barbearia.slug}`} target="_blank" style={{ padding: '10px 15px', backgroundColor: '#8b5cf6', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>🌍 Ver Meu Site</Link>
          <button onClick={sair} style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Formulário de Serviços */}
        <div style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>✂️ Adicionar Serviço</h3>
          <form onSubmit={adicionarServico} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Ex: Corte Degradê" value={novoServicoNome} onChange={e=>setNovoServicoNome(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
            <input type="number" placeholder="Preço (Ex: 35)" value={novoServicoPreco} onChange={e=>setNovoServicoPreco(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
            <input type="number" placeholder="Duração em Minutos (Ex: 40)" value={novoServicoDuracao} onChange={e=>setNovoServicoDuracao(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
            <button type="submit" style={{ padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Serviço</button>
          </form>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            {servicos.map(s => <li key={s.id}>{s.nome} - R$ {s.preco} ({s.duracaoMinutos} min)</li>)}
          </ul>
        </div>

        {/* Formulário de Barbeiros */}
        <div style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>💈 Adicionar Profissional</h3>
          <form onSubmit={adicionarBarbeiro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Nome do Barbeiro" value={novoBarbeiroNome} onChange={e=>setNovoBarbeiroNome(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
            <button type="submit" style={{ padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Barbeiro</button>
          </form>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            {barbeiros.map(b => <li key={b.id}>{b.nome}</li>)}
          </ul>
        </div>
      </div>

      <h2 style={{ marginTop: '30px' }}>📅 Agenda de Hoje</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {agendamentos.length === 0 ? <p>Nenhum agendamento ainda.</p> : 
          agendamentos.map(ag => (
            <div key={ag.id} style={{ padding: '15px', backgroundColor: '#f8fafc', borderLeft: '4px solid #3b82f6', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{ag.cliente.nome}</strong> - 📱 {ag.cliente.telefone} <br/>
                ✂️ {ag.servico.nome} com {ag.barbeiro.nome}
              </div>
              <div style={{ fontWeight: 'bold', color: '#1d4ed8' }}>
                {new Date(ag.dataHoraInicio).toLocaleString('pt-BR')}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
// ==========================================
// 3. TELA PÚBLICA DO CLIENTE (Rota: /:slug )
// ==========================================
function TelaCliente() {
  const { slug } = useParams(); // Pega o nome da barbearia lá da URL
  const [barbearia, setBarbearia] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Estados do Form
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [barbeiroId, setBarbeiroId] = useState('');
  const [dataHora, setDataHora] = useState('');

  useEffect(() => {
    // 1. O React pergunta ao Java: "Quem é o dono deste link?"
    fetch(`${API_URL}/api/barbearias/slug/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Barbearia não encontrada.");
        return res.json();
      })
      .then(dadosBarbearia => {
        setBarbearia(dadosBarbearia);
        // 2. Agora que sabemos quem é, buscamos os barbeiros e serviços dela
        return Promise.all([
          fetch(`${API_URL}/api/servicos/barbearia/${dadosBarbearia.id}`).then(r => r.json()),
          fetch(`${API_URL}/api/barbeiros/barbearia/${dadosBarbearia.id}`).then(r => r.json())
        ]);
      })
      .then(([dadosServicos, dadosBarbeiros]) => {
        setServicos(dadosServicos);
        setBarbeiros(dadosBarbeiros);
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
      return res.json();
    })
    .then(() => {
      alert("✅ Horário Confirmado!");
      setMensagem("");
      setClienteNome(''); setClienteTelefone(''); setDataHora('');
    })
    .catch(err => setMensagem("❌ " + err.message));
  };

  if (erro) return <h1 style={{textAlign: 'center', marginTop: '50px'}}>{erro} 😢</h1>;
  if (!barbearia) return <h3 style={{textAlign: 'center'}}>A carregar...</h3>;

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>✂️ {barbearia.nome}</h1>
        <p>{barbearia.endereco} | 📞 {barbearia.telefone}</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Agende seu horário</h2>
        <p style={{ color: '#dc2626', fontWeight: 'bold', textAlign: 'center' }}>{mensagem}</p>

        <form onSubmit={agendar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Seu Nome" value={clienteNome} onChange={e=>setClienteNome(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="tel" placeholder="Seu WhatsApp" value={clienteTelefone} onChange={e=>setClienteTelefone(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          
          <select value={servicoId} onChange={e=>setServicoId(e.target.value)} required style={{ padding: '12px', borderRadius: '6px' }}>
            <option value="">-- Serviço --</option>
            {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco}</option>)}
          </select>

          <select value={barbeiroId} onChange={e=>setBarbeiroId(e.target.value)} required style={{ padding: '12px', borderRadius: '6px' }}>
            <option value="">-- Profissional --</option>
            {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>

          <input type="datetime-local" value={dataHora} onChange={e=>setDataHora(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />

          <button type="submit" style={{ padding: '15px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. O CÉREBRO DAS ROTAS (Aqui a mágica acontece)
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota 1: O link principal abre o Login */}
        <Route path="/" element={<TelaLogin />} />
        
        {/* Rota 2: O painel protegido */}
        <Route path="/painel" element={<TelaPainel />} />
        
        {/* Rota 3: Link dinâmico do cliente. Ex: /barbearia-do-guilherme */}
        {/* O :slug avisa o React que qualquer palavra digitada aqui será uma variável */}
        <Route path="/:slug" element={<TelaCliente />} />
      </Routes>
    </Router>
  );
}

export default App;