-- ============================================================
-- BADGES
-- ============================================================
insert into public.badges (name, description, icon_emoji, condition_type, condition_value) values
('Primeira Oração', 'Completou o primeiro devocional em família!', '🌟', 'streak', 1),
('7 Dias Fiel', 'Completou 7 dias seguidos de devocional!', '🔥', 'streak', 7),
('Mês Dedicado', 'Completou 30 dias seguidos de devocional!', '🏆', 'streak', 30),
('Centurião da Fé', 'Completou 100 dias seguidos!', '⚔️', 'streak', 100),
('Herói do Quiz', 'Completou o quiz bíblico pela primeira vez!', '🎯', 'game', 1),
('Mestre da Memória', 'Completou o jogo da memória!', '🧠', 'memory', 1),
('Aventureiro da Arca', 'Completou a Aventura da Arca!', '⛵', 'ark', 1);

-- ============================================================
-- FLASHCARDS (50 versículos)
-- ============================================================
insert into public.flashcards (verse, reference, category, difficulty) values
-- Fáceis (Novo Testamento, clássicos)
('Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', 'João 3:16', 'Amor de Deus', 'easy'),
('O SENHOR é o meu pastor; nada me faltará.', 'Salmos 23:1', 'Cuidado de Deus', 'easy'),
('Tudo posso naquele que me fortalece.', 'Filipenses 4:13', 'Força', 'easy'),
('Sede fortes e corajosos. Não temais, nem vos assusteis diante deles; porque o SENHOR, vosso Deus, é quem anda convosco; não vos deixará, nem vos desamparará.', 'Deuteronômio 31:6', 'Coragem', 'easy'),
('Confia no SENHOR de todo o seu coração e não se apoie em seu próprio entendimento.', 'Provérbios 3:5', 'Confiança', 'easy'),
('Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.', 'João 14:6', 'Jesus', 'easy'),
('Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos!', 'Filipenses 4:4', 'Alegria', 'easy'),
('Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.', 'Isaías 41:10', 'Proteção', 'easy'),
('O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.', '1 Coríntios 13:4', 'Amor', 'easy'),
('Sede, pois, imitadores de Deus, como filhos amados.', 'Efésios 5:1', 'Imitação de Cristo', 'easy'),

-- Médios
('Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas essas coisas vos serão acrescentadas.', 'Mateus 6:33', 'Prioridades', 'medium'),
('E tudo o que fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens.', 'Colossenses 3:23', 'Trabalho', 'medium'),
('Mas os que esperam no SENHOR renovarão as forças; subirão com asas como águias.', 'Isaías 40:31', 'Esperança', 'medium'),
('O principio da sabedoria é o temor do SENHOR.', 'Provérbios 9:10', 'Sabedoria', 'medium'),
('Porque sou eu que conheço os planos que tenho para vocês, diz o SENHOR, planos de fazê-los prosperar.', 'Jeremias 29:11', 'Planos de Deus', 'medium'),
('Deus é o nosso refúgio e fortaleza, socorro bem presente nas tribulações.', 'Salmos 46:1', 'Refúgio', 'medium'),
('Mas, se servir ao SENHOR vos parece mau, escolhei hoje a quem sirveis.', 'Josué 24:15', 'Escolha', 'medium'),
('O filho sábio alegra ao pai, mas o filho louco é a tristeza de sua mãe.', 'Provérbios 10:1', 'Família', 'medium'),
('Honra a teu pai e a tua mãe, para que se prolonguem os teus dias na terra.', 'Êxodo 20:12', 'Família', 'medium'),
('Ensinai a criança no caminho em que deve andar, e, ainda quando for velho, não se desviará dele.', 'Provérbios 22:6', 'Educação', 'medium'),
('Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.', 'Mateus 11:28', 'Descanso', 'medium'),
('Mesmo que eu ande pelo vale da sombra da morte, não temerei mal algum.', 'Salmos 23:4', 'Proteção', 'medium'),
('Porque o SENHOR é bom, a sua misericórdia é eterna, e a sua fidelidade permanece por todas as gerações.', 'Salmos 100:5', 'Bondade', 'medium'),
('Mas eu vos digo: Amai os vossos inimigos e orai pelos que vos perseguem.', 'Mateus 5:44', 'Amor ao próximo', 'medium'),
('Porque onde estiverem dois ou três reunidos em meu nome, aí estou no meio deles.', 'Mateus 18:20', 'Comunidade', 'medium'),

-- Difíceis
('Portanto, não vos inquieteis com o dia de amanhã, pois o dia de amanhã cuidará de si mesmo.', 'Mateus 6:34', 'Confiança', 'hard'),
('Mas graças a Deus, que nos dá a vitória por nosso Senhor Jesus Cristo!', '1 Coríntios 15:57', 'Vitória', 'hard'),
('Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.', 'Hebreus 11:1', 'Fé', 'hard'),
('E conhecereis a verdade, e a verdade vos libertará.', 'João 8:32', 'Verdade', 'hard'),
('Porque nele foram criadas todas as coisas, nos céus e na terra.', 'Colossenses 1:16', 'Criação', 'hard'),
('Sede vigilantes e estai alertas. O diabo, vosso adversário, anda em derredor como leão que ruge, procurando alguém para devorar.', '1 Pedro 5:8', 'Vigilância', 'hard'),
('Examinai tudo. Retende o bem.', '1 Tessalonicenses 5:21', 'Discernimento', 'hard'),
('Pois a palavra de Deus é viva, e eficaz, e mais cortante do que qualquer espada de dois gumes.', 'Hebreus 4:12', 'Palavra de Deus', 'hard'),
('Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente.', 'Romanos 12:2', 'Transformação', 'hard'),
('Porque pela graça sois salvos, mediante a fé; e isso não vem de vós; é dom de Deus.', 'Efésios 2:8', 'Salvação', 'hard'),
('Tende em vós o mesmo sentimento que houve também em Cristo Jesus.', 'Filipenses 2:5', 'Humildade', 'hard'),
('Eu te louvarei, porque de um modo assombrosamente maravilhoso fui feito.', 'Salmos 139:14', 'Identidade', 'hard'),
('Pedi e dar-se-vos-á; buscai e achareis; batei e abrir-se-vos-á.', 'Mateus 7:7', 'Oração', 'hard'),
('Porque nada é impossível para Deus.', 'Lucas 1:37', 'Fé', 'hard'),
('A paz de Deus, que excede todo entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.', 'Filipenses 4:7', 'Paz', 'hard'),
('Mas buscai primeiro o reino de Deus.', 'Lucas 12:31', 'Prioridades', 'hard'),
('O SENHOR te abençoe e te guarde.', 'Números 6:24', 'Bênção', 'easy'),
('Deleita-te no SENHOR, e ele satisfará os desejos do teu coração.', 'Salmos 37:4', 'Deleite', 'medium'),
('Filho meu, se te seduzir os pecadores, não os sigas.', 'Provérbios 1:10', 'Integridade', 'medium'),
('Porque eu já sei que os vossos planos são planos de paz e não de calamidade.', 'Jeremias 29:11', 'Esperança', 'medium'),
('Mas vós sois a geração eleita, o sacerdócio real, a nação santa.', '1 Pedro 2:9', 'Identidade', 'hard'),
('O amor perfeito lança fora o temor.', '1 João 4:18', 'Amor', 'medium'),
('Pois Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio.', '2 Timóteo 1:7', 'Coragem', 'easy'),
('Generoso é aquele que dá ao necessitado; sua justiça permanece para sempre.', 'Salmos 112:9', 'Generosidade', 'medium'),
('Cria em mim, ó Deus, um coração puro.', 'Salmos 51:10', 'Pureza', 'easy');

-- ============================================================
-- 5 SAMPLE DEVOTIONALS (rest generated by AI on demand)
-- ============================================================
insert into public.devotionals (date, verse, verse_reference, parent_explanation, children_story, questions, prayer, theme, generated_by_ai) values
(
  current_date - interval '4 days',
  'Confia no SENHOR de todo o seu coração e não se apoie em seu próprio entendimento; reconhece-o em todos os seus caminhos, e ele endireitará as tuas veredas.',
  'Provérbios 3:5-6',
  'Este versículo nos convida a uma postura de dependência total em Deus, especialmente como pais. Muitas vezes tendemos a confiar apenas na nossa inteligência, experiência e planejamento para conduzir nossa família. Mas Salomão, o homem mais sábio que viveu, nos diz que a verdadeira sabedoria começa em Deus. Confiar com "todo o coração" significa sem reservas, sem um plano B secreto. Quando reconhecemos Deus em todos os nossos caminhos — inclusive nas decisões difíceis sobre educação dos filhos, finanças, e relacionamentos — Ele promete endireitar nossas veredas. Isso não significa que não haverá dificuldades, mas que Deus guiará nossos passos mesmo quando não enxergamos o caminho inteiro.',
  'Era uma vez um menino chamado Tomás que adorava resolver quebra-cabeças. Um dia ele recebeu um quebra-cabeça enorme de 1.000 peças. Tomás olhou para a caixa e disse: "Eu consigo fazer sozinho!" Mas por mais que tentasse, as peças não encaixavam direito. Sua mãe entrou no quarto e disse: "Você quer ajuda?" Tomás teimou que não precisava. Depois de horas frustrado, ele finalmente chamou a mãe. Juntos, olhando para a imagem na caixa, as peças começaram a encaixar perfeitamente. Deus é como aquela imagem na caixa — ele já vê o resultado final da nossa vida, e quando confiamos nele, tudo começa a fazer sentido!',
  '["Por que é importante confiar em Deus quando não sabemos o que fazer?", "Você já tentou fazer algo sozinho e depois pediu ajuda? Como foi?", "Como podemos reconhecer Deus nas nossas decisões do dia a dia?"]',
  'Senhor, ensinamos nossos filhos a confiar em Ti com todo o coração. Que nossa família não dependa apenas do nosso entendimento, mas que em cada decisão, grande ou pequena, reconheçamos Tua presença. Guia nossos passos hoje. Amém.',
  'Confiança',
  false
),
(
  current_date - interval '3 days',
  'Sede fortes e corajosos. Não temais, nem vos assusteis diante deles; porque o SENHOR, vosso Deus, é quem anda convosco; não vos deixará, nem vos desamparará.',
  'Deuteronômio 31:6',
  'Estas palavras foram ditas por Moisés ao povo de Israel antes de entrarem na Terra Prometida — um momento de grande incerteza e medo. Moisés tinha 120 anos e sabia que não continuaria com eles. A mensagem central é poderosa: a coragem cristã não é ausência de medo, mas a presença de Deus no meio do medo. Como pais, muitas vezes enfrentamos desafios que nos parecem grandes demais: crianças doentes, problemas financeiros, relacionamentos difíceis. Deus não promete um caminho sem obstáculos, mas promete Sua presença constante. "Não vos deixará, nem vos desamparará" — esta é uma das promessas mais reconfortantes de toda a Bíblia.',
  'A pequeña Lara tinha medo de escuro. Toda noite, quando a mãe apagava a luz, ela ficava com o coração batendo forte. Um dia, o pai deu a ela uma lanterninha especial. "Esta lanterna representa Deus", ele disse. "Mesmo quando não conseguimos ver, Ele está sempre iluminando nosso caminho por dentro." Lara colocou a lanterna no peito e sentiu um calor gostoso. Deus é como essa luz — não some quando apagamos as luzes, mas continua iluminando nosso coração de por dentro!',
  '["O que te deixa com medo? Como podemos lembrar que Deus está conosco nesses momentos?", "Qual é a diferença entre coragem e não ter medo?", "De que maneiras Deus pode nos ajudar quando estamos assustados?"]',
  'Deus, obrigado por nunca nos deixar sozinhos. Enche nossa família de coragem, sabendo que Tu andas conosco em cada momento. Quando o medo vier, lembremos de Tua promessa. Amém.',
  'Coragem',
  false
),
(
  current_date - interval '2 days',
  'Honra a teu pai e a tua mãe, para que se prolonguem os teus dias na terra que o SENHOR, teu Deus, te dá.',
  'Êxodo 20:12',
  'Este mandamento é único entre os Dez Mandamentos — é o único com uma promessa anexada. Deus levou este princípio tão a sério que o incluiu entre mandamentos como "não matar" e "não roubar". Para os pais, este versículo é tanto uma instrução para os filhos quanto um lembrete de nossa responsabilidade: merecemos honra quando vivemos de maneira honrável. Honrar pais não significa concordar com tudo, mas reconhecer a autoridade e o valor daqueles que Deus colocou sobre nós. Para as crianças, aprender a honrar pais é treinar para honrar a Deus.',
  'Miguel tinha 8 anos e não gostava quando a mãe pedia para arrumar o quarto. Um dia, ele foi brincar na casa do amigo Pedro, cuja mãe estava doente. Pedro arrumava a casa, lavava a louça e cuidava da mãe com um sorriso. "Não parece que é chato?" perguntou Miguel. "Não," disse Pedro, "minha mãe cuida de mim todos os dias. É a minha vez de cuidar dela." Miguel voltou para casa diferente. Olhou para a mãe com outros olhos — e foi espontaneamente arrumar o quarto.',
  '["O que significa honrar pai e mãe no dia a dia?", "Como você pode mostrar amor e respeito pelos seus pais hoje?", "Por que Deus acha tão importante que honremos nossos pais?"]',
  'Pai Celestial, que nossa família aprenda a se honrar mutuamente. Que nossos filhos vejam em nós motivos para honrar, e que nós sejamos pais dignos desse amor. Ensina-nos a respeito uns dos outros. Amém.',
  'Família',
  false
),
(
  current_date - interval '1 day',
  'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
  'João 3:16',
  'Este é talvez o versículo mais conhecido de toda a Bíblia, e com razão. Ele resume em uma frase toda a mensagem do Evangelho. Três aspectos merecem nossa atenção como família: Primeiro, o TAMANHO do amor — "amou o mundo de tal maneira". Não é um amor comum, é um amor sem medida. Segundo, o PREÇO do amor — "deu o seu Filho unigênito". O maior sacrifício possível foi feito por nós. Terceiro, o ALCANCE do amor — "todo aquele que nele crê". Esta promessa não tem exceção. Como pais, nosso maior presente para os filhos é apresentá-los a este amor que é maior que qualquer amor humano.',
  'Era uma vez um pai que tinha um filho muito especial. Este pai era rei e tinha um lindo jardim com a mais bela flor do mundo. Um dia, o menino do vilarejo ao lado ficou doente e só aquela flor poderia curar. O rei poderia ter dado qualquer outra coisa, mas deu sua flor mais preciosa. Deus fez o mesmo por nós — deu o que tinha de mais precioso, Jesus, para que nenhum de nós precisasse ficar separado dEle para sempre. É o amor maior que existe!',
  '["Como você explica o amor de Deus para alguém que nunca ouviu falar de Jesus?", "O que significa ter vida eterna com Deus?", "Como podemos mostrar amor aos outros da mesma forma que Deus nos amou?"]',
  'Obrigado, Senhor, pelo maior presente de todos: Jesus. Que nossa família nunca esqueça o preço do Teu amor. Que vivamos cada dia gratos por essa salvação. Amém.',
  'Amor de Deus',
  false
),
(
  current_date,
  'Tudo posso naquele que me fortalece.',
  'Filipenses 4:13',
  'Paulo escreveu este versículo de dentro de uma prisão. Não era uma declaração de poder pessoal, mas de dependência radical em Cristo. O contexto (Fp 4:11-12) revela que Paulo aprendeu a contentar-se em qualquer situação — na abundância e na necessidade. Como pais, frequentemente nos sentimos insuficientes para os desafios que enfrentamos: criar filhos neste mundo complexo, manter casamentos saudáveis, equilibrar trabalho e família. A boa notícia é que Deus não nos chamou a ser suficientes por conta própria. Ele nos chamou a depender dAquele que É suficiente.',
  'Clara tinha uma bolsa escolar muito importante no sábado. Ela praticava piano há meses, mas na véspera, seus dedos tremiam tanto que ela errava toda hora. "Não consigo!", ela chorou. O pai se sentou ao lado dela e disse: "Repita comigo: Tudo posso naquele que me fortalece." Clara repetiu baixinho. "Isso não quer dizer que você vai tocar perfeitamente", disse o pai. "Quer dizer que Deus estará lá com você, e Ele é suficiente mesmo quando você não é." No sábado, Clara tocou melhor do que nunca — não porque de repente ficou perfeita, mas porque não estava mais sozinha.',
  '["Tem algo que parece difícil demais para você? Como Deus pode te ajudar nisso?", "Qual é a diferença entre fazer tudo sozinho e fazer tudo com a força de Deus?", "Como podemos lembrar de pedir a ajuda de Deus antes de tentar algo difícil?"]',
  'Senhor, em nossa fraqueza, Tu és forte. Obrigado porque não precisamos de nossas próprias forças — as Tuas são suficientes. Ensinai nossa família a depender de Ti em tudo. Amém.',
  'Força',
  false
);
