# Requirements Document

## Introduction

Site estático e interativo com estilo visual de scrapbook/colagem para compartilhar uma timeline divertida de relacionamentos passados com amigos. O site apresenta uma linha do tempo horizontal com fotos, cards criativos e elementos visuais charmosos, construído com HTML, CSS e JavaScript vanilla.

## Glossary

- **Timeline**: Componente visual central composto por uma linha horizontal preta com nós (pontos) conectando cada evento/relacionamento em ordem cronológica.
- **Card**: Elemento visual que representa um relacionamento na timeline, contendo foto ou fallback criativo, nome e moldura estilizada.
- **Card_Foto**: Card que exibe a foto principal do ex dentro de uma moldura interativa (estilo janela de OS antigo ou Polaroid inclinada).
- **Card_Fallback**: Card criativo exibido para exes sem foto, apresentando o nome de forma proeminente com elementos visuais humorísticos.
- **Modal_Galeria**: Popup/lightbox que abre ao clicar em um Card_Foto quando existem múltiplas fotos para o mesmo ex, permitindo navegação entre as imagens.
- **Header**: Cabeçalho visual chamativo e divertido no topo do site, inspirado em "MOMENTOS ESPECIAIS" com tom de diário/fofoca saudável.
- **Seção_Final**: Elemento visual no final da timeline com texto "CONTINUA..." ou mensagem humorística, seguido de botão de compartilhamento.
- **Sistema**: O site estático relationship-timeline como um todo.
- **Moldura_OS**: Estilo de moldura que imita janelas de sistemas operacionais antigos, com botões de fechar/minimizar no topo.
- **Moldura_Polaroid**: Estilo de moldura que imita fotos Polaroid inclinadas.

## Requirements

### Requisito 1: Estrutura da Timeline Horizontal

**User Story:** Como usuária, eu quero ver uma linha do tempo horizontal com scroll suave, para que eu possa navegar pelos relacionamentos de forma divertida e intuitiva.

#### Critérios de Aceitação

1. THE Sistema SHALL renderizar uma linha horizontal preta com espessura entre 2px e 4px, centralizada verticalmente no container da timeline.
2. THE Sistema SHALL exibir nós circulares (pontos/dots) com diâmetro entre 10px e 16px na linha horizontal, um para cada Card de relacionamento, posicionados na interseção da linha com o conector vertical do Card correspondente.
3. THE Sistema SHALL distribuir pequenos corações vermelhos decorativos (mínimo 1 a cada 2 Cards) ao longo da linha da timeline, posicionados próximos à linha horizontal ou aos conectores dos Cards.
4. THE Sistema SHALL implementar scroll horizontal suave com CSS scroll-behavior: smooth ou equivalente JavaScript, respondendo tanto a scroll do mouse/trackpad quanto a gestos de swipe em dispositivos touch.
5. THE Sistema SHALL exibir exatamente 18 Cards na timeline, um para cada relacionamento listado.
6. THE Sistema SHALL ser responsivo, mantendo o layout de scroll horizontal funcional em viewports de 320px até 1920px de largura.

### Requisito 2: Ordem Cronológica e Alternância de Cards

**User Story:** Como usuária, eu quero que os relacionamentos apareçam na ordem cronológica correta e alternando posições, para que a timeline tenha um visual dinâmico e organizado.

#### Critérios de Aceitação

1. THE Sistema SHALL exibir os Cards da esquerda para a direita na seguinte ordem cronológica: Erick (posição 1), Ismael (posição 2), Valmir vôlei (posição 3), Fabio Jaboatão (posição 4), Otacílio (posição 5), Fábio amigo de Jacó (posição 6), Stenio (posição 7), Fábio Vôlei (posição 8), Pedro Codai (posição 9), Henderson (posição 10), Leandro (posição 11), Márcio (posição 12), Nathan (posição 13), Azevedo (posição 14), Jairo (posição 15), Robyson (posição 16), Patrick (posição 17), Izaac (posição 18).
2. THE Sistema SHALL posicionar os Cards com índice ímpar (1, 3, 5, ...) acima da linha da timeline e os Cards com índice par (2, 4, 6, ...) abaixo da linha da timeline, considerando indexação iniciando em 1.
3. THE Sistema SHALL conectar cada Card ao nó correspondente na linha horizontal através de um conector vertical que se estende do Card até o nó na linha da timeline.

### Requisito 3: Cards com Foto e Molduras Interativas

**User Story:** Como usuária, eu quero que as fotos dos meus exes apareçam em molduras estilizadas e interativas, para que o visual seja divertido e nostálgico.

#### Critérios de Aceitação

1. WHEN um relacionamento possui foto disponível, THE Card_Foto SHALL exibir a imagem principal dentro de uma moldura estilizada (Moldura_OS ou Moldura_Polaroid), com a imagem preenchendo a área da moldura usando object-fit: cover.
2. THE Card_Foto SHALL exibir o nome do ex como legenda visível abaixo ou dentro da moldura, em tipografia handwriting/script.
3. THE Moldura_OS SHALL renderizar uma barra de título no topo com pelo menos 3 botões decorativos circulares coloridos (vermelho, amarelo, verde) com diâmetro entre 8px e 14px, imitando janelas de sistemas operacionais antigos.
4. THE Moldura_Polaroid SHALL renderizar a foto com rotação entre -5 e +5 graus e borda branca inferior com altura mínima de 30px para legenda, imitando uma foto Polaroid.
5. WHEN o cursor passa sobre um Card_Foto, THE Sistema SHALL aplicar uma transição CSS com duração entre 200ms e 400ms, incluindo transform: scale entre 1.03 e 1.08 ou translateY entre -3px e -8px.

### Requisito 4: Cards Fallback para Exes sem Foto

**User Story:** Como usuária, eu quero que exes sem foto tenham cards criativos e engraçados, para que ninguém fique de fora da timeline.

#### Critérios de Aceitação

1. WHEN um relacionamento não possui foto disponível, THE Card_Fallback SHALL ser exibido com as mesmas dimensões, bordas e espaçamento dos Cards com foto na timeline.
2. THE Card_Fallback SHALL exibir o nome do ex centralizado horizontal e verticalmente, sendo o maior elemento textual do card, com tamanho máximo de 40 caracteres e truncamento com reticências caso exceda esse limite.
3. THE Card_Fallback SHALL incluir pelo menos 1 elemento visual humorístico dentre os seguintes: silhueta engraçada, ponto de interrogação estilizado, ou mensagem temática (exemplos: "Arquivo não encontrado", "Erros do passado").
4. THE Sistema SHALL gerar Card_Fallback para os seguintes exes: Erick, Valmir vôlei, Fabio Jaboatão, Fábio amigo de Jacó.
5. IF a foto de um ex falhar ao carregar após 5 segundos, THEN THE Sistema SHALL exibir o Card_Fallback correspondente em substituição ao card com foto.

### Requisito 5: Galeria Modal para Múltiplas Fotos

**User Story:** Como usuária, eu quero poder ver todas as fotos de um ex ao clicar no card, para reviver os momentos com mais detalhes.

#### Critérios de Aceitação

1. WHEN um relacionamento possui 2 ou mais fotos disponíveis, THE Card_Foto SHALL exibir a foto com sufixo "01" como imagem principal na timeline; se nenhuma foto com sufixo "01" existir, SHALL exibir a primeira foto em ordem alfabética de nome de arquivo.
2. WHEN o usuário clica em um Card_Foto com 2 ou mais fotos, THE Modal_Galeria SHALL abrir exibindo todas as fotos daquele relacionamento, iniciando pela foto principal do card.
3. THE Modal_Galeria SHALL permitir navegação entre fotos através de botões de anterior/próximo e setas esquerda/direita do teclado, desabilitando o botão anterior na primeira foto e o botão próximo na última foto.
4. WHEN o usuário clica fora do Modal_Galeria, no botão de fechar, ou pressiona a tecla Escape, THE Modal_Galeria SHALL ser fechado e o foco SHALL retornar ao Card_Foto que originou a abertura.
5. WHEN um relacionamento possui apenas uma foto, THE Card_Foto SHALL abrir a foto centralizada na viewport ocupando no máximo 90% da largura e 90% da altura da tela, com fundo escurecido (overlay), e SHALL fechar ao clicar fora da imagem, no botão de fechar ou ao pressionar Escape.
6. WHILE o Modal_Galeria estiver aberto, THE Modal_Galeria SHALL exibir um indicador de posição no formato "N de T" (onde N é o número da foto atual e T é o total de fotos do relacionamento).

### Requisito 6: Mapeamento de Fotos por Relacionamento

**User Story:** Como usuária, eu quero que cada foto seja associada corretamente ao ex correspondente, para que não haja confusão na timeline.

#### Critérios de Aceitação

1. THE Sistema SHALL associar as fotos do diretório /public/images/ a cada relacionamento utilizando o mapeamento explícito definido no critério 2 como fonte autoritativa, tratando a comparação de nomes de arquivo de forma case-insensitive.
2. THE Sistema SHALL associar as seguintes fotos aos respectivos relacionamentos:
   - Ismael: Ismael.jpg
   - Otacílio: otacilio.jpg, otacilioCasório.jpeg
   - Stenio: stenio.jpg, stenio03.JPG, stenio06.jpeg
   - Fábio Vôlei: FabioVôlei01.jpg, fabioVôlei02.jpg, fabioVôlei03.jpg, fabioVôlei05.jpeg
   - Pedro Codai: pedro01.jpg, pedro04.jpeg, pedro05.jpeg, pedro07.jpeg, pedro6.jpg, pedro7.jpg
   - Henderson: Henderson05.jpg, Henderson5.jpg, henderson.JPG
   - Leandro: Leandro.jpg
   - Márcio: marcio.jpg, marcio01.jpg, marcio04.jpg
   - Nathan: Natan.JPG, natan02.jpg, natan03.JPG, natan06.jpeg
   - Azevedo: azevedo.jpg, azevedo02.jpg, Azevedo07.jpg, azevedo05.jpeg, azevedo05.jpg, azevedo06.jpg
   - Jairo: jairo&Eu01.jpg, jairo02.jpg, jairo03.jpg, jairo06.jpeg, jairoCasório.jpg
   - Robyson: robyson.jpg, robyson02.jpg
   - Patrick: Patrick.jpg, patrick02.jpg, patrick05.jpg, patric05.jpg
   - Izaac: izaac willians.jpg
3. IF um arquivo de imagem existir no diretório /public/images/ mas não constar no mapeamento do critério 2, THEN THE Sistema SHALL ignorar esse arquivo e não exibi-lo na timeline de nenhum relacionamento.
4. THE Sistema SHALL aceitar arquivos de imagem com as extensões .jpg, .jpeg e .png (independentemente de capitalização da extensão) como formatos válidos para o mapeamento.

### Requisito 7: Header Visual e Engajamento

**User Story:** Como usuária, eu quero um cabeçalho chamativo e divertido, para que meus amigos fiquem curiosos desde o início.

#### Critérios de Aceitação

1. THE Header SHALL ser o primeiro elemento visível da página, posicionado no topo antes da timeline, ocupando a largura total da viewport.
2. THE Header SHALL exibir um título em tipografia da categoria handwriting ou script (fonte cursiva/manuscrita), com tamanho mínimo de 32px em dispositivos móveis e 48px em desktop.
3. THE Header SHALL utilizar fontes da categoria handwriting ou script carregadas via serviço de fontes web ou declaradas localmente no CSS, garantindo que o texto seja renderizado nessa categoria mesmo quando a fonte preferida não estiver disponível (fallback para cursive).
4. THE Sistema SHALL utilizar fundo com cor de background entre #FFFFFF (branco puro) e #FAFAFA (off-white) para toda a página.
5. THE Header SHALL ter altura mínima de 120px, garantindo que o título e eventuais elementos decorativos sejam visíveis sem necessidade de scroll vertical no carregamento inicial da página.

### Requisito 8: Seção Final da Timeline

**User Story:** Como usuária, eu quero que o final da timeline tenha um elemento divertido e interativo, para encorajar meus amigos a comentarem e compartilharem.

#### Critérios de Aceitação

1. THE Seção_Final SHALL ser posicionada como o último elemento após o 18º Card (Izaac) na timeline, visível ao concluir o scroll horizontal.
2. THE Seção_Final SHALL exibir um elemento visual com texto "CONTINUA..." ou mensagem humorística equivalente, renderizado em tipografia handwriting/script consistente com o restante da timeline.
3. THE Seção_Final SHALL incluir um botão clicável de "Compartilhar no grupo" que executa a Web Share API (navigator.share) quando disponível, ou copia o URL do site para o clipboard com feedback visual de confirmação quando a Web Share API não estiver disponível.
4. THE Seção_Final SHALL manter o estilo visual consistente com o restante da timeline (tipografia manuscrita, elementos decorativos como corações).

### Requisito 9: Estilo Visual Scrapbook

**User Story:** Como usuária, eu quero que o site tenha visual de scrapbook artesanal e charmoso, para que pareça um diário de memórias compartilhado com carinho.

#### Critérios de Aceitação

1. THE Sistema SHALL utilizar fontes da categoria handwriting/script (ex: cursivas ou manuscritas disponíveis via Google Fonts) para títulos e legendas dos Cards, diferenciando-as das fontes utilizadas em textos de corpo.
2. THE Sistema SHALL aplicar rotações aleatórias entre -3 e +3 graus nos Cards ao longo da timeline para simular o efeito de colagem manual.
3. THE Sistema SHALL exibir no mínimo 1 coração vermelho decorativo a cada 2 Cards na timeline, posicionados próximos à linha horizontal ou aos conectores dos Cards.
4. THE Sistema SHALL alternar sequencialmente entre Moldura_OS e Moldura_Polaroid nos Card_Foto ao longo da timeline (Cards ímpares com Moldura_OS, Cards pares com Moldura_Polaroid).

### Requisito 10: Stack Técnica e Estrutura de Arquivos

**User Story:** Como desenvolvedora, eu quero que o site use tecnologias simples e esteja bem organizado, para facilitar manutenção e deploy estático.

#### Critérios de Aceitação

1. THE Sistema SHALL ser construído exclusivamente com HTML, CSS e JavaScript vanilla, sem uso de frameworks ou bibliotecas JavaScript de terceiros (como React, Vue, Angular, jQuery).
2. THE Sistema SHALL organizar todos os arquivos de código-fonte (HTML, CSS, JavaScript) e assets (imagens, fontes) dentro da estrutura do diretório /public/, contendo no mínimo um arquivo HTML como ponto de entrada.
3. THE Sistema SHALL carregar as imagens do diretório /public/images/ usando caminhos relativos (sem URLs absolutas ou dependência de domínio específico).
4. THE Sistema SHALL funcionar como site estático, abrindo corretamente quando servido por qualquer servidor de arquivos estáticos (como http-server, Live Server, ou hospedagem estática) sem necessidade de servidor backend, build step, ou transpilação.
5. IF o Sistema utilizar fontes externas ou recursos de CDN, THEN THE Sistema SHALL manter funcionalidade completa mesmo quando esses recursos externos estiverem indisponíveis, exibindo fontes de fallback do sistema operacional.
