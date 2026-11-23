/* =====================================================================
   PROJETO AV2 - Desenvolvimento de Aplicações para Internet
   Desafio: Transporte Público de qualidade, ágil, baixo custo e sustentável (ODS 11)
   SGBD: MySQL 8.0.16+
   Banco: rotta_dba
*/

CREATE DATABASE rotta_dba
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rotta_dba;
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

/* =====================================================================
   2. DDL
   ===================================================================== */
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS horario_linha;
DROP TABLE IF EXISTS itinerario;
DROP TABLE IF EXISTS linha;
DROP TABLE IF EXISTS ponto;
DROP TABLE IF EXISTS tarifa;
DROP TABLE IF EXISTS operadora;
DROP TABLE IF EXISTS modal;
SET FOREIGN_KEY_CHECKS = 1;

-- Modais de transporte (+ fator de emissão para o ranking de sustentabilidade)
CREATE TABLE modal (
  id_modal TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(30)  NOT NULL,
  fator_emissao_g_pkm  DECIMAL(6,2) NOT NULL, -- g CO2 por passageiro-km (valor de referência)
  sustentavel BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT pk_modal PRIMARY KEY (id_modal),
  CONSTRAINT uq_modal_nome UNIQUE (nome),
  CONSTRAINT ck_modal_emissao CHECK (fator_emissao_g_pkm >= 0)
) ENGINE=InnoDB;

-- Operadoras / gestores
CREATE TABLE operadora (
  id_operadora INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  tipo VARCHAR(30)  NOT NULL,
  CONSTRAINT pk_operadora PRIMARY KEY (id_operadora),
  CONSTRAINT uq_operadora_nome UNIQUE (nome),
  CONSTRAINT ck_operadora_tipo CHECK (tipo IN ('CONSORCIO','METROFERROVIARIO'))
) ENGINE=InnoDB;

-- Tarifas / anéis
CREATE TABLE tarifa (
  id_tarifa INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(40) NOT NULL,
  anel CHAR(1) NULL,
  valor DECIMAL(6,2) NOT NULL,
  CONSTRAINT pk_tarifa PRIMARY KEY (id_tarifa),
  CONSTRAINT uq_tarifa_nome UNIQUE (nome),
  CONSTRAINT ck_tarifa_valor CHECK (valor >= 0)
) ENGINE=InnoDB;

-- Linhas
CREATE TABLE linha (
  id_linha INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(30)  NOT NULL,
  nome VARCHAR(150) NOT NULL,
  id_modal TINYINT UNSIGNED NOT NULL,
  id_operadora INT UNSIGNED NOT NULL,
  id_tarifa INT UNSIGNED NOT NULL,
  descricao VARCHAR(255) NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT pk_linha PRIMARY KEY (id_linha),
  CONSTRAINT uq_linha_codigo UNIQUE (codigo),
  CONSTRAINT fk_linha_modal FOREIGN KEY (id_modal) REFERENCES modal(id_modal) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_linha_operadora FOREIGN KEY (id_operadora) REFERENCES operadora(id_operadora) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_linha_tarifa FOREIGN KEY (id_tarifa) REFERENCES tarifa(id_tarifa) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_linha_modal (id_modal) -- filtro por modal
) ENGINE=InnoDB;

-- Pontos de embarque/desembarque
CREATE TABLE ponto (
  id_ponto INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  tipo_ponto VARCHAR(20)  NOT NULL,
  bairro VARCHAR(80)  NOT NULL,
  cidade VARCHAR(60)  NOT NULL DEFAULT 'Recife',
  logradouro_referencia VARCHAR(150) NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  integracao_sei BOOLEAN NOT NULL DEFAULT FALSE, -- Terminal/estação do Sistema Estrutural Integrado
  CONSTRAINT pk_ponto PRIMARY KEY (id_ponto),
  CONSTRAINT uq_ponto_nome_tipo UNIQUE (nome, tipo_ponto),
  CONSTRAINT ck_ponto_tipo CHECK (tipo_ponto IN ('PARADA','ESTACAO_BRT','ESTACAO_METRO','TERMINAL_INTEGRADO')),
  CONSTRAINT ck_ponto_lat  CHECK (latitude  BETWEEN -90  AND 90),
  CONSTRAINT ck_ponto_lon  CHECK (longitude BETWEEN -180 AND 180),
  INDEX idx_ponto_tipo (tipo_ponto),
  INDEX idx_ponto_bairro (bairro),
  INDEX idx_ponto_geo (latitude, longitude),
  FULLTEXT KEY ft_ponto_busca (nome, logradouro_referencia, bairro)  -- autocomplete origem/destino
) ENGINE=InnoDB;

-- Itinerário: tabela associativa linha x ponto, com a ORDEM das paradas
CREATE TABLE itinerario (
  id_linha INT UNSIGNED NOT NULL,
  ordem SMALLINT UNSIGNED NOT NULL,
  id_ponto INT UNSIGNED NOT NULL,
  minutos_desde_origem SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT pk_itinerario PRIMARY KEY (id_linha, ordem),
  CONSTRAINT uq_itinerario_linha_ponto UNIQUE (id_linha, id_ponto),
  CONSTRAINT fk_itin_linha FOREIGN KEY (id_linha) REFERENCES linha(id_linha) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_itin_ponto FOREIGN KEY (id_ponto) REFERENCES ponto(id_ponto) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_itin_ordem CHECK (ordem >= 1),
  INDEX idx_itin_ponto_linha (id_ponto, id_linha) -- busca origem/destino: "quais linhas passam neste ponto"
) ENGINE=InnoDB;

-- Horários / frequência por tipo de dia
CREATE TABLE horario_linha (
  id_horario INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_linha INT UNSIGNED NOT NULL,
  tipo_dia VARCHAR(15)  NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL, -- pode ser menor que hora_inicio em operação noturna
  freq_pico_min SMALLINT UNSIGNED NULL,
  freq_normal_min SMALLINT UNSIGNED NULL,
  CONSTRAINT pk_horario PRIMARY KEY (id_horario),
  CONSTRAINT uq_horario_linha_dia UNIQUE (id_linha, tipo_dia),
  CONSTRAINT fk_horario_linha FOREIGN KEY (id_linha) REFERENCES linha(id_linha) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT ck_horario_dia CHECK (tipo_dia IN ('UTIL','FIM_DE_SEMANA'))
) ENGINE=InnoDB;

/* =====================================================================
   3. DML - dados do Recife
   ATENÇÃO: coordenadas, tarifas, frequências e tempos são APROXIMADOS/
   ilustrativos. Itinerários de ônibus/BRT são simplificados.
   Validar em granderecife.pe.gov.br e cbtu.gov.br antes da entrega final.
   ===================================================================== */

INSERT INTO modal (id_modal, nome, fator_emissao_g_pkm, sustentavel) VALUES
 (1, 'Ônibus', 75.00, FALSE),
 (2, 'BRT', 55.00, TRUE),
 (3, 'Metrô', 30.00, TRUE),
 (4, 'Integração', 75.00, FALSE);

INSERT INTO operadora (id_operadora, nome, tipo) VALUES
 (1, 'CBTU - Metrô do Recife', 'METROFERROVIARIO'),
 (2, 'Grande Recife Consórcio de Transporte (empresas operadoras)', 'CONSORCIO');

INSERT INTO tarifa (id_tarifa, nome, anel, valor) VALUES
 (1, 'ONIBUS_ANEL_A',  'A', 4.30),
 (2, 'METRO_UNICA',    NULL, 3.80),
 (3, 'BRT_ANEL_A',     'A', 4.30),
 (4, 'INTEGRACAO_SEI', 'A', 4.30);

-- Pontos (1-17 metrô | 18-19 terminais | 20-23 paradas | 24 BRT)
INSERT INTO ponto (id_ponto, nome, tipo_ponto, bairro, cidade, logradouro_referencia, latitude, longitude, integracao_sei) VALUES
 (1,  'Estação Recife (Central)','ESTACAO_METRO', 'São José','Recife','Rua Floriano Peixoto',-8.063800, -34.875600, TRUE),
 
 (2,  'Estação Joana Bezerra','ESTACAO_METRO', 'Joana Bezerra',  'Recife','Av. Dr. José Rufino (ref.)',-8.074500, -34.888700, TRUE),
 
 (3,  'Estação Afogados','ESTACAO_METRO', 'Afogados','Recife','Av. Sul (ref.)',-8.078500, -34.909900, TRUE),
 
 (4,  'Estação Ipiranga','ESTACAO_METRO', 'Ipiranga','Recife','Rua Antônio Justino',-8.084300, -34.922200, FALSE),
 
 (5,  'Estação Werneck','ESTACAO_METRO', 'Areias','Recife','Av. Recife (ref.)',-8.086700, -34.939500, FALSE),
 
 (6,  'Estação Barro','ESTACAO_METRO', 'Barro','Recife','Av. Recife (ref.)',-8.095500, -34.953300, TRUE),
 
 (7,  'Estação Curado','ESTACAO_METRO', 'Curado','Recife','Av. Recife (ref.)',-8.088900, -34.983000, FALSE),
 
 (8,  'Estação Rodoviária (TIP)','ESTACAO_METRO', 'Curado','Recife','BR-232 / TIP (ref.)',-8.072000, -34.985500, TRUE),
 
 (9,  'Estação Camaragibe','ESTACAO_METRO', 'Centro','Camaragibe','Centro de Camaragibe (ref.)',-8.021500, -34.979000, TRUE),
 
 (10, 'Estação Jaboatão','ESTACAO_METRO', 'Centro','Jaboatão dos Guararapes','Centro de Jaboatão (ref.)',-8.112800, -35.014700, TRUE),
 
 (11, 'Estação Largo da Paz','ESTACAO_METRO', 'Afogados','Recife','Rua Francisco Silveira',-8.087200, -34.906000, TRUE),
 
 (12, 'Estação Imbiribeira','ESTACAO_METRO', 'Imbiribeira','Recife','Rua Dr. Valdir Pessoa',-8.108800, -34.907200, FALSE),
 
 (13, 'Estação Antônio Falcão','ESTACAO_METRO', 'Imbiribeira','Recife','Av. Gen. Mac Arthur',-8.115700, -34.905000, FALSE),
 
 (14, 'Estação Shopping','ESTACAO_METRO', 'Imbiribeira','Recife','Rua Jaticy (Shopping Recife)',-8.119500, -34.905500, FALSE),
 
 (15, 'Estação Tancredo Neves','ESTACAO_METRO', 'Imbiribeira','Recife','Av. Mascarenhas de Moraes (ref.)',-8.123000, -34.912000, TRUE),
 
 (16, 'Estação Aeroporto (TI Aeroporto)','ESTACAO_METRO','Imbiribeira','Recife','Aeroporto Internacional dos Guararapes',-8.126400,-34.923000, TRUE),
 
 (17, 'Estação Cajueiro Seco','ESTACAO_METRO', 'Cajueiro Seco', 'Jaboatão dos Guararapes','Rua do Sol (ref.)',-8.179000, -34.935000, TRUE),
 
 (18, 'TI CDU (Cidade Universitária)', 'TERMINAL_INTEGRADO','Cidade Universitária','Recife','Av. Prof. Moraes Rego (ref.)',-8.049000, -34.954000, TRUE),
 
 (19, 'TI Macaxeira','TERMINAL_INTEGRADO','Macaxeira',  'Recife','Av. Norte (ref.)',-8.015600, -34.896800, TRUE),
 
 (20, 'Parada Av. Conde da Boa Vista', 'PARADA','Boa Vista','Recife','Av. Conde da Boa Vista',-8.057500, -34.883000, FALSE),
 
 (21, 'Parada Praça do Derby','PARADA','Derby','Recife','Praça do Derby',-8.056800, -34.896200, FALSE),
 
 (22, 'Parada Av. Boa Viagem','PARADA','Boa Viagem','Recife','Av. Boa Viagem (Praça de Boa Viagem)', -8.114300, -34.895700, FALSE),
 
 (23, 'Parada UFPE (Av. Moraes Rego)', 'PARADA','Cidade Universitária','Recife','Av. Prof. Moraes Rego',-8.050500, -34.949000, FALSE),
 
 (24, 'Estação BRT Cais de Santa Rita','ESTACAO_BRT',   'São José','Recife','Cais de Santa Rita',-8.065600, -34.876600, FALSE);

-- Linhas
INSERT INTO linha (id_linha, codigo, nome, id_modal, id_operadora, id_tarifa, descricao, ativa) VALUES
 (1,  'MET-CENTRO-CAM', 'Metrô Linha Centro - Ramal Camaragibe (Recife / Camaragibe)', 3, 1, 2, 'Estações selecionadas do ramal Camaragibe',TRUE),
 
 (2,  'MET-CENTRO-JAB', 'Metrô Linha Centro - Ramal Jaboatão (Recife / Jaboatão)',3, 1, 2, 'Estações selecionadas do ramal Jaboatão',TRUE),
 
 (3,  'MET-SUL','Metrô Linha Sul (Recife / Cajueiro Seco)',3, 1, 2, 'Estações selecionadas da Linha Sul',TRUE),
 
 (4,  'BRT-NS','BRT Via Livre Norte-Sul (TI Macaxeira / TI Joana Bezerra)',2, 2, 3, 'Itinerário simplificado',TRUE),
 
 (5,  'BRT-LO','BRT Via Livre Leste-Oeste (Camaragibe / Cais de Santa Rita)', 2, 2, 3, 'Itinerário simplificado',TRUE),
 
 (6,  '2043','2043 - TI CDU / TI Joana Bezerra',1, 2, 1, 'Itinerário simplificado',TRUE),
 
 (7,  '168','168 - TI Tancredo Neves / Conde da Boa Vista',1, 2, 1, 'Itinerário simplificado',TRUE),
 
 (8,  '115','115 - TI Aeroporto / TI Afogados',1, 2, 1, 'Itinerário simplificado',TRUE),
 
 (9,  '858','858 - TI Joana Bezerra / TI Afogados / TI Barro',4, 2, 4, 'Linha especial de integração (contingência do metrô)',TRUE);

-- Itinerários (ordem das paradas em um sentido + minutos acumulados)
INSERT INTO itinerario (id_linha, ordem, id_ponto, minutos_desde_origem) VALUES
 -- 1 Metrô Centro - Camaragibe
 (1,1,1,0),(1,2,2,4),(1,3,3,8),(1,4,4,12),(1,5,5,20),(1,6,6,25),(1,7,7,33),(1,8,8,37),(1,9,9,45),
 -- 2 Metrô Centro - Jaboatão
 (2,1,1,0),(2,2,2,4),(2,3,3,8),(2,4,4,12),(2,5,5,20),(2,6,6,25),(2,7,10,45),
 -- 3 Metrô Sul
 (3,1,1,0),(3,2,2,4),(3,3,11,9),(3,4,12,14),(3,5,13,17),(3,6,14,20),(3,7,15,23),(3,8,16,26),(3,9,17,40),
 -- 4 BRT Norte-Sul
 (4,1,19,0),(4,2,20,18),(4,3,24,26),(4,4,2,38),
 -- 5 BRT Leste-Oeste
 (5,1,9,0),(5,2,18,20),(5,3,24,45),
 -- 6 Ônibus 2043
 (6,1,18,0),(6,2,23,3),(6,3,20,20),(6,4,2,35),
 -- 7 Ônibus 168
 (7,1,15,0),(7,2,22,15),(7,3,21,30),(7,4,20,40),
 -- 8 Ônibus 115
 (8,1,16,0),(8,2,12,8),(8,3,11,18),(8,4,3,30),
 -- 9 Integração 858
 (9,1,2,0),(9,2,3,8),(9,3,6,25);

-- Horários (metrô: encerramento às 22h conforme comunicados da CBTU de set/out 2026)
INSERT INTO horario_linha (id_linha, tipo_dia, hora_inicio, hora_fim, freq_pico_min, freq_normal_min) VALUES
 (1,'UTIL','05:00:00','22:00:00',12,20),  (1,'FIM_DE_SEMANA','05:00:00','22:00:00',20,25),
 
 (2,'UTIL','05:00:00','22:00:00',12,20),  (2,'FIM_DE_SEMANA','05:00:00','22:00:00',20,25),
 
 (3,'UTIL','05:00:00','22:00:00',10,15),  (3,'FIM_DE_SEMANA','05:00:00','22:00:00',15,20),
 
 (4,'UTIL','05:00:00','23:00:00',6,12),   (4,'FIM_DE_SEMANA','05:00:00','23:00:00',12,15),
 
 (5,'UTIL','05:00:00','23:00:00',6,12),   (5,'FIM_DE_SEMANA','05:00:00','23:00:00',12,15),
 
 (6,'UTIL','04:30:00','23:00:00',10,20),  (6,'FIM_DE_SEMANA','05:00:00','22:30:00',20,30),
 
 (7,'UTIL','04:30:00','23:00:00',10,20),  (7,'FIM_DE_SEMANA','05:00:00','22:30:00',20,30),
 
 (8,'UTIL','04:30:00','23:00:00',10,20),  (8,'FIM_DE_SEMANA','05:00:00','22:30:00',20,30),
 
 (9,'UTIL','22:00:00','05:00:00',15,20),  (9,'FIM_DE_SEMANA','22:00:00','05:00:00',15,20);

/* =====================================================================
   4. QUERIES DE TESTE (uso previsto pelo Back-End)
   ===================================================================== */

-- Q1. Linhas filtradas por modal ('BRT', 'Metrô', 'Ônibus', 'Integração')
SELECT l.codigo, l.nome AS linha, m.nome AS modal, o.nome AS operadora,
       t.nome AS tarifa, t.valor AS tarifa_rs,
       h.hora_inicio, h.hora_fim, h.freq_pico_min, h.freq_normal_min
FROM linha l
JOIN modal m ON m.id_modal = l.id_modal
JOIN operadora o ON o.id_operadora = l.id_operadora
JOIN tarifa t ON t.id_tarifa = l.id_tarifa
LEFT JOIN horario_linha h ON h.id_linha = l.id_linha AND h.tipo_dia = 'UTIL'
WHERE m.nome = 'BRT' AND l.ativa = TRUE
ORDER BY l.codigo;

-- Q2. Itinerário completo de uma linha, em ordem
SELECT it.ordem, p.nome AS ponto, p.tipo_ponto, p.bairro, p.logradouro_referencia,
       p.latitude, p.longitude, it.minutos_desde_origem,
       IF(p.integracao_sei, 'Sim', 'Não') AS integracao_sei
FROM linha l
JOIN itinerario it ON it.id_linha = l.id_linha
JOIN ponto p ON p.id_ponto  = it.id_ponto
WHERE l.codigo = 'MET-CENTRO-CAM'
ORDER BY it.ordem;

-- Q3. Busca origem -> destino: linhas que atendem os dois pontos (qualquer sentido)
SET @origem  = 'Estação Afogados';
SET @destino = 'Estação Barro';
-- Outro teste: SET @origem = 'Estação Aeroporto (TI Aeroporto)'; SET @destino = 'Estação Largo da Paz';

SELECT l.codigo, l.nome AS linha, m.nome AS modal, o.nome AS operadora,
       ABS(it_d.ordem - it_o.ordem) AS qtd_paradas,
       ABS(it_d.minutos_desde_origem - it_o.minutos_desde_origem) AS tempo_estimado_min,
       t.valor AS custo_rs,
       CASE WHEN it_d.ordem > it_o.ordem THEN 'Sentido ida' ELSE 'Sentido volta' END AS sentido
FROM ponto po
JOIN itinerario it_o ON it_o.id_ponto = po.id_ponto
JOIN itinerario it_d ON it_d.id_linha = it_o.id_linha AND it_d.id_ponto <> it_o.id_ponto
JOIN ponto pd        ON pd.id_ponto = it_d.id_ponto
JOIN linha l         ON l.id_linha = it_o.id_linha AND l.ativa = TRUE
JOIN modal m         ON m.id_modal = l.id_modal
JOIN operadora o     ON o.id_operadora = l.id_operadora
JOIN tarifa t        ON t.id_tarifa = l.id_tarifa
WHERE po.nome = @origem AND pd.nome = @destino
ORDER BY tempo_estimado_min, custo_rs;

-- Q4. Opções ordenadas por sustentabilidade (menor emissão), depois custo e tempo.
-- Distância = linha reta entre origem e destino (ST_Distance_Sphere, metros).
-- Para ordenar por MENOR CUSTO, troque o ORDER BY final por: custo_rs, tempo_min, emissao_g_co2
WITH opcoes AS (
  SELECT l.codigo, l.nome AS linha, m.nome AS modal, m.sustentavel,
         m.fator_emissao_g_pkm AS fator,
         t.valor AS custo_rs,
         ABS(it_d.minutos_desde_origem - it_o.minutos_desde_origem) AS tempo_min,
         ST_Distance_Sphere(POINT(po.longitude, po.latitude),
                            POINT(pd.longitude, pd.latitude)) / 1000 AS km_reta,
         (po.integracao_sei OR pd.integracao_sei) AS integra_sei
  FROM ponto po
  JOIN itinerario it_o ON it_o.id_ponto = po.id_ponto
  JOIN itinerario it_d ON it_d.id_linha = it_o.id_linha AND it_d.id_ponto <> it_o.id_ponto
  JOIN ponto pd ON pd.id_ponto = it_d.id_ponto
  JOIN linha l ON l.id_linha = it_o.id_linha AND l.ativa = TRUE
  JOIN modal m ON m.id_modal = l.id_modal
  JOIN tarifa t ON t.id_tarifa = l.id_tarifa
  WHERE po.nome = @origem AND pd.nome = @destino
)
SELECT codigo, linha, modal, custo_rs, tempo_min,
       ROUND(km_reta, 2)        AS distancia_km,
       ROUND(km_reta * fator, 1) AS emissao_g_co2,
       CASE WHEN sustentavel THEN 'Mais sustentável'
            WHEN integra_sei THEN 'Integrada (SEI)'
            ELSE 'Convencional' END AS destaque
FROM opcoes
ORDER BY emissao_g_co2, custo_rs, tempo_min;

SELECT * FROM modal;
SELECT * FROM operadora;
SELECT * FROM tarifa;

SELECT id_modal, nome FROM modal;

SELECT COUNT(*) FROM linha;        -- 9
SELECT COUNT(*) FROM ponto;        -- 24
SELECT COUNT(*) FROM itinerario;   -- 47

SELECT COUNT(*) FROM itinerario;      -- esperado: 47
SELECT COUNT(*) FROM horario_linha;   -- esperado: 18