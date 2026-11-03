# Regras do portfólio

## BR-001 — Acesso direto ao conteúdo

Cada seção disponível no terminal também deve abrir por um controle visível. O visitante não precisa saber ou digitar comandos para chegar aos projetos e ao contato.

## BR-002 — Comandos do terminal

`help` lista comandos. `whoami` apresenta Hélio. `projects`, `about`, `career` e `contact` abrem as janelas correspondentes. `clear` apaga apenas o histórico visível da sessão. Um comando desconhecido informa que não foi encontrado e sugere `help`.

Implementação: `src/portfolio/terminal.ts` interpreta a entrada; `src/pages/index.tsx` aplica o resultado à interface.

## BR-003 — Estado das janelas

Abrir uma janela já aberta a traz para frente. Minimizar a esconde sem perder seu conteúdo; clicar no aplicativo novamente a restaura. Fechar remove a janela da sessão. Arrastar fica restrito ao cabeçalho em telas com espaço suficiente.

Implementação: `src/portfolio/useWindowManager.ts` controla o estado; `src/portfolio/DesktopWindow.tsx` valida o início do arrasto e move a janela.

## BR-004 — Projetos

DisciplineHub e project-spec-starter são apresentados como trabalhos distintos, com descrição, estado e links. Capacidades planejadas não devem ser descritas como entregues.

## BR-005 — Áreas de trabalho

Início e Projetos são mesas distintas. O visitante troca entre elas pelos controles visíveis no menu superior. Abrir um aplicativo no dock, no desktop ou no terminal abre sua janela na mesa atual, sem mudar de mesa. Uma janela já aberta em outra mesa é trazida para a mesa atual ao ser aberta novamente. Janelas abertas permanecem em estado e só aparecem na mesa correspondente. Os projetos continuam presentes no HTML para indexação.

## Dados

Esta entrega não coleta dados pelo site. Contato abre o cliente de e-mail do visitante; links externos abrem os destinos declarados.
