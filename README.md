# PlantãoCheck

Sistema de apoio ao plantão policial da Polícia Civil do Estado de São Paulo (PCSP), desenvolvido como Progressive Web App (PWA) e hospedado via GitHub Pages.

**URL:** https://gabriel-mvl.github.io/plantao-check/

---

## Visão Geral

O PlantãoCheck é uma ferramenta prática para uso durante o plantão policial, combinando checklists de ocorrência, modelos de documentos oficiais, modelos de texto para boletins de ocorrência, e referências jurídicas e operacionais. O acesso é restrito a e-mails institucionais `.gov.br` via autenticação por código enviado ao e-mail.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Hospedagem | GitHub Pages |
| Frontend | HTML, CSS, JavaScript puro (sem frameworks) |
| Autenticação | E-mail + código OTP via Cloudflare Worker → Brevo API |
| Banco de dados | Supabase (plantões e histórico) |
| PWA | Service Worker + Web App Manifest |
| Documentos | Motor PCDoc (HTML para impressão com cabeçalho PCSP) |

---

## Autenticação

- Acesso exclusivo para e-mails `.gov.br`
- Fluxo: tela de login → usuário informa e-mail institucional → código de 6 dígitos enviado por e-mail → validação → acesso ao app
- Sessão de 8 horas (localStorage)
- Envio de e-mail via **Cloudflare Worker** (`plantaocheck-email.plantaocheck.workers.dev`) que repassa para a **API Brevo**, mantendo a chave de API fora do repositório público
- Remetente: `plantaocheck@gmail.com`

---

## Estrutura de Arquivos

```
plantao-check/
├── index.html              # Tela de login
├── app.html                # Tela principal do app
├── pre-atendimento.html    # Formulário de pré-atendimento
├── manifest.json           # Configuração PWA
├── sw.js                   # Service Worker (cache offline)
├── css/
│   └── style.css           # Estilos globais (tema claro/escuro)
├── js/
│   ├── app.js              # Lógica principal do app
│   ├── auth.js             # Autenticação (OTP via Brevo)
│   ├── artigos.js          # Base de dados de legislação
│   ├── checklists.js       # Checklists de ocorrência + referências
│   ├── pcsp-doc.js         # Motor de documentos oficiais (PCDoc)
│   ├── pcsp-units.js       # Lista de unidades da PCSP
│   ├── quesitos.js         # Quesitos periciais por crime
│   ├── supabase.js         # Integração Supabase
│   └── templates.js        # Modelos de texto para BO
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Funcionalidades

### 🟦 Seção: Plantão

| Recurso | Descrição |
|---------|-----------|
| **Checklist de Ocorrência** | Seleção do tipo de ocorrência (flagrante, vítima, TCO etc.) com checklist interativo por seções. Suporte a observações por item. |
| **Relatório do Plantão** | Registro manual dos BOs do turno (número, natureza, circunscrição, flagrante). Imprimível. |
| **Rotina do Plantão** | Checklist de procedimentos obrigatórios do turno (comunicações, destinação de presos, etc.). |
| **Orientações Gerais** | Referência rápida com regras e procedimentos do plantão (menores, flagrante, acidentes, audiência de custódia etc.). |
| **Tabela IC / IML** | Tabela de natureza e objetivo das requisições periciais por tipo de ocorrência. |

---

### 🟦 Seção: Ferramentas

| Recurso | Descrição |
|---------|-----------|
| **Modelos de E-mail** | Modelos de comunicações institucionais preenchíveis (IML, Seccional, CEPOL, DPM etc.). |
| **Quesitos Periciais** | Manual oficial PCSP de quesitos por tipo de crime, com busca. |
| **Legislação** | Artigos de lei organizados por tema, com busca e cópia rápida. |
| **Pré-Atendimento** | Formulário de triagem para coleta inicial de dados da ocorrência antes da lavratura. |

---

### 🟦 Seção: Documentos Oficiais

Documentos gerados com cabeçalho oficial PCSP (brasão + unidade selecionada), prontos para impressão ou PDF.

| Documento | Campos principais |
|-----------|------------------|
| **Autorização de Coleta de Sangue** | Dados do condutor, CPF, data |
| **Autorização de Extração de Celular** | Qualidade (indiciado/investigado/parte), dados do aparelho, endereço via CEP |
| **Autorização de Entrada em Residência** | Declarante, endereço, policial responsável (opcional) |
| **FONAR** | Formulário Nacional de Avaliação de Risco — Violência Doméstica e Familiar contra a Mulher. Campos de identificação das partes, 25 perguntas distribuídas em 4 blocos, assinatura da vítima, bloco do profissional, rodapé institucional CNJ/CNMP |
| **Troca de Plantão** | Lista dinâmica de trocas (data + turno + carreira + nome), assinaturas individuais, bloco "Nada a opor" com delegado titular centralizado |

**Motor PCDoc:** todos os documentos usam o mesmo motor (`pcsp-doc.js`) com seletor de departamento → unidade, campos configuráveis por documento, pré-visualização inline e botão de impressão/PDF.

---

### 🟦 Seção: Modelos de Texto

Textos gerados automaticamente para inserção em boletins de ocorrência, com campos preenchíveis via modal.

| Modelo | Descrição |
|--------|-----------|
| **Captura de Procurado** | Histórico completo de captura, adaptado por gênero do capturado e tipo de condutor |
| **Autorização de Contato** | Autorização da vítima para contato via WhatsApp e/ou e-mail |
| **Fotografias de Lesões** | Dois caminhos: lesões aparentes (autoriza fotografação) ou sem lesões (prejudicada + orientação IML) |
| **Representação Criminal** | Três caminhos: representa agora / não representa + autoria conhecida / não representa + autoria desconhecida. Prazo do art. 38 CPP |
| **Medida Protetiva** | Seleção múltipla de 12 medidas da Lei Maria da Penha com texto jurídico completo gerado |
| **Lavratura de TCO** | Texto do Termo Circunstanciado adaptado para 1 pessoa ou mais de 1 pessoa (art. 69/71 Lei 9.099/95) |
| **Vida Pregressa** | Art. 6º, IX, CPP — 25 campos com perguntas em caixa baixa e respostas em CAIXA ALTA. Campos fechados com radio buttons (sim/não/prejudicado), campos abertos para respostas descritivas. Botão de compartilhamento via WhatsApp |
| **Histórico de Desaparecimento** | Histórico completo com 25+ campos, 7 parágrafos corridos, adaptado por gênero do comunicante e do desaparecido. Inclui campos sensíveis (transtorno mental, intenção, ameaças, suspeito) |

---

### 🟦 Seção: Links Úteis

Links diretos para sistemas policiais, exibidos inline na home e na sidebar:

- **BNMP** — Banco Nacional de Mandados de Prisão (CNJ)
- **Córtex** — Plataforma integrada de segurança pública (MJ)
- **Infoseg** — Sistema Nacional de Informações de Segurança (SINESP)
- **Muralha Paulista** — Sistema operacional de monitoramento (SP)
- **TJ-SP** — Portal de serviços do Tribunal de Justiça de São Paulo
- **Unidades PC-SP** — Consulta de unidades da Polícia Civil de SP

---

## PWA

- Instalável em dispositivos móveis via banner exibido automaticamente
- Funciona parcialmente offline (arquivos estáticos cacheados via Service Worker)
- Ícones 192×192 e 512×512

---

## Configuração de Infraestrutura

### Cloudflare Worker
- **Nome:** `plantaocheck-email`
- **URL:** `https://plantaocheck-email.plantaocheck.workers.dev`
- **Função:** proxy para a API Brevo, mantendo a chave secreta fora do repositório
- **Variável secreta:** `BREVO_API_KEY` (configurada no painel do Cloudflare)
- **Validação:** aceita apenas e-mails com domínio `.gov.br`

### Brevo
- Plataforma de envio de e-mail transacional
- Remetente verificado: `plantaocheck@gmail.com`
- Template do e-mail: gerado pelo Worker (HTML inline com identidade visual do PlantãoCheck)

### Supabase
- Armazena dados de plantões abertos e histórico de ocorrências por usuário

---

## Padrões de Desenvolvimento

### Motor PCDoc (`pcsp-doc.js`)
Cada documento é definido como um objeto `PCSP_DOCS.nomeDoc` com:
- `id`, `titulo`, `subtitulo`, `icone`
- `campos`: array de campos (`text`, `select`, `toggle`, `address`, `radio`, `multiselect`)
- `gerar(campos, u)`: função que retorna o corpo HTML do documento
- `customModal: true` para documentos com modal próprio (ex: Troca de Plantão)

### Motor de Templates (`templates.js`)
Cada modelo é definido em `TEMPLATES.nomeTemplate` com:
- `title`: título exibido no modal
- `fields`: array de campos (`text`, `select`, `radio`, `multiselect`) com suporte a `showIf` para visibilidade condicional
- `generate(f)`: função que retorna o texto gerado (string pura)
- `renderAsHtml: true` para modelos que retornam HTML

### Convenções
- CSS inline nos templates de documento (sem dependência de classes externas)
- Acentos em strings JS via unicode escapes (`\u00e3`, `\u00e9` etc.)
- Todo campo de radio usa `value` com acentuação correta para saída no texto gerado
- Campos opcionais marcados com `required: false`

## Desenvolvido por

Gabriel Vital — [brasilemregra.com.br](https://brasilemregra.com.br)
