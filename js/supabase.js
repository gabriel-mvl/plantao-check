/* ============================================================
   PLANTÃO CHECK — Supabase Data Layer
   Todas as operações de banco de dados passam por aqui.

   SCHEMA necessário — execute no SQL Editor do Supabase:

   -- Plantões (turno de trabalho)
   create table plantoes (
     id uuid primary key default gen_random_uuid(),
     user_email text not null,
     data date not null,
     turno text not null,           -- 'diurno' | 'noturno' | 'extraordinario'
     delegacia text not null,
     delegado text not null,
     status text default 'aberto',  -- 'aberto' | 'encerrado'
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Ocorrências registradas num plantão
   create table ocorrencias (
     id uuid primary key default gen_random_uuid(),
     plantao_id uuid references plantoes(id) on delete cascade,
     user_email text not null,
     tipo_id text not null,
     tipo_nome text not null,
     num_bo text,
     palavras_chave text,
     triage jsonb,                  -- { condutor, flagrante, preso }
     check_state jsonb default '{}',
     observacoes text,
     status text default 'andamento', -- 'andamento' | 'concluido'
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

   -- Checklists personalizados criados pelo usuário
   create table checklists_custom (
     id uuid primary key default gen_random_uuid(),
     user_email text not null,
     nome text not null,
     icone text default '📋',
     sections jsonb not null default '[]',
     created_at timestamptz default now()
   );

   -- RLS (Row Level Security) — cada usuário vê só seus dados
   alter table plantoes enable row level security;
   alter table ocorrencias enable row level security;
   alter table checklists_custom enable row level security;

   create policy "users_own_plantoes" on plantoes
     using (user_email = current_setting('request.jwt.claims', true)::json->>'email')
     with check (user_email = current_setting('request.jwt.claims', true)::json->>'email');

   create policy "users_own_ocorrencias" on ocorrencias
     using (user_email = current_setting('request.jwt.claims', true)::json->>'email')
     with check (user_email = current_setting('request.jwt.claims', true)::json->>'email');

   create policy "users_own_checklists" on checklists_custom
     using (user_email = current_setting('request.jwt.claims', true)::json->>'email')
     with check (user_email = current_setting('request.jwt.claims', true)::json->>'email');

   -- IMPORTANTE: Como usamos autenticação própria (EmailJS) sem JWT do Supabase,
   -- as políticas RLS acima não funcionarão diretamente.
   -- Alternativa simples: desabilite RLS e filtre por user_email no código.
   -- Para produção futura, migre para Supabase Auth.

   alter table plantoes disable row level security;
   alter table ocorrencias disable row level security;
   alter table checklists_custom disable row level security;

   ============================================================ */

const SUPABASE_URL  = 'https://chnrhbuwlmwcfkpukery.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_duHKmS0Yp_T3htsWzzQ9aQ_dqiR9scj';

// ── HTTP HELPER ───────────────────────────────────────────────
async function sbFetch(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Supabase error ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── PLANTÕES ──────────────────────────────────────────────────
const DB_Plantoes = {

  async criar(userEmail, dados) {
    return sbFetch('plantoes', {
      method: 'POST',
      body: JSON.stringify({ user_email: userEmail, ...dados }),
    });
  },

  async listar(userEmail) {
    return sbFetch(
      `plantoes?user_email=eq.${encodeURIComponent(userEmail)}&order=created_at.desc&limit=50`
    );
  },

  async buscarAberto(userEmail) {
    const rows = await sbFetch(
      `plantoes?user_email=eq.${encodeURIComponent(userEmail)}&status=eq.aberto&order=created_at.desc&limit=1`
    );
    return rows?.[0] || null;
  },

  async encerrar(id) {
    return sbFetch(`plantoes?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'encerrado', updated_at: new Date().toISOString() }),
    });
  },
};

// ── OCORRÊNCIAS ───────────────────────────────────────────────
const DB_Ocorrencias = {

  async salvar(userEmail, plantaoId, dados) {
    // Upsert: se já existe com mesmo plantao_id + tipo_id, atualiza
    const existing = await sbFetch(
      `ocorrencias?plantao_id=eq.${plantaoId}&tipo_id=eq.${encodeURIComponent(dados.tipo_id)}&user_email=eq.${encodeURIComponent(userEmail)}&limit=1`
    );
    if (existing?.length) {
      return sbFetch(`ocorrencias?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...dados, updated_at: new Date().toISOString() }),
      });
    }
    return sbFetch('ocorrencias', {
      method: 'POST',
      body: JSON.stringify({ user_email: userEmail, plantao_id: plantaoId, ...dados }),
    });
  },

  async listarPorPlantao(plantaoId) {
    return sbFetch(
      `ocorrencias?plantao_id=eq.${plantaoId}&order=created_at.asc`
    );
  },

  async listarHistorico(userEmail, limit = 30) {
    return sbFetch(
      `ocorrencias?user_email=eq.${encodeURIComponent(userEmail)}&order=created_at.desc&limit=${limit}`
    );
  },

  async atualizar(id, dados) {
    return sbFetch(`ocorrencias?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...dados, updated_at: new Date().toISOString() }),
    });
  },

  async deletar(id) {
    return sbFetch(`ocorrencias?id=eq.${id}`, { method: 'DELETE', prefer: '' });
  },
};

// ── CHECKLISTS CUSTOM ─────────────────────────────────────────
const DB_Custom = {

  async listar(userEmail) {
    return sbFetch(
      `checklists_custom?user_email=eq.${encodeURIComponent(userEmail)}&order=created_at.desc`
    );
  },

  async criar(userEmail, dados) {
    return sbFetch('checklists_custom', {
      method: 'POST',
      body: JSON.stringify({ user_email: userEmail, ...dados }),
    });
  },

  async atualizar(id, dados) {
    return sbFetch(`checklists_custom?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dados),
    });
  },

  async deletar(id) {
    return sbFetch(`checklists_custom?id=eq.${id}`, { method: 'DELETE', prefer: '' });
  },
};

// ── SYNC: persiste checkState de uma ocorrência ───────────────
async function syncCheckState(tipoId, checkState, observacoes, metaBO, metaKW, triage) {
  const session  = JSON.parse(localStorage.getItem('pc_session') || 'null');
  const plantaoId = localStorage.getItem('pc_plantao_id');
  if (!session || !plantaoId) return;

  const allItems = (() => {
    const occ = [...(window.OCCURRENCES || []), ...(window._customOccurrences || [])].find(o => o.id === tipoId);
    return occ ? occ.sections.reduce((a, s) => a + s.items.length, 0) : 0;
  })();
  const checked  = Object.values(checkState).filter(Boolean).length;
  const status   = allItems > 0 && checked === allItems ? 'concluido' : 'andamento';

  try {
    await DB_Ocorrencias.salvar(session.email, plantaoId, {
      tipo_id: tipoId,
      tipo_nome: ([...( window.OCCURRENCES || []), ...(window._customOccurrences || [])].find(o => o.id === tipoId)?.name || tipoId),
      num_bo: metaBO || null,
      palavras_chave: metaKW || null,
      triage: triage || {},
      check_state: checkState,
      observacoes: observacoes || null,
      status,
    });
  } catch (e) {
    // Silently fall back to localStorage if offline
    console.warn('Supabase sync failed, using localStorage:', e.message);
  }
}
