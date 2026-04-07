# Plantão Check

Sistema de checklist interativo para o plantão policial. Desenvolvido para uso interno da Polícia Civil do Estado de São Paulo.

---

## Funcionalidades

- Checklists por tipo de ocorrência (13 tipos)
- Progresso visual por item e seção
- Estado salvo automaticamente no navegador
- Geradores de texto (histórico de BO, e-mails modelo) com botão copiar
- Referências rápidas (requisições IML/IC, orientações gerais)
- Exportação PDF e impressão
- Autenticação com código de verificação por e-mail
- Restrição de acesso a e-mails `@policiacivil.sp.gov.br`
- Modo escuro / modo claro
- Responsivo (foco no uso em computador)

---

## Estrutura de arquivos

```
plantao-checklist/
├── index.html          # Tela de login e cadastro
├── app.html            # Aplicativo principal
├── css/
│   ├── style.css       # Estilos do sistema
│   └── print.css       # Estilos de impressão/PDF
├── js/
│   ├── auth.js         # Autenticação e EmailJS
│   ├── checklists.js   # Dados de todos os checklists
│   ├── templates.js    # Geradores de texto modelo
│   └── app.js          # Lógica principal do app
└── README.md
```

---

## Configuração do EmailJS (obrigatório para envio real de código)

O app usa o [EmailJS](https://www.emailjs.com) para enviar os códigos de verificação diretamente do navegador, sem necessidade de servidor.

### Passo a passo

1. **Crie uma conta em [emailjs.com](https://www.emailjs.com)** (plano gratuito: 200 e-mails/mês)

2. **Crie um Email Service:**
   - Vá em `Email Services` > `Add New Service`
   - Conecte seu Gmail ou Outlook institucional
   - Anote o **Service ID** (ex: `service_abc123`)

3. **Crie um Email Template:**
   - Vá em `Email Templates` > `Create New Template`
   - Configure o template assim:
     - **Assunto:** `[Plantão Check] Código de verificação: {{code}}`
     - **Corpo do e-mail:**
       ```
       Olá {{name}},

       Seu código de verificação para o Plantão Check é:

       {{code}}

       Este código expira em 15 minutos.
       Caso não tenha solicitado este código, ignore este e-mail.
       ```
     - **To Email:** `{{to_email}}`
   - Anote o **Template ID** (ex: `template_xyz789`)

4. **Obtenha sua Public Key:**
   - Vá em `Account` > `API Keys`
   - Copie a **Public Key**

5. **Configure o arquivo `js/auth.js`:**
   Substitua as três constantes no início do arquivo:
   ```javascript
   const EMAILJS_SERVICE_ID  = 'service_abc123';   // seu Service ID
   const EMAILJS_TEMPLATE_ID = 'template_xyz789';  // seu Template ID
   const EMAILJS_PUBLIC_KEY  = 'sua_public_key';   // sua Public Key
   ```

> **Atenção:** Sem essa configuração, o app funciona em "modo desenvolvimento": o código é gerado e exibido no Console do navegador (F12), permitindo testar o fluxo localmente sem envio de e-mail.

---

## Hospedagem no GitHub Pages — Passo a passo completo

### Pré-requisitos

- Conta no [GitHub](https://github.com) (gratuita)
- Git instalado no computador (opcional — pode usar a interface web do GitHub)

---

### Opção A — Pelo navegador (sem instalar nada)

1. **Crie um repositório no GitHub:**
   - Acesse [github.com](https://github.com) e faça login
   - Clique no botão `+` (canto superior direito) > `New repository`
   - Nome do repositório: `plantao-checklist` (ou o nome que preferir)
   - Visibilidade: **Public** (necessário para GitHub Pages gratuito)
   - Clique em `Create repository`

2. **Faça upload dos arquivos:**
   - Na página do repositório recém-criado, clique em `uploading an existing file`
   - Arraste todos os arquivos e pastas do projeto:
     - `index.html`
     - `app.html`
     - `README.md`
     - A pasta `css/` com os dois arquivos dentro
     - A pasta `js/` com os quatro arquivos dentro
   - **Importante:** mantenha a estrutura de pastas exatamente como está
   - Clique em `Commit changes`

3. **Ative o GitHub Pages:**
   - Vá em `Settings` (aba no topo do repositório)
   - No menu lateral esquerdo, clique em `Pages`
   - Em `Source`, selecione **Deploy from a branch**
   - Em `Branch`, selecione **main** e a pasta **/ (root)**
   - Clique em `Save`

4. **Aguarde a publicação:**
   - Em alguns minutos, o GitHub exibirá a URL do seu site
   - Formato: `https://SEU_USUARIO.github.io/plantao-checklist/`
   - Pronto! Acesse essa URL para usar o app

---

### Opção B — Via Git (linha de comando)

```bash
# 1. Clone ou inicialize o repositório
git init plantao-checklist
cd plantao-checklist

# 2. Copie todos os arquivos do projeto para esta pasta

# 3. Commit inicial
git add .
git commit -m "Primeiro commit — Plantão Check"

# 4. Conecte ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/plantao-checklist.git
git branch -M main
git push -u origin main

# 5. Ative o GitHub Pages nas configurações do repositório (interface web)
```

---

### Atualizar o app depois de alterações

**Via navegador:** Vá ao repositório > clique no arquivo > ícone de lápis (editar) > faça a alteração > `Commit changes`

**Via Git:**
```bash
git add .
git commit -m "Descrição da alteração"
git push
```

O GitHub Pages atualiza automaticamente em 1-2 minutos após o commit.

---

## Observações importantes

### Segurança
- O app usa `localStorage` do navegador para armazenar dados de usuário
- Cada dispositivo/navegador possui seu próprio banco de dados local
- Dados de check não são compartilhados entre computadores — isso é intencional para uso individual no plantão
- Não armazene informações sigilosas no app além das previstas nos checklists

### Limitações
- **GitHub Pages é estático:** não há servidor, portanto sem banco de dados central
- Se limpar os dados do navegador, os cadastros serão perdidos (usuários precisam se recadastrar)
- Para uso em rede interna ou com banco centralizado, seria necessário um servidor (fora do escopo deste projeto)

### Compatibilidade
- Testado em Chrome, Edge e Firefox (versões recentes)
- Foco em uso desktop — responsivo para consulta mobile

---

## Tipos de ocorrência disponíveis

1. Captura de Procurado
2. Flagrante + Captura
3. Flagrante — Peças Gerais
4. Adulteração de Sinal de Veículo
5. Homicídio / Tentativa de Homicídio
6. Ocorrência com Adolescente
7. Violência Doméstica (Maria da Penha)
8. Tráfico de Drogas
9. Dano
10. Embriaguez ao Volante
11. Encontro de Cadáver
12. Arma de Fogo (Posse/Porte/Disparo)
13. Morte Suspeita
14. Morte Natural

---

## Modelos de texto disponíveis

- Histórico de BO — Captura de Procurado
- E-mail de guincho / veículo apreendido
- E-mail de ocorrência de relevância
- E-mail de desaparecimento de pessoa

---

*Plantão Check — Uso interno. Não inclui dados sigilosos.*
