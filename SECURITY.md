# Política de Segurança

## Versões suportadas

O PlantãoCheck é mantido como projeto de código aberto por um desenvolvedor individual. Apenas a versão mais recente disponível na branch `main` recebe correções de segurança.

| Versão | Suportada |
|--------|-----------|
| main (atual) | ✅ |
| versões anteriores | ❌ |

---

## Reportando uma vulnerabilidade

Se você identificou uma vulnerabilidade de segurança no PlantãoCheck, **não abra uma issue pública**. Isso poderia expor outros usuários antes que o problema seja corrigido.

### Como reportar

Envie um e-mail para **gabriel@brasilemregra.com.br** com o assunto `[SEGURANÇA] PlantãoCheck` e inclua:

- Descrição clara da vulnerabilidade
- Passos para reproduzir o problema
- Impacto potencial (quais dados ou usuários podem ser afetados)
- Sugestão de correção, se houver

Você também pode usar o recurso de **Security Advisories** do GitHub para reportar de forma privada diretamente neste repositório.

### O que esperar

- **Confirmação de recebimento:** em até 48 horas
- **Avaliação inicial:** em até 7 dias
- **Correção e divulgação:** assim que a correção estiver disponível, será publicado um advisory com os créditos ao pesquisador, se desejado

---

## Escopo

Este projeto é uma aplicação frontend estática hospedada no GitHub Pages. O escopo de segurança inclui:

- Vazamento de dados de usuários autenticados
- Falhas no fluxo de autenticação por código OTP
- Exposição indevida de chaves ou credenciais no código-fonte
- Cross-site scripting (XSS) nos templates de documentos gerados
- Vulnerabilidades no Cloudflare Worker que atua como proxy de e-mail

### Fora do escopo

- Vulnerabilidades em serviços de terceiros (Brevo, Resend, Supabase, Cloudflare) devem ser reportadas diretamente a esses fornecedores
- Problemas de disponibilidade do GitHub Pages

---

## Créditos

Agradecemos a todos que contribuem para a segurança do projeto de forma responsável.
