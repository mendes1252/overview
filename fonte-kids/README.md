# FONTE KIDS — Gerador de Escalas

Ferramenta autônoma para montar a escala de voluntárias (Tias) do ministério
infantil **FONTE KIDS**. É um único arquivo HTML: funciona **offline**, não
precisa de servidor nem de instalação, e salva tudo automaticamente no próprio
navegador.

## Como usar

Abra o arquivo [`index.html`](./index.html) com um duplo clique (ou arraste
para o navegador). Funciona em celular e computador.

### 1. Cadastro
- **Voluntárias (Tias):** adicione o nome de cada Tia. Para cada uma, marque
  em quais **classes** ela pode servir e em quais **datas** está disponível.
  Se você não marcar nada, ela conta como disponível para **todas** as classes
  e datas.
- **Classes:** as salas/faixas etárias (Berçário, Maternal, Jardim, Primários…).
  O campo *Tias/culto* define quantas voluntárias essa classe precisa por culto.
- **Horários de culto:** os cultos em que há FONTE KIDS (ex.: Domingo Manhã 9h,
  Domingo Noite 18h).
- **Datas:** os dias que entram nesta escala. Há um atalho para adicionar os
  próximos 4 domingos. O dia da semana é calculado sozinho.

### 2. Escala
- **Gerar escala automática:** distribui as Tias respeitando disponibilidade e
  classe, sem repetir a mesma Tia em duas classes no mesmo culto, e equilibrando
  a quantidade de vezes que cada uma é escalada.
- **Ajuste manual:** cada célula tem um seletor — troque a voluntária quando
  quiser. Um aviso ⚠ aparece onde faltou voluntária.
- **Distribuição por Tia:** mostra quantas vezes cada Tia foi escalada, para
  ajudar a equilibrar.

### 3. Exportar
- **CSV** — abre no Excel/Google Planilhas (colunas: Data, Dia, Horário, Classe,
  Voluntárias).
- **PDF** — usa a impressão do navegador; escolha "Salvar como PDF".

## Observações
- Os dados ficam guardados **apenas neste navegador/dispositivo** (localStorage).
  Para levar para outro aparelho, exporte em CSV.
- O botão **Recomeçar** apaga tudo e volta ao estado inicial.
- Tema claro/escuro acompanha o sistema e pode ser alternado no cabeçalho.
