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
