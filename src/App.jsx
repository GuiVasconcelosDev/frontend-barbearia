import { useState } from 'react'

function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [barbeariaLogada, setBarbeariaLogada] = useState(null);
  const [telaAtiva, setTelaAtiva] = useState('LOGIN'); // Pode ser: LOGIN, CADASTRO, ADMIN, CLIENTE
  const [mensagemAviso, setMensagemAviso] = useState("");

  // Campos de Login
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');

  // Campos de Cadastro
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');

  // --- ESTADOS DO PAINEL ADMIN ---
  const [servicos, setServicos] = useState([]);
  const [nomeServico, setNomeServico] = useState('');
  const [precoServico, setPrecoServico] = useState('');
  const [duracaoServico, setDuracaoServico] = useState('');

  const [barbeiros, setBarbeiros] = useState([]);
  const [nomeBarbeiro, setNomeBarbeiro] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);

  // --- ESTADOS DO CLIENTE (Página Pública) ---
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
  const [barbeiroSelecionadoId, setBarbeiroSelecionadoId] = useState('');
  const [dataHoraAgendamento, setDataHoraAgendamento] = useState('');

  // ==========================================
  // 1. FUNÇÕES DE AUTENTICAÇÃO (O CORAÇÃO DO SAAS)
  // ==========================================
  
  const fazerLogin = (e) => {
    e.preventDefault();
    setMensagemAviso("A verificar credenciais...");
    
    fetch('barbearia-saas-api-production.up.railway.app/api/barbearias/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLogin, senha: senhaLogin })
    })
    .then(async resposta => {
      if (!resposta.ok) throw new Error("E-mail ou senha inválidos.");
      return resposta.json();
    })
    .then(dadosBarbearia => {
      setBarbeariaLogada(dadosBarbearia);
      carregarDadosDoPainel(dadosBarbearia.id);
      setTelaAtiva('ADMIN');
      setMensagemAviso("");
      setEmailLogin(''); setSenhaLogin('');
    })
    .catch(erro => setMensagemAviso("❌ " + erro.message));
  };

  const criarContaSaaS = (e) => {
    e.preventDefault();
    setMensagemAviso("A criar a sua conta...");
    const slug = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-');
    
    const novaBarbearia = { 
      nome, slug, telefone, endereco, 
      email: emailCadastro, senha: senhaCadastro 
    };

    fetch('barbearia-saas-api-production.up.railway.app/api/barbearias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaBarbearia)
    })
    .then(resposta => resposta.json())
    .then(barbeariaSalva => {
      alert("✅ Conta criada com sucesso! Faça o login agora.");
      setTelaAtiva('LOGIN');
      setMensagemAviso("");
      // Limpar campos
      setNome(''); setTelefone(''); setEndereco(''); setEmailCadastro(''); setSenhaCadastro('');
    })
    .catch(() => setMensagemAviso("❌ Erro ao criar conta. O e-mail já pode estar em uso."));
  };

  const sairDaConta = () => {
    setBarbeariaLogada(null);
    setTelaAtiva('LOGIN');
  };

  // ==========================================
  // 2. FUNÇÕES DO PAINEL ADMIN
  // ==========================================

  const carregarDadosDoPainel = (idBarbearia) => {
    Promise.all([
      fetch(`barbearia-saas-api-production.up.railway.app/api/servicos/barbearia/${idBarbearia}`).then(res => res.json()),
      fetch(`barbearia-saas-api-production.up.railway.app/api/barbeiros/barbearia/${idBarbearia}`).then(res => res.json()),
      fetch(`barbearia-saas-api-production.up.railway.app/api/agendamentos/barbearia/${idBarbearia}`).then(res => res.json())
    ]).then(([dadosServicos, dadosBarbeiros, dadosAgendamentos]) => {
      setServicos(dadosServicos);
      setBarbeiros(dadosBarbeiros);
      setAgendamentos(dadosAgendamentos);
    });
  };

  const guardarServico = (e) => {
    e.preventDefault();
    const novoServico = { nome: nomeServico, preco: parseFloat(precoServico), duracaoMinutos: parseInt(duracaoServico), barbearia: { id: barbeariaLogada.id } };
    fetch('barbearia-saas-api-production.up.railway.app/api/servicos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novoServico) })
    .then(res => res.json())
    .then(servicoSalvo => { setServicos([...servicos, servicoSalvo]); setNomeServico(''); setPrecoServico(''); setDuracaoServico(''); });
  };

  const guardarBarbeiro = (e) => {
    e.preventDefault();
    fetch('barbearia-saas-api-production.up.railway.app/api/barbeiros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: nomeBarbeiro, barbearia: { id: barbeariaLogada.id } }) })
    .then(res => res.json())
    .then(barbeiroSalvo => { setBarbeiros([...barbeiros, barbeiroSalvo]); setNomeBarbeiro(''); });
  };

  // ==========================================
  // 3. FUNÇÃO DO CLIENTE (AGENDAMENTO)
  // ==========================================

  const realizarAgendamento = (e) => {
    e.preventDefault();
    setMensagemAviso("A processar...");
    const novoAgendamento = {
      barbearia: { id: barbeariaLogada.id },
      barbeiro: { id: parseInt(barbeiroSelecionadoId) },
      servico: { id: parseInt(servicoSelecionadoId) },
      cliente: { nome: clienteNome, telefone: clienteTelefone },
      dataHoraInicio: dataHoraAgendamento
    };

    fetch('barbearia-saas-api-production.up.railway.app/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAgendamento)
    })
    .then(async resposta => {
      if (!resposta.ok) throw new Error(await resposta.text());
      return resposta.json();
    })
    .then(agendamentoSalvo => {
      alert("✅ Agendamento Confirmado!");
      setClienteNome(''); setClienteTelefone(''); setServicoSelecionadoId(''); setBarbeiroSelecionadoId(''); setDataHoraAgendamento('');
      setAgendamentos([...agendamentos, agendamentoSalvo]); // Atualiza a agenda do admin em tempo real
      setTelaAtiva('ADMIN');
      setMensagemAviso("");
    })
    .catch(erro => setMensagemAviso("❌ " + erro.message));
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT') + ' às ' + data.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  // ==========================================
  // INTERFACES (Telas)
  // ==========================================

  // TELA A: LOGIN
  if (telaAtiva === 'LOGIN') {
    return (
      <div style={{ padding: '50px 20px', fontFamily: 'system-ui, sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h1>SaaS Barbearia ✂️</h1>
        <p style={{ color: '#f18f1e', fontWeight: 'bold' }}>{mensagemAviso}</p>
        
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{color: '#000000bf'}}>Entrar no Painel</h2>
          <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="O seu E-mail" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="A sua Senha" value={senhaLogin} onChange={e => setSenhaLogin(e.target.value)} required style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#4b5563' }}>
            Não tem uma conta? <span onClick={() => {setTelaAtiva('CADASTRO'); setMensagemAviso("");}} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>Crie a sua barbearia</span>
          </p>
        </div>
      </div>
    );
  }

  // TELA B: CADASTRO
  if (telaAtiva === 'CADASTRO') {
    return (
      <div style={{ padding: '30px 20px', fontFamily: 'system-ui, sans-serif', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Criar Conta SaaS</h1>
        <p style={{ color: '#d97706', fontWeight: 'bold' }}>{mensagemAviso}</p>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <form onSubmit={criarContaSaaS} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Nome da Barbearia" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="email" placeholder="E-mail de Acesso" value={emailCadastro} onChange={e => setEmailCadastro(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Criar Senha" value={senhaCadastro} onChange={e => setSenhaCadastro(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Registar Barbearia</button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#4b5563' }}>
            Já tem conta? <span onClick={() => {setTelaAtiva('LOGIN'); setMensagemAviso("");}} style={{ color: '#16a34a', cursor: 'pointer', fontWeight: 'bold' }}>Faça Login</span>
          </p>
        </div>
      </div>
    );
  }

  // TELA C: PÁGINA PÚBLICA DO CLIENTE (A Montra)
  if (telaAtiva === 'CLIENTE') {
    return (
      <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setTelaAtiva('ADMIN')} style={{ padding: '8px 15px', marginBottom: '20px', cursor: 'pointer' }}>← Voltar ao Painel (Admin)</button>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1>✂️ {barbeariaLogada.nome}</h1>
          <p>{barbeariaLogada.endereco} | 📞 {barbeariaLogada.telefone}</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginTop: 0, textAlign: 'center' }}>Marque o seu horário</h2>
          <p style={{ color: '#dc2626', fontWeight: 'bold', textAlign: 'center' }}>{mensagemAviso}</p>

          <form onSubmit={realizarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="O seu Nome" value={clienteNome} onChange={e => setClienteNome(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="tel" placeholder="O seu Telemóvel" value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />
            
            <select value={servicoSelecionadoId} onChange={e => setServicoSelecionadoId(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid ##9ca3af' }}>
              <option value="">-- Escolha o Serviço --</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} ({s.duracaoMinutos} min) - R$ {s.preco}</option>)}
            </select>

            <select value={barbeiroSelecionadoId} onChange={e => setBarbeiroSelecionadoId(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <option value="">-- Escolha o Profissional --</option>
              {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>

            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Escolha a Data e Hora:</label>
            <input type="datetime-local" value={dataHoraAgendamento} onChange={e => setDataHoraAgendamento(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} />

            <button type="submit" style={{ padding: '15px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Confirmar Agendamento</button>
          </form>
        </div>
      </div>
    );
  }

  // TELA D: PAINEL ADMIN (Dashboard)
  if (telaAtiva === 'ADMIN' && barbeariaLogada) {
    return (
      <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Painel: {barbeariaLogada.nome}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setTelaAtiva('CLIENTE')} style={{ padding: '10px 15px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🌍 Ver Página Pública</button>
            <button onClick={sairDaConta} style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Cadastros de Serviço e Barbeiro */}
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <h3>Adicionar Serviço</h3>
              <form onSubmit={guardarServico} style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="Nome" value={nomeServico} onChange={e => setNomeServico(e.target.value)} required style={{width: '40%', padding: '8px'}}/>
                <input type="number" placeholder="R$" value={precoServico} onChange={e => setPrecoServico(e.target.value)} required style={{width: '25%', padding: '8px'}}/>
                <input type="number" placeholder="Min" value={duracaoServico} onChange={e => setDuracaoServico(e.target.value)} required style={{width: '20%', padding: '8px'}}/>
                <button type="submit" style={{width: '15%', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer'}}>+</button>
              </form>
            </div>
            <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h3>Adicionar Barbeiro</h3>
              <form onSubmit={guardarBarbeiro} style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="Nome do Barbeiro" value={nomeBarbeiro} onChange={e => setNomeBarbeiro(e.target.value)} required style={{flex: 1, padding: '8px'}}/>
                <button type="submit" style={{padding: '8px 15px', backgroundColor: '#16a34a', color: 'white', border: 'none', cursor: 'pointer'}}>+</button>
              </form>
            </div>
          </div>

          {/* Agenda */}
          <div style={{ flex: '2', minWidth: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ marginTop: 0 }}>📅 Agenda de Clientes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {agendamentos.length === 0 && <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Nenhum agendamento.</p>}
              {agendamentos.map(agenda => (
                <div key={agenda.id} style={{ borderLeft: '4px solid #3b82f6', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{agenda.cliente.nome}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>✂️ {agenda.servico.nome} com <strong>{agenda.barbeiro.nome}</strong></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '5px 10px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                      {formatarDataHora(agenda.dataHoraInicio)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App