# Integração da interface com a API

O frontend contém 13 telas navegáveis, com um módulo JavaScript em `FrontEnd/pages/` por tela. `FrontEnd/js/app.js` gerencia a navegação e o estado local; `FrontEnd/js/ui.js` contém os elementos compartilhados. Nenhum backend/API foi incluído nesta versão. A navegação e as validações são locais; nenhuma chamada ao backend é feita. Rotas, paradas, tarifas, horários, créditos, ocorrências e dados de perfil não são simulados.

## Telas

1. Boas-vindas
2. Entrada e cadastro
3. Início
4. Busca de destino
5. Comparação de rotas
6. Detalhes da rota
7. Acompanhamento da viagem
8. Ocorrências próximas
9. Registro de ocorrência
10. Detalhes do registro (rascunho local, não enviado)
11. Ocorrência da comunidade
12. Carteira de créditos
13. Perfil e impacto

## Contratos a definir com a pessoa responsável pelo backend

- URL base, autenticação, CORS e método dos endpoints.
- Busca de locais e resolução da origem, incluindo permissão e formato de geolocalização.
- Planejamento de viagem: origem, destino, modais e critério de ordenação.
- Formato das opções: linhas, paradas/integrações, duração, tarifa, acessibilidade e fonte/licença.
- Atualização de viagem ativa e estados sem rota, carregando, erro e indisponibilidade.
- Consulta, filtro, criação e detalhe de ocorrências; política de moderação e upload de imagens.
- Consulta de carteira, movimentações e dados de perfil/impacto.

## Integração do mapa

Os contêineres `[data-map-container]`, criados pelo utilitário `mapPlaceholder` em `FrontEnd/js/ui.js`, são espaços vazios reservados ao mapa. Não contêm imagem de mapa, rotas desenhadas ou dados geográficos. Substitua o interior do contêiner apenas depois de confirmar o provedor, a licença, o formato de coordenadas e os parâmetros seguros da API.

## Regras para conectar

- Não apresentar exemplos estáticos como dados oficiais.
- Validar e escapar os dados retornados antes de renderizar; tratar falhas e resultados vazios.
- Não guardar senha, token ou dados sensíveis em `localStorage`/`sessionStorage`; autenticação e gestão de sessão pertencem ao backend.
- O registro de ocorrência atual é mantido somente em memória para permitir revisar a tela. O envio de texto e arquivos ainda não está implementado.
- Confirmar o contrato de API antes de adicionar `fetch()`; documentar campos e códigos de erro acordados nesta página.
