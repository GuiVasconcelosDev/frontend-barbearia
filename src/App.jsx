import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import './App.css';

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
  const [chavePix, setChavePix] = useState('');

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
        body: JSON.stringify({ nome, slug, telefone, email, senha, chavePix })
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
              <input type="text" placeholder="Sua Chave Pix (CPF/Email/Celular)" value={chavePix} onChange={e=>setChavePix(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
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
  // Separa quem já cortou de quem ainda vai cortar
  const agendamentosPendentes = agendamentos.filter(ag => !ag.concluido);
  const agendamentosConcluidos = agendamentos.filter(ag => ag.concluido);

  // Soma o preço de todos os serviços concluídos
  const faturamentoTotal = agendamentosConcluidos.reduce((total, ag) => total + (ag.servico.preco || 0), 0);

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

  const concluirAgendamento = (id) => {
    if(window.confirm("Confirmar a conclusão e adicionar o valor ao caixa?")) {
      fetch(`${API_URL}/api/agendamentos/${id}/concluir`, {
        method: 'POST'
      }).then((res) => {
        if(res.ok) {
          // Atualiza a tela na hora, passando o agendamento para o "cofre"
          setAgendamentos(agendamentos.map(ag => ag.id === id ? { ...ag, concluido: true } : ag));
        }
      });
    }
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

      {/* --- INÍCIO DO DASHBOARD FINANCEIRO --- */}
      <div className="dash-container" style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#10b981', color: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', opacity: 0.9 }}>💰 Faturamento Total</h3>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '36px' }}>R$ {faturamentoTotal.toFixed(2)}</h2>
        </div>
        
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#3b82f6', color: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', opacity: 0.9 }}>✂️ Cortes Concluídos</h3>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '36px' }}>{agendamentosConcluidos.length}</h2>
        </div>
      </div>
      {/* --- FIM DO DASHBOARD FINANCEIRO --- */}
      
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
        {agendamentosPendentes.length === 0 ? <p>Nenhum agendamento pendente.</p> : 
          agendamentosPendentes.map(ag => (
            <div key={ag.id} className="agendamento-card" style={{ padding: '15px', backgroundColor: '#f8fafc', borderLeft: '4px solid #3b82f6', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{ag.cliente.nome}</strong> - 📱 {ag.cliente.telefone} <br/>
                ✂️ {ag.servico.nome} com {ag.barbeiro.nome}
              </div>
              <div className="agendamento-acoes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#1d4ed8' }}>
                  {new Date(ag.dataHoraInicio).toLocaleString('pt-BR')}
                </span>
                <button onClick={() => concluirAgendamento(ag.id)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                  ✅ Concluir
                </button>
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
      // Descobre o nome e o PREÇO do serviço
      const servicoEscolhido = servicos.find(s => s.id === parseInt(servicoId));
      const nomeServico = servicoEscolhido?.nome || "Serviço";
      const precoServico = servicoEscolhido?.preco || 0;
      const nomeBarbeiro = barbeiros.find(b => b.id === parseInt(barbeiroId))?.nome || "Profissional";
      
      const dataFormatada = new Date(dataHora).toLocaleString('pt-BR');
      
      // 1. Mostra o alerta com a Chave Pix para o cliente copiar
      alert(`✅ Horário Reservado!\n\nPara confirmar, faça um Pix de R$ ${precoServico} para a chave abaixo:\n\n🔑 ${barbearia.chavePix}\n\nClique em OK para enviar o comprovante no WhatsApp do barbeiro.`);

      // 2. Monta o texto já pedindo o comprovante
      const textoMsg = `Olá! Acabei de agendar um horário.\n\n*Detalhes:*\n👤 Nome: ${clienteNome}\n✂️ Serviço: ${nomeServico}\n💈 Profissional: ${nomeBarbeiro}\n📅 Data/Hora: ${dataFormatada}\n💰 Valor: R$ ${precoServico}\n\n*Segue abaixo o meu comprovante do Pix:*`;
      
      const numeroWhats = barbearia.telefone.replace(/\D/g, ''); 
      const linkWhats = `https://wa.me/55${numeroWhats}?text=${encodeURIComponent(textoMsg)}`;
      
      window.open(linkWhats, '_blank');

      setMensagem("");
      setClienteNome(''); 
      setClienteTelefone(''); 
      setDataHora('');
    })
    .catch(err => setMensagem("❌ " + err.message));
  };

  if (erro) return <h1 style={{textAlign: 'center', marginTop: '50px'}}>{erro} 😢</h1>;
  if (!barbearia) return <h3 style={{textAlign: 'center'}}>A carregar...</h3>;

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '5px' }}>✂️ {barbearia.nome}</h1>
        <p style={{ color: '#64748b', margin: 0 }}>{barbearia.endereco} | 📞 {barbearia.telefone}</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center', marginBottom: '25px', color: '#0f172a' }}>Agende seu horário</h2>
        <p style={{ color: '#dc2626', fontWeight: 'bold', textAlign: 'center' }}>{mensagem}</p>

        <form onSubmit={agendar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Dados do Cliente */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Seu Nome" value={clienteNome} onChange={e=>setClienteNome(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }} />
            <input type="tel" placeholder="Seu WhatsApp" value={clienteTelefone} onChange={e=>setClienteTelefone(e.target.value)} required style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }} />
          </div>
          
          {/* CARDS DE SERVIÇOS */}
          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '10px' }}>1. Escolha o Serviço:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              {servicos.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setServicoId(s.id)}
                  style={{ 
                    padding: '15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    border: parseInt(servicoId) === s.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: parseInt(servicoId) === s.id ? '#eff6ff' : '#fff'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '16px' }}>{s.nome}</div>
                  <div style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: '5px' }}>R$ {s.preco}</div>
                </div>
              ))}
            </div>
            {/* Input invisível só para forçar o preenchimento obrigatório */}
            <input type="text" value={servicoId} readOnly required style={{ width: 0, height: 0, border: 'none', padding: 0, margin: 0, opacity: 0 }} />
          </div>

          {/* CARDS DE BARBEIROS */}
          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '10px' }}>2. Escolha o Profissional:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {barbeiros.map(b => (
                <div 
                  key={b.id} 
                  onClick={() => setBarbeiroId(b.id)}
                  style={{ 
                    padding: '12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    border: parseInt(barbeiroId) === b.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    backgroundColor: parseInt(barbeiroId) === b.id ? '#eff6ff' : '#fff'
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>💈 {b.nome}</div>
                </div>
              ))}
            </div>
            <input type="text" value={barbeiroId} readOnly required style={{ width: 0, height: 0, border: 'none', padding: 0, margin: 0, opacity: 0 }} />
          </div>

          {/* Data e Hora */}
          <div>
            <label style={{ fontWeight: 'bold', color: '#334155', display: 'block', marginBottom: '10px' }}>3. Escolha a Data e Hora:</label>
            <input type="datetime-local" value={dataHora} onChange={e=>setDataHora(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ marginTop: '10px', padding: '16px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(29, 78, 216, 0.3)' }}>
            Confirmar Agendamento
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