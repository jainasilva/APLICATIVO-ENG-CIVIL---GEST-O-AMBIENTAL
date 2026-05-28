const STORAGE_KEY = "gestao_residuos_bracell_v1";
const THEME_STORAGE_KEY = "gestao_residuos_bracell_theme_v1";
const STORAGE_FALLBACK = new Map();
window.__APP_PRIMARY_READY = false;

const tiposResiduos = [
  "Cinzas (CAL) industriais",
  "Lodo biolÃ³gico",
  "Ã“leos lubrificantes",
  "ResÃ­duos quÃ­micos",
  "ResÃ­duos reciclÃ¡veis",
  "Biomassa",
  "Solo contaminado",
  "Absorventes e EPIs contaminados"
];

const registrosIniciais = [
  {
    id: "R-001",
    data: "2026-05-10",
    tipo: "Cinzas (CAL) industriais",
    classe: "Classe IIA",
    origem: "Caldeira de recuperaÃ§Ã£o",
    quantidade: 1280,
    destino: "Reaproveitamento energÃ©tico",
    status: "Destinado"
  },
  {
    id: "R-002",
    data: "2026-05-11",
    tipo: "Lodo biolÃ³gico",
    classe: "Classe IIA",
    origem: "ETE industrial",
    quantidade: 860,
    destino: "Coprocessamento",
    status: "Em transporte"
  },
  {
    id: "R-003",
    data: "2026-05-12",
    tipo: "Ã“leos lubrificantes",
    classe: "Classe I",
    origem: "ManutenÃ§Ã£o de equipamentos mÃ³veis",
    quantidade: 180,
    destino: "Tratamento externo especializado",
    status: "Aguardando coleta"
  },
  {
    id: "R-004",
    data: "2026-05-13",
    tipo: "ResÃ­duos quÃ­micos",
    classe: "Classe I",
    origem: "Ãrea de preparo quÃ­mico",
    quantidade: 95,
    destino: "Aterro industrial licenciado",
    status: "NÃ£o conformidade"
  },
  {
    id: "R-005",
    data: "2026-05-14",
    tipo: "ResÃ­duos reciclÃ¡veis",
    classe: "Classe IIB",
    origem: "Almoxarifado e escritÃ³rio",
    quantidade: 420,
    destino: "Reciclagem",
    status: "Destinado"
  }
];

const kpisBase = [
  { label: "ResÃ­duos para aterro (2025)", value: "33,1 kg/adt", meta: "Meta 2030: -90%" },
  { label: "RecuperaÃ§Ã£o quÃ­mica", value: "95,8%", meta: "Meta reportada: 97%" },
  { label: "Consumo de Ã¡gua (2025)", value: "19,9 mÂ³/adt", meta: "Meta 2030: 16,6 mÂ³/adt" },
  { label: "Energia renovÃ¡vel", value: "90%", meta: "Biomassa + licor negro + solar" },
  { label: "COâ‚‚ removido em 2025", value: "3,4 mi tCOâ‚‚e", meta: "Meta 2030: 25 mi tCOâ‚‚e" },
  { label: "Ãrea nativa conservada", value: "301 mil ha", meta: "Compromisso Um-Para-Um" }
];

const fluxoTratamento = [
  {
    etapa: "Tratamento de água bruta",
    detalhe: "Captação, gradeamento, filtração e condicionamento da água para uso industrial e potável."
  },
  {
    etapa: "Tratamento de efluentes industriais",
    detalhe: "Equalização, tratamento físico-químico, etapa biológica, decantação e controle operacional da ETE."
  },
  {
    etapa: "Reúso e recirculação",
    detalhe: "Aproveitamento de água tratada no processo produtivo para reduzir captação e descarte."
  },
  {
    etapa: "Monitoramento ambiental",
    detalhe: "Controle de parâmetros de qualidade, atendimento legal e rastreabilidade dos lançamentos."
  }
];

const planosAcao = [
  {
    titulo: "PRAD - ErosÃ£o HÃ­drica",
    subtitulo: "Slide 18 e 19",
    itens: [
      "Fase 1 (16/05 a 23/05): contenÃ§Ã£o emergencial com isolamento e desvio de Ã¡gua.",
      "Fase 2 (24/05 a 07/06): levantamento topogrÃ¡fico, ensaios de solo e projeto executivo.",
      "Fase 3 (08/06 a 20/07): curvas de nÃ­vel, canaletas, dissipadores e check dams.",
      "Fase 4/5 (21/07 a 12/11): revegetaÃ§Ã£o, biomanta e inspeÃ§Ãµes quinzenais.",
      "KPIs: cobertura vegetal >= 85% em 180 dias e reduÃ§Ã£o >= 80% de sedimentos."
    ]
  },
  {
    titulo: "Resposta a Vazamento de Ã“leo",
    subtitulo: "Slide 20 e 21",
    itens: [
      "D0-D1: interromper fonte, isolar Ã¡rea e conter com barreiras/absorventes.",
      "D1-D7: reparar equipamento e validar estanqueidade antes da liberaÃ§Ã£o.",
      "D7-D30: treinar equipes, checklist prÃ©-operaÃ§Ã£o e inspeÃ§Ãµes diÃ¡rias.",
      "Implantar kit de mitigaÃ§Ã£o obrigatÃ³rio e bacia de contenÃ§Ã£o secundÃ¡ria.",
      "Meta: 0 recorrÃªncia e 100% dos equipamentos crÃ­ticos com contenÃ§Ã£o disponÃ­vel."
    ]
  }
];

const relatorioRecuperacao = {
  area: "Talude de drenagem - Setor Florestal Leste",
  municipio: "LenÃ§Ã³is Paulista - SP",
  referencia: "18/05/2026",
  diagnostico: [
    "Processo erosivo em ravina com risco de evoluÃ§Ã£o para voÃ§oroca.",
    "ConcentraÃ§Ã£o de escoamento superficial por ausÃªncia de drenagem definitiva.",
    "Solo exposto com baixa cobertura vegetal e perda de horizonte superficial.",
    "Risco de carreamento de sedimentos para Ã¡rea de APP a jusante."
  ],
  metas: [
    "Estabilizar fisicamente 100% da feiÃ§Ã£o erosiva em atÃ© 90 dias.",
    "AlcanÃ§ar cobertura vegetal >= 85% em atÃ© 180 dias.",
    "Reduzir >= 80% do carreamento de sedimentos em eventos de chuva.",
    "Manter 100% de funcionalidade do sistema de drenagem implantado."
  ],
  cronograma: [
    {
      fase: "Fase 1 - ContenÃ§Ã£o emergencial",
      periodo: "16/05/2026 a 23/05/2026",
      escopo: "Isolamento de Ã¡rea, desvio temporÃ¡rio de Ã¡gua e barreiras de sedimento.",
      entregavel: "Ãrea estabilizada provisoriamente e risco imediato reduzido."
    },
    {
      fase: "Fase 2 - Projeto executivo",
      periodo: "24/05/2026 a 07/06/2026",
      escopo: "Levantamento topogrÃ¡fico, sondagem/ensaio e dimensionamento hidrÃ¡ulico.",
      entregavel: "Projeto tÃ©cnico validado e plano de obra aprovado."
    },
    {
      fase: "Fase 3 - Obras de recuperaÃ§Ã£o",
      periodo: "08/06/2026 a 20/07/2026",
      escopo: "Canaletas, dissipadores, terraceamento e proteÃ§Ã£o superficial do solo.",
      entregavel: "Drenagem definitiva implantada e erosÃ£o controlada."
    },
    {
      fase: "Fase 4 - RevegetaÃ§Ã£o e monitoramento",
      periodo: "21/07/2026 a 12/11/2026",
      escopo: "Hidrossemeadura/gramÃ­nea, biomanta e inspeÃ§Ãµes quinzenais.",
      entregavel: "Cobertura vegetal consolidada e relatÃ³rio de eficÃ¡cia."
    }
  ],
  acoes: [
    {
      acao: "Implantar drenagem superficial definitiva no trecho crÃ­tico.",
      responsavel: "Engenharia Ambiental + Civil",
      prazo: "20/07/2026",
      prioridade: "Alta",
      status: "Em andamento"
    },
    {
      acao: "Executar recomposiÃ§Ã£o de solo e proteÃ§Ã£o anti-erosiva com biomanta.",
      responsavel: "OperaÃ§Ã£o Florestal",
      prazo: "05/08/2026",
      prioridade: "Alta",
      status: "Planejada"
    },
    {
      acao: "Revegetar Ã¡rea degradada com espÃ©cies adaptadas e manutenÃ§Ã£o inicial.",
      responsavel: "Equipe de RestauraÃ§Ã£o",
      prazo: "30/08/2026",
      prioridade: "MÃ©dia",
      status: "Planejada"
    },
    {
      acao: "Realizar monitoramento e auditoria tÃ©cnica mensal por 6 meses.",
      responsavel: "SGA / Meio Ambiente",
      prazo: "12/11/2026",
      prioridade: "MÃ©dia",
      status: "Planejada"
    }
  ],
  monitoramento: [
    "InspeÃ§Ãµes quinzenais com checklist de estabilidade geotÃ©cnica.",
    "Levantamento fotogrÃ¡fico em pontos fixos para rastreabilidade.",
    "MediÃ§Ã£o de cobertura vegetal e taxa de sobrevivÃªncia das mudas.",
    "Controle de sedimentos em pontos de saÃ­da de drenagem.",
    "RelatÃ³rio tÃ©cnico mensal com aÃ§Ãµes corretivas e preventivas."
  ]
};

const statusClasses = {
  "Destinado": "ok",
  "Aguardando coleta": "warn",
  "Em transporte": "info",
  "Não conformidade": "alert",
  "NÃ£o conformidade": "alert",
  "Concluído": "ok",
  "Em andamento": "info",
  "Planejado": "warn"
};

const PALETA_DESTINO = ["#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#fdcb6e", "#e17055"];
const PALETA_STATUS = ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#8e44ad"];
const PALETA_CLASSE = ["#1abc9c", "#2980b9", "#9b59b6", "#f39c12", "#c0392b"];
const PALETA_PASSIVOS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b"];

const IMAGENS_SECOES = {
  dashboard: [
    ["slide01.png", "Slide 1 - ENGENHARIA & SUSTENTABILIDADE"],
    ["slide25.png", "Slide 25 - Biodiversidade e Paisagens Sustentáveis"]
  ],
  residuos: [
    ["slide05.png", "Slide 5 - Gestão de Resíduos Industriais"],
    ["slide06.png", "Slide 6 - Tratamento de Efluentes"]
  ],
  tratamento: [
    ["slide06.png", "Slide 6 - Tratamento de Efluentes"],
    ["slide07.png", "Slide 7 - Trator em manuseio de cal industrial"],
    ["slide08.png", "Slide 8 - Gestão de Agua / Efluentes / Resíduos - Dados 2025"]
  ],
  planos: [
    ["slide17.png", "Slide 17 - Passivo Ambiental Identificado"],
    ["slide18.png", "Slide 18 - Plano de Ação PRAD"],
    ["slide20.png", "Slide 20 - Plano de Ação / Cronograma - Passivos Ambientais"]
  ],
  relatorio: [
    ["slide17.png", "Slide 17 - Passivo Ambiental Identificado"],
    ["slide20.png", "Slide 20 - Plano de Ação / Cronograma - Passivos Ambientais"],
    ["slide20.png", "Slide 21 - Cronograma de Execução dos Passivos Ambientais"]
  ]
};

const FOTOS_FLUXO = [
  ["slide06.png", "Tratamento de água e efluentes"],
  ["slide06.png", "Estação de tratamento de efluentes"],
  ["slide08.png", "Indicadores de água, efluentes e resíduos"],
  ["slide08.png", "Monitoramento ambiental hídrico"]
];

const FOTOS_PLANOS = [
  ["slide17.png", "Slide 17 - Passivo Ambiental Identificado"],
  ["slide19.png", "Slide 19 - Acidente Ambiental - Vazamento de Óleo"]
];

const CRONOGRAMA_PASSIVOS = [
  {
    passivo: "Erosão / voçoroca",
    fase: "Diagnóstico",
    acao_principal: "Levantamento de campo, topografia e delimitação da área crítica.",
    objetivo_tecnico: "Definir causa raiz e escopo de intervenção do PRAD.",
    inicio: "2026-06-01",
    fim: "2026-06-15",
    prazo_dias: 15,
    prioridade: "Alta",
    status: "Concluído",
    responsavel: "Engenharia Ambiental"
  },
  {
    passivo: "Erosão / voçoroca",
    fase: "Contenção imediata",
    acao_principal: "Isolamento da área, desvio de água e barreiras de sedimento.",
    objetivo_tecnico: "Evitar evolução da feição erosiva durante o período chuvoso.",
    inicio: "2026-06-16",
    fim: "2026-07-05",
    prazo_dias: 20,
    prioridade: "Alta",
    status: "Concluído",
    responsavel: "Operação Florestal"
  },
  {
    passivo: "Erosão / voçoroca",
    fase: "Execução corretiva",
    acao_principal: "Implantação de drenagem, dissipadores e recomposição de solo.",
    objetivo_tecnico: "Estabilizar taludes e reduzir carreamento de sedimentos.",
    inicio: "2026-07-06",
    fim: "2026-08-19",
    prazo_dias: 45,
    prioridade: "Alta",
    status: "Em andamento",
    responsavel: "Infraestrutura + Meio Ambiente"
  },
  {
    passivo: "Erosão / voçoroca",
    fase: "Recuperação ambiental / PRAD",
    acao_principal: "Revegetação com espécies nativas e biomanta.",
    objetivo_tecnico: "Restabelecer cobertura vegetal funcional da área afetada.",
    inicio: "2026-08-20",
    fim: "2026-09-18",
    prazo_dias: 30,
    prioridade: "Média",
    status: "Planejado",
    responsavel: "Equipe de Restauração"
  },
  {
    passivo: "Erosão / voçoroca",
    fase: "Monitoramento",
    acao_principal: "Inspeções e medição de cobertura vegetal e estabilidade.",
    objetivo_tecnico: "Comprovar eficiência do PRAD e evitar recidiva.",
    inicio: "2026-09-19",
    fim: "2027-03-17",
    prazo_dias: 180,
    prioridade: "Média",
    status: "Planejado",
    responsavel: "SGA / Meio Ambiente"
  },
  {
    passivo: "Vazamento de óleo",
    fase: "Diagnóstico",
    acao_principal: "Avaliação da origem do vazamento e área impactada.",
    objetivo_tecnico: "Definir a severidade e o plano de resposta inicial.",
    inicio: "2026-06-01",
    fim: "2026-06-03",
    prazo_dias: 3,
    prioridade: "Alta",
    status: "Concluído",
    responsavel: "SSMA + Manutenção"
  },
  {
    passivo: "Vazamento de óleo",
    fase: "Contenção imediata",
    acao_principal: "Conter derrame com barreiras e absorventes.",
    objetivo_tecnico: "Eliminar risco de infiltração e carreamento para drenagem.",
    inicio: "2026-06-04",
    fim: "2026-06-05",
    prazo_dias: 2,
    prioridade: "Alta",
    status: "Concluído",
    responsavel: "SSMA + Operação"
  },
  {
    passivo: "Vazamento de óleo",
    fase: "Execução corretiva",
    acao_principal: "Reparo do equipamento e remoção de solo contaminado.",
    objetivo_tecnico: "Restabelecer condição segura de operação.",
    inicio: "2026-06-06",
    fim: "2026-06-17",
    prazo_dias: 12,
    prioridade: "Alta",
    status: "Concluído",
    responsavel: "Manutenção"
  },
  {
    passivo: "Vazamento de óleo",
    fase: "Recuperação ambiental / PRAD",
    acao_principal: "Destinação de resíduos Classe I e limpeza final da área.",
    objetivo_tecnico: "Garantir conformidade legal e encerramento da ocorrência.",
    inicio: "2026-06-18",
    fim: "2026-07-07",
    prazo_dias: 20,
    prioridade: "Média",
    status: "Concluído",
    responsavel: "Gestão de Resíduos"
  },
  {
    passivo: "Vazamento de óleo",
    fase: "Monitoramento",
    acao_principal: "Inspeções em campo e auditoria de contenção secundária.",
    objetivo_tecnico: "Assegurar 0 recorrência e lições aprendidas implementadas.",
    inicio: "2026-07-08",
    fim: "2026-10-05",
    prazo_dias: 90,
    prioridade: "Média",
    status: "Em andamento",
    responsavel: "SSMA"
  }
];

const RELATORIO_PRAD_BASE = {
  empresa: "Empresa não informada",
  empreendimento: "Unidade Industrial",
  localizacao: "Município/UF",
  responsavel: "Responsável técnico",
  prazo_meses: 18,
  area_total_ha: 14.2,
  area_recuperacao_ha: 9.8,
  cobertura_vegetal_pct: 68,
  meta_sobrevivencia_pct: 85,
  diagnostico: [
    "Presença de processos erosivos lineares em trechos de talude.",
    "Compactação superficial em acessos operacionais desativados.",
    "Necessidade de reforço na drenagem e no controle de sedimentos."
  ],
  metas: [
    "Estabilizar 100% dos focos erosivos prioritários em até 6 meses.",
    "Restabelecer cobertura vegetal em no mínimo 90% da área crítica.",
    "Reduzir em 80% o carreamento de sedimentos para drenagens adjacentes."
  ],
  acoes: [
    ["Reconformação de taludes", "Engenharia ambiental", "Alta", "Em andamento"],
    ["Implantação de canaletas e dissipadores", "Infraestrutura", "Alta", "Planejada"],
    ["Plantio de espécies nativas", "Equipe florestal", "Média", "Em andamento"],
    ["Monitoramento semestral de solo e água", "Laboratório", "Média", "Planejada"]
  ],
  observacoes:
    "Incluir evidências fotográficas, ART e cronograma executivo detalhado na versão final."
};

const form = document.getElementById("residue-form");
const formTitle = document.getElementById("form-title");
const inputId = document.getElementById("registro-id");
const inputData = document.getElementById("data");
const inputTipo = document.getElementById("tipo");
const inputClasse = document.getElementById("classe");
const inputOrigem = document.getElementById("origem");
const inputQuantidade = document.getElementById("quantidade");
const inputDestino = document.getElementById("destino");
const inputStatus = document.getElementById("status");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search");
const filtroStatus = document.getElementById("filtro-status");
const residueFilterToggle = document.getElementById("residue-filter-toggle");
const residueFilterPanel = document.getElementById("residue-filter-panel");
const tableBody = document.getElementById("residue-table-body");
const slideSearchInput = document.getElementById("slide-search");
const themeLightBtn = document.getElementById("theme-light");
const themeDarkBtn = document.getElementById("theme-dark");
const navLinks = [...document.querySelectorAll("[data-page-link]")];
const appPages = [...document.querySelectorAll(".app-page")];
const backToTopBtn = document.getElementById("back-to-top");

const kpiGrid = document.getElementById("kpi-grid");
const statusBars = document.getElementById("status-bars");
const destinoList = document.getElementById("destino-list");
const resumoOperacional = document.getElementById("resumo-operacional");
const chartDestino = document.getElementById("chart-destino");
const chartDestinoLegend = document.getElementById("chart-destino-legend");
const chartStatus = document.getElementById("chart-status");
const chartStatusLegend = document.getElementById("chart-status-legend");
const chartClasseBar = document.getElementById("chart-classe-bar");
const chartClasseLegend = document.getElementById("chart-classe-legend");
const tendenciaMensal = document.getElementById("tendencia-mensal");
const comparativoMensal = document.getElementById("comparativo-mensal");
const classeBars = document.getElementById("classe-bars");
const eficienciaList = document.getElementById("eficiencia-list");
const origemList = document.getElementById("origem-list");
const relatorioIndicadores = document.getElementById("relatorio-indicadores");
const relatorioDiagnostico = document.getElementById("relatorio-diagnostico");
const relatorioMetas = document.getElementById("relatorio-metas");
const relatorioCronograma = document.getElementById("relatorio-cronograma");
const relatorioAcoes = document.getElementById("relatorio-acoes");
const relatorioMonitoramento = document.getElementById("relatorio-monitoramento");
const fluxoList = document.getElementById("fluxo-list");
const planosList = document.getElementById("planos-list");
const slidesGrid = document.getElementById("slides-grid");
const footer = document.querySelector("footer");
const dashboardImages = document.getElementById("dashboard-images");
const residuosImages = document.getElementById("residuos-images");
const tratamentoImages = document.getElementById("tratamento-images");
const planosImages = document.getElementById("planos-images");
const relatorioImages = document.getElementById("relatorio-images");
const dashboardTiposResiduos = document.getElementById("dashboard-tipos-residuos");
const residuosTiposResiduos = document.getElementById("residuos-tipos-residuos");
const cronogramaPassivosBody = document.getElementById("cronograma-passivos-body");
const cronogramaFaseBars = document.getElementById("cronograma-fase-bars");
const cronogramaMonitoramentoChart = document.getElementById("cronograma-monitoramento-chart");
const cronogramaMonitoramentoLegend = document.getElementById("cronograma-monitoramento-legend");
const pradEmpresa = document.getElementById("prad-empresa");
const pradEmpreendimento = document.getElementById("prad-empreendimento");
const pradLocalizacao = document.getElementById("prad-localizacao");
const pradResponsavel = document.getElementById("prad-responsavel");
const pradDataVistoria = document.getElementById("prad-data-vistoria");
const pradPrazoMeses = document.getElementById("prad-prazo-meses");
const pradAreaTotal = document.getElementById("prad-area-total");
const pradAreaRecuperacao = document.getElementById("prad-area-recuperacao");
const pradCoberturaVegetal = document.getElementById("prad-cobertura-vegetal");
const pradMetaSobrevivencia = document.getElementById("prad-meta-sobrevivencia");
const pradDiagnosticoTexto = document.getElementById("prad-diagnostico-texto");
const pradMetasTexto = document.getElementById("prad-metas-texto");
const pradAcoesEditBody = document.getElementById("prad-acoes-edit-body");
const pradObservacoes = document.getElementById("prad-observacoes");
const pradPreview = document.getElementById("prad-preview");
const downloadPradMd = document.getElementById("download-prad-md");
const downloadPradTxt = document.getElementById("download-prad-txt");
const downloadPradXlsx = document.getElementById("download-prad-xlsx");

let registros = loadRegistros();
let termoSlide = "";

if (registros.length === 0) {
  registros = registrosIniciais
    .map((item, index) => normalizarRegistroCarregado(item, index))
    .filter(Boolean);
  saveRegistros();
}

const slides = (window.SLIDES_DATA || [])
  .map((slide) => ({
    ...slide,
    title: normalizarTexto(slide.title || ""),
    texts: (slide.texts || []).map((t) => normalizarTexto(t)).filter(Boolean)
  }))
  .map((slide) => {
    if (Number(slide.slide) !== 9) {
      return slide;
    }

    return {
      ...slide,
      title: "Captação Hídrica para Apoio às Operações Florestais",
      texts: [
        "Captação Hídrica para Apoio às Operações Florestais",
        "Quando não há ponto de captação regularizado, é aberto processo de regularização ambiental.",
        "Fluxo regulatório (SP):",
        "• Solicitação de Outorga: Protocolo oficial de uso de recursos hídricos junto ao órgão outorgante estadual (DAEE/SP Águas)",
        "• Exigências Ambientais: Atendimento integral das exigências ambientais complementares aplicáveis, com interface direta junto à CETESB.",
        "• Aprovação e Emissão: Análise técnica final e emissão do ato autorizativo (Portaria de Outorga) para a implantação física do ponto.",
        "Prazo médio de análise:",
        "• Entre 3 e 6 meses, conforme disponibilidade hídrica e complexidade do processo."
      ]
    };
  });

iniciar();

function iniciar() {
  if (!form || !tableBody || !inputTipo) {
    return;
  }

  executarComSeguranca(aplicarTemaSalvo);
  executarComSeguranca(preencherTiposResiduos);
  executarComSeguranca(preencherDataHoje);

  form.addEventListener("submit", salvarRegistro);
  if (cancelBtn) {
    cancelBtn.addEventListener("click", cancelarEdicao);
  }
  if (searchInput) {
    searchInput.addEventListener("input", () => executarComSeguranca(renderTabela));
  }
  if (filtroStatus) {
    filtroStatus.addEventListener("change", () => executarComSeguranca(renderTabela));
  }
  if (residueFilterToggle && residueFilterPanel) {
    residueFilterToggle.addEventListener("click", alternarFiltroResiduos);
  }
  if (themeLightBtn) {
    themeLightBtn.addEventListener("click", () => definirTema("light"));
  }
  if (themeDarkBtn) {
    themeDarkBtn.addEventListener("click", () => definirTema("dark"));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      abrirPagina(link.dataset.pageLink || "dashboard", true);
    });
    link.addEventListener("keydown", navegarAbasPeloTeclado);
  });
  window.addEventListener("hashchange", () => abrirPagina(paginaAtualPeloHash(), false));
  window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  if (slideSearchInput) {
    slideSearchInput.addEventListener("input", (event) => {
      termoSlide = event.target.value.trim().toLowerCase();
      executarComSeguranca(renderSlides);
    });
  }

  if (inputClasse) {
    inputClasse.addEventListener("change", () => {
      executarComSeguranca(() => preencherTiposResiduosPorClasse(inputClasse.value));
    });
  }

  if (pradAcoesEditBody) {
    pradAcoesEditBody.addEventListener("input", () => executarComSeguranca(atualizarPreviewPrad));
  }

  [
    pradEmpresa,
    pradEmpreendimento,
    pradLocalizacao,
    pradResponsavel,
    pradDataVistoria,
    pradPrazoMeses,
    pradAreaTotal,
    pradAreaRecuperacao,
    pradCoberturaVegetal,
    pradMetaSobrevivencia,
    pradDiagnosticoTexto,
    pradMetasTexto,
    pradObservacoes
  ].forEach((campo) => {
    if (campo) {
      campo.addEventListener("input", () => executarComSeguranca(atualizarPreviewPrad));
      campo.addEventListener("change", () => executarComSeguranca(atualizarPreviewPrad));
    }
  });

  if (downloadPradMd) {
    downloadPradMd.addEventListener("click", () => executarComSeguranca(() => baixarRelatorioPrad("md")));
  }
  if (downloadPradTxt) {
    downloadPradTxt.addEventListener("click", () => executarComSeguranca(() => baixarRelatorioPrad("txt")));
  }
  if (downloadPradXlsx) {
    downloadPradXlsx.addEventListener("click", () => executarComSeguranca(() => baixarRelatorioPrad("xlsx")));
  }

  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const id = target.dataset.id;
    const action = target.dataset.action;

    if (!id || !action) {
      return;
    }

    if (action === "edit") {
      editarRegistro(id);
    }

    if (action === "delete") {
      excluirRegistro(id);
    }
  });

  renderizarTudo();
  abrirPagina(paginaAtualPeloHash(), false);
  atualizarBotaoTopo();
  mostrarAviso("Aplicativo carregado.");
  window.__APP_PRIMARY_READY = true;
}

function alternarFiltroResiduos() {
  if (!residueFilterToggle || !residueFilterPanel) {
    return;
  }

  const abrir = residueFilterPanel.hidden;
  residueFilterPanel.hidden = !abrir;
  residueFilterToggle.classList.toggle("is-open", abrir);
  residueFilterToggle.setAttribute("aria-expanded", abrir ? "true" : "false");
  residueFilterToggle.textContent = abrir ? "Ocultar filtros" : "Filtros";

  if (abrir && searchInput) {
    searchInput.focus();
  }
}
function renderizarTudo() {
  executarComSeguranca(renderMosaicosSecoes);
  executarComSeguranca(renderListasTiposResiduos);
  executarComSeguranca(renderFluxo);
  executarComSeguranca(renderPlanosAcao);
  executarComSeguranca(renderCronogramaPassivos);
  executarComSeguranca(renderRelatorioRecuperacao);
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);
  executarComSeguranca(renderSlides);
  executarComSeguranca(inicializarGeradorPrad);
  executarComSeguranca(atualizarPreviewPrad);
}

function executarComSeguranca(fn) {
  try {
    fn();
  } catch (erro) {
    if (window.console && console.error) {
      console.error("Falha na execução:", fn.name, erro);
    }
    mostrarAviso(`Falha ao executar ${fn.name}. Recarregue a página.`);
  }
}

function preencherTiposResiduos() {
  preencherTiposResiduosPorClasse(inputClasse ? inputClasse.value : "Classe I");
}

function preencherTiposResiduosPorClasse(classe) {
  if (!inputTipo) {
    return;
  }

  const classeSelecionada = classe && tiposResiduosPorClasse[classe] ? classe : "Classe I";
  if (inputClasse) {
    inputClasse.value = classeSelecionada;
  }

  const lista = tiposResiduosPorClasse[classeSelecionada] || tiposResiduos;
  const tipoAtual = inputTipo.value;

  inputTipo.innerHTML = "";
  lista.forEach((tipo) => {
    const option = document.createElement("option");
    option.value = tipo;
    option.textContent = tipo;
    inputTipo.append(option);
  });

  if (lista.includes(tipoAtual)) {
    inputTipo.value = tipoAtual;
  }
}

function preencherDataHoje() {
  const hoje = new Date();
  const iso = hoje.toISOString().slice(0, 10);
  inputData.value = iso;
}

function aplicarTemaSalvo() {
  const salvo = storageGet(THEME_STORAGE_KEY);
  const prefereEscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const tema = salvo === "dark" || salvo === "light" ? salvo : (prefereEscuro ? "dark" : "light");
  definirTema(tema);
}

function definirTema(tema) {
  document.body.dataset.theme = tema;
  storageSet(THEME_STORAGE_KEY, tema);
if (themeLightBtn) {
    themeLightBtn.classList.toggle("is-active", tema === "light");
    themeLightBtn.setAttribute("aria-pressed", tema === "light" ? "true" : "false");
  }
  if (themeDarkBtn) {
    themeDarkBtn.classList.toggle("is-active", tema === "dark");
    themeDarkBtn.setAttribute("aria-pressed", tema === "dark" ? "true" : "false");
  }
}

function paginaAtualPeloHash() {
  const pagina = String(window.location.hash || "#dashboard").replace("#", "");
  return navLinks.some((link) => link.dataset.pageLink === pagina) ? pagina : "dashboard";
}

function abrirPagina(pagina, atualizarHash) {
  const paginaSegura = navLinks.some((link) => link.dataset.pageLink === pagina) ? pagina : "dashboard";

  appPages.forEach((page) => {
    const ativa = page.dataset.page === paginaSegura;
    page.hidden = !ativa;
    page.classList.toggle("is-active-page", ativa);
  });

  navLinks.forEach((link) => {
    const ativa = link.dataset.pageLink === paginaSegura;
    link.classList.toggle("is-active", ativa);
    link.setAttribute("aria-current", ativa ? "page" : "false");
    link.setAttribute("aria-selected", ativa ? "true" : "false");
    link.setAttribute("tabindex", ativa ? "0" : "-1");
  });

  if (atualizarHash && window.location.hash !== `#${paginaSegura}`) {
    history.pushState(null, "", `#${paginaSegura}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navegarAbasPeloTeclado(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const indiceAtual = navLinks.indexOf(event.currentTarget);
  let proximoIndice = indiceAtual;

  if (event.key === "ArrowRight") {
    proximoIndice = (indiceAtual + 1) % navLinks.length;
  }
  if (event.key === "ArrowLeft") {
    proximoIndice = (indiceAtual - 1 + navLinks.length) % navLinks.length;
  }
  if (event.key === "Home") {
    proximoIndice = 0;
  }
  if (event.key === "End") {
    proximoIndice = navLinks.length - 1;
  }

  const proximaAba = navLinks[proximoIndice];
  if (proximaAba) {
    proximaAba.focus();
    abrirPagina(proximaAba.dataset.pageLink || "dashboard", true);
  }
}

function atualizarBotaoTopo() {
  if (!backToTopBtn) {
    return;
  }
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 260);
}
function salvarRegistro(event) {
  event.preventDefault();
  const quantidade = parseQuantidade(inputQuantidade.value);

  const registro = {
    id: inputId.value || `R-${Date.now()}`,
    data: inputData.value,
    tipo: normalizarTexto(inputTipo.value),
    classe: normalizarTexto(inputClasse.value),
    origem: normalizarTexto(inputOrigem.value.trim()),
    quantidade,
    destino: normalizarTexto(inputDestino.value),
    status: normalizarTexto(inputStatus.value)
  };

  if (!registro.data || !registro.origem || !Number.isFinite(registro.quantidade)) {
    return;
  }

  if (inputId.value) {
    registros = registros.map((item) => (item.id === registro.id ? registro : item));
  } else {
    registros.unshift(registro);
  }

  saveRegistros();
  resetForm();
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);
  executarComSeguranca(renderRelatorioRecuperacao);
  executarComSeguranca(atualizarPreviewPrad);
  mostrarAviso("Registro salvo com sucesso.");
}

function editarRegistro(id) {
  const registro = registros.find((item) => item.id === id);
  if (!registro) {
    return;
  }

  inputId.value = registro.id;
  inputData.value = registro.data;
  preencherTiposResiduosPorClasse(registro.classe);
  if (inputTipo) {
    inputTipo.value = registro.tipo;
  }
  inputOrigem.value = registro.origem;
  inputQuantidade.value = String(registro.quantidade);
  inputDestino.value = registro.destino;
  inputStatus.value = registro.status;

  formTitle.textContent = "Editar Registro";
  cancelBtn.hidden = false;
  abrirPagina("residuos", true);
}

function excluirRegistro(id) {
  const confirmado = window.confirm("Deseja remover este registro?");
  if (!confirmado) {
    return;
  }

  registros = registros.filter((item) => item.id !== id);
  saveRegistros();
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);
  executarComSeguranca(renderRelatorioRecuperacao);
  executarComSeguranca(atualizarPreviewPrad);

  if (inputId.value === id) {
    resetForm();
  }
}

function cancelarEdicao() {
  resetForm();
}

function resetForm() {
  form.reset();
  inputId.value = "";
  formTitle.textContent = "Novo Registro";
  cancelBtn.hidden = true;
  preencherDataHoje();
  preencherTiposResiduosPorClasse("Classe I");
  inputDestino.value = "Reciclagem";
  inputStatus.value = "Aguardando coleta";
}

function renderTabela() {
  if (!tableBody || !searchInput || !filtroStatus) {
    return;
  }

  const termo = searchInput.value.trim().toLowerCase();
  const statusFiltro = filtroStatus.value;

  const filtrados = registros.filter((item) => {
    const textoComposto = `${item.tipo} ${item.origem} ${item.destino}`.toLowerCase();
    const passaTexto = termo === "" || textoComposto.includes(termo);
    const passaStatus = statusFiltro === "" || item.status === statusFiltro;
    return passaTexto && passaStatus;
  });

  if (filtrados.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8"><div class="empty">Nenhum registro encontrado para o filtro atual.</div></td></tr>`;
    return;
  }

  tableBody.innerHTML = filtrados
    .map((item) => {
      const classeStatus = statusClasses[item.status] || "info";
      return `
        <tr>
          <td>${formatarData(item.data)}</td>
          <td>${escapeHtml(normalizarTexto(item.tipo))}</td>
          <td>${escapeHtml(normalizarTexto(item.classe))}</td>
          <td>${escapeHtml(normalizarTexto(item.origem))}</td>
          <td>${formatarNumero(item.quantidade)}</td>
          <td>${escapeHtml(normalizarTexto(item.destino))}</td>
          <td><span class="tag ${classeStatus}">${escapeHtml(normalizarTexto(item.status))}</span></td>
          <td>
            <button class="btn small" data-action="edit" data-id="${item.id}">Editar</button>
            <button class="btn small danger" data-action="delete" data-id="${item.id}">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDashboard() {
  if (!kpiGrid || !statusBars || !destinoList || !resumoOperacional) {
    return;
  }

  const totalKg = registros.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const destinados = registros.filter((item) => item.status === "Destinado").length;
  const taxaDestinacao = registros.length > 0 ? (destinados / registros.length) * 100 : 0;
  const kgValorizado = registros.reduce((acc, item) => {
    return isDestinoValorizacao(item.destino) ? acc + Number(item.quantidade || 0) : acc;
  }, 0);
  const taxaValorizacao = totalKg > 0 ? (kgValorizado / totalKg) * 100 : 0;
  const kgAterro = registros
    .filter((item) => item.destino === "Aterro industrial licenciado")
    .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const taxaAterro = totalKg > 0 ? (kgAterro / totalKg) * 100 : 0;

  const kpis = [
    ...kpisBase,
    {
      label: "Total cadastrado no app",
      value: `${formatarNumero(totalKg)} kg`,
      meta: `${registros.length} registros ativos`
    },
    {
      label: "Taxa de registros destinados",
      value: `${formatarNumero(taxaDestinacao)}%`,
      meta: "Status Destinado / total"
    },
    {
      label: "Taxa de valorizaÃ§Ã£o",
      value: `${formatarNumero(taxaValorizacao)}%`,
      meta: "Reciclagem + coprocessamento + reaproveitamento"
    },
    {
      label: "Envio para aterro",
      value: `${formatarNumero(kgAterro)} kg`,
      meta: `${formatarNumero(taxaAterro)}% do total`
    }
  ];

  kpiGrid.innerHTML = kpis
    .map(
      (kpi) => `
      <article class="kpi">
        <div class="label">${escapeHtml(normalizarTexto(kpi.label))}</div>
        <div class="value">${escapeHtml(normalizarTexto(kpi.value))}</div>
        <div class="meta">${escapeHtml(normalizarTexto(kpi.meta))}</div>
      </article>
    `
    )
    .join("");

  const statusCount = contarPorCampo(registros, "status");
  const totalStatus = objectValues(statusCount).reduce((acc, n) => acc + n, 0);

  if (totalStatus === 0) {
    statusBars.innerHTML = `<div class="empty">Sem dados de status.</div>`;
  } else {
    const maxStatus = Math.max(...objectValues(statusCount), 1);
    statusBars.innerHTML = objectEntries(statusCount)
      .map(([status, valor]) => {
        const pct = (valor / maxStatus) * 100;
        return `
          <div class="bar-item">
            <span>${escapeHtml(status)} (${valor})</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
          </div>
        `;
      })
      .join("");
  }

  const destinoCount = contarPorCampo(registros, "destino", "quantidade");
  const destinosOrdenados = objectEntries(destinoCount).sort((a, b) => b[1] - a[1]);

  destinoList.innerHTML =
    destinosOrdenados.length === 0
      ? `<div class="empty">Sem dados de destinação.</div>`
      : destinosOrdenados
          .map(([destino, quantidade]) => `<div class="list-item">${escapeHtml(destino)}: <strong>${formatarNumero(quantidade)} kg</strong></div>`)
          .join("");

  const classeI = registros.filter((item) => item.classe === "Classe I").length;
  const naoConformes = registros.filter((item) => isNaoConformidade(item.status)).length;
  const conformidade = registros.length > 0 ? ((registros.length - naoConformes) / registros.length) * 100 : 0;
  const mediaKg = totalKg / Math.max(registros.length, 1);

  resumoOperacional.innerHTML = `
    <li>Registros Classe I (perigosos): <strong>${classeI}</strong></li>
    <li>Não conformidades ativas: <strong>${naoConformes}</strong></li>
    <li>Índice de conformidade: <strong>${formatarNumero(conformidade)}%</strong></li>
    <li>Média por registro: <strong>${formatarNumero(mediaKg)} kg</strong></li>
    <li>Objetivo operacional: reduzir envio para aterro e ampliar reaproveitamento.</li>
  `;

  const dadosDestino = destinosOrdenados.filter(([, quantidade]) => Number(quantidade) > 0);
  const dadosStatus = objectEntries(statusCount).filter(([, quantidade]) => Number(quantidade) > 0);
  const dadosClasse = objectEntries(contarPorCampo(registros, "classe", "quantidade"))
    .filter(([, quantidade]) => Number(quantidade) > 0)
    .sort((a, b) => b[1] - a[1]);

  renderGraficoRosca(chartDestino, chartDestinoLegend, dadosDestino, PALETA_DESTINO, "kg");
  renderGraficoRosca(chartStatus, chartStatusLegend, dadosStatus, PALETA_STATUS, "reg");
  renderBarraEmpilhada(chartClasseBar, chartClasseLegend, dadosClasse, PALETA_CLASSE, "kg");

  if (classeBars) {
    const classeCount = contarPorCampo(registros, "classe", "quantidade");
    const entradasClasse = objectEntries(classeCount);
    if (entradasClasse.length === 0) {
      classeBars.innerHTML = `<div class="empty">Sem dados de classe.</div>`;
    } else {
      const maxClasse = Math.max(...objectValues(classeCount), 1);
      classeBars.innerHTML = entradasClasse
        .map(([classe, kg]) => {
          const pct = (kg / maxClasse) * 100;
          return `
            <div class="bar-item">
              <span>${escapeHtml(classe)} (${formatarNumero(kg)} kg)</span>
              <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
            </div>
          `;
        })
        .join("");
    }
  }

  if (tendenciaMensal) {
    const serieMensal = agruparKgPorMes(registros);
    if (serieMensal.length === 0) {
      tendenciaMensal.innerHTML = `<div class="empty">Sem histórico mensal para exibir.</div>`;
    } else {
      const maxMes = Math.max(...serieMensal.map(([, kg]) => kg), 1);
      tendenciaMensal.innerHTML = serieMensal
        .map(([mes, kg]) => {
          const pct = (kg / maxMes) * 100;
          return `
            <div class="trend-item">
              <span>${escapeHtml(formatarMesAno(mes))}</span>
              <div class="trend-track">
                <div class="trend-fill" style="width:${pct.toFixed(1)}%"></div>
              </div>
              <strong>${formatarNumero(kg)} kg</strong>
            </div>
          `;
        })
        .join("");
    }
  }

  if (comparativoMensal) {
    const comparativo = agruparValorizacaoAterroPorMes(registros);
    if (comparativo.length === 0) {
      comparativoMensal.innerHTML = `<div class="empty">Sem histórico mensal para comparação.</div>`;
    } else {
      const maxComparativo = Math.max(...comparativo.map((item) => Math.max(item.valorizacao, item.aterro)), 1);
      comparativoMensal.innerHTML = comparativo
        .map((item) => {
          const pctValorizacao = (item.valorizacao / maxComparativo) * 100;
          const pctAterro = (item.aterro / maxComparativo) * 100;
          return `
            <div class="compare-item">
              <span>${escapeHtml(formatarMesAno(item.mes))}</span>
              <div class="compare-bars">
                <div class="compare-track"><div class="compare-fill valor" style="width:${pctValorizacao.toFixed(1)}%"></div></div>
                <div class="compare-track"><div class="compare-fill aterro" style="width:${pctAterro.toFixed(1)}%"></div></div>
              </div>
              <strong>V ${formatarNumero(item.valorizacao)} | A ${formatarNumero(item.aterro)} kg</strong>
            </div>
          `;
        })
        .join("");
    }
  }

  if (eficienciaList) {
    const aguardando = registros.filter((item) => item.status === "Aguardando coleta").length;
    const transporte = registros.filter((item) => item.status === "Em transporte").length;
    eficienciaList.innerHTML = `
      <li>Valorização do volume: <strong>${formatarNumero(taxaValorizacao)}%</strong></li>
      <li>Volume em aterro: <strong>${formatarNumero(kgAterro)} kg</strong></li>
      <li>Registros aguardando coleta: <strong>${aguardando}</strong></li>
      <li>Registros em transporte: <strong>${transporte}</strong></li>
    `;
  }

  if (origemList) {
    const origens = objectEntries(contarPorCampo(registros, "origem", "quantidade"))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    origemList.innerHTML =
      origens.length === 0
        ? `<div class="empty">Sem dados de origem.</div>`
        : origens
            .map(([origem, kg]) => `<div class="list-item">${escapeHtml(origem)}: <strong>${formatarNumero(kg)} kg</strong></div>`)
            .join("");
  }
}

function renderFluxo() {
  if (!fluxoList) {
    return;
  }

  fluxoList.innerHTML = fluxoTratamento
    .map(
      (item, idx) => {
        const foto = FOTOS_FLUXO[idx] || FOTOS_FLUXO[FOTOS_FLUXO.length - 1];
        return `
      <article class="timeline-step">
        <img class="item-photo" src="assets/images/${encodeURI(foto[0])}" alt="${escapeHtml(foto[1])}" loading="lazy" />
        <strong>${escapeHtml(normalizarTexto(item.etapa))}</strong>
        <p>${escapeHtml(normalizarTexto(item.detalhe))}</p>
      </article>
    `;
      }
    )
    .join("");
}

function renderPlanosAcao() {
  if (!planosList) {
    return;
  }

  planosList.innerHTML = planosAcao
    .map(
      (plano, idx) => {
        const foto = FOTOS_PLANOS[idx] || FOTOS_PLANOS[FOTOS_PLANOS.length - 1];
        return `
      <article class="plano">
        <img class="item-photo" src="assets/images/${encodeURI(foto[0])}" alt="${escapeHtml(foto[1])}" loading="lazy" />
        <h3>${escapeHtml(normalizarTexto(plano.titulo))}</h3>
        <p class="subtitle">${escapeHtml(normalizarTexto(plano.subtitulo))}</p>
        <ul>
          ${plano.itens.map((item) => `<li>${escapeHtml(normalizarTexto(item))}</li>`).join("")}
        </ul>
      </article>
    `;
      }
    )
    .join("");
}

function renderMosaicosSecoes() {
  renderMosaicoContainer(dashboardImages, IMAGENS_SECOES.dashboard);
  renderMosaicoContainer(residuosImages, IMAGENS_SECOES.residuos);
  renderMosaicoContainer(tratamentoImages, IMAGENS_SECOES.tratamento);
  renderMosaicoContainer(planosImages, IMAGENS_SECOES.planos);
  renderMosaicoContainer(relatorioImages, IMAGENS_SECOES.relatorio);
}

function renderMosaicoContainer(container, listaImagens) {
  if (!container) {
    return;
  }

  if (!Array.isArray(listaImagens) || listaImagens.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = listaImagens
    .map(
      ([arquivo, legenda]) => `
      <figure class="image-mosaic-item">
        <img src="assets/images/${encodeURI(arquivo)}" alt="${escapeHtml(legenda)}" loading="lazy" />
        <figcaption>${escapeHtml(legenda)}</figcaption>
      </figure>
    `
    )
    .join("");
}

function renderListasTiposResiduos() {
  renderListaTiposContainer(dashboardTiposResiduos, "Dashboard", false);
  renderListaTiposContainer(residuosTiposResiduos, "Resíduos", true);
}

function renderListaTiposContainer(container, local, expanded) {
  if (!container) {
    return;
  }

  const classes = Object.keys(tiposResiduosPorClasse);
  const totalTipos = classes.reduce((acc, classe) => acc + (tiposResiduosPorClasse[classe] || []).length, 0);

  const resumo = classes
    .map((classe) => {
      const quantidade = (tiposResiduosPorClasse[classe] || []).length;
      return `
        <article class="tipos-summary-item">
          <strong>${escapeHtml(classe)}</strong>
          <span>${quantidade} tipos</span>
        </article>
      `;
    })
    .join("");

  const cards = classes
    .map((classe) => {
      const itens = (tiposResiduosPorClasse[classe] || [])
        .map((tipo) => `<li>${escapeHtml(tipo)}</li>`)
        .join("");
      return `
        <article class="tipos-details-card">
          <h4>${escapeHtml(classe)} (${(tiposResiduosPorClasse[classe] || []).length} tipos)</h4>
          <ul>${itens}</ul>
        </article>
      `;
    })
    .join("");

  container.innerHTML = `
    <h3>Lista de ${totalTipos} tipos de resíduos por classe</h3>
    <div class="tipos-summary-grid">${resumo}</div>
    <details class="tipos-details" ${expanded ? "open" : ""}>
      <summary>Clique para ver a lista completa de tipos (${escapeHtml(local)})</summary>
      <div class="tipos-details-grid">${cards}</div>
    </details>
  `;
}

function renderCronogramaPassivos() {
  if (!cronogramaPassivosBody) {
    return;
  }

  cronogramaPassivosBody.innerHTML = CRONOGRAMA_PASSIVOS
    .map((item) => {
      const statusTag = mapearClasseStatusAcao(item.status);
      const fotoPassivo = fotoPorPassivo(item.passivo, item.fase);
      return `
        <tr>
          <td>
            <div class="cell-with-photo">
              <img class="cell-photo" src="assets/images/${encodeURI(fotoPassivo)}" alt="${escapeHtml(normalizarTexto(item.passivo))}" loading="lazy" />
              <span>${escapeHtml(item.passivo)}</span>
            </div>
          </td>
          <td>${escapeHtml(item.fase)}</td>
          <td>${escapeHtml(item.acao_principal)}</td>
          <td>${escapeHtml(item.objetivo_tecnico)}</td>
          <td>${formatarData(item.inicio)} a ${formatarData(item.fim)}</td>
          <td>${formatarNumero(item.prazo_dias)}</td>
          <td>${escapeHtml(item.prioridade)}</td>
          <td><span class="tag ${statusTag}">${escapeHtml(item.status)}</span></td>
          <td>${escapeHtml(item.responsavel)}</td>
        </tr>
      `;
    })
    .join("");

  if (cronogramaFaseBars) {
    const faseMap = contarPorCampo(CRONOGRAMA_PASSIVOS, "fase", "prazo_dias");
    const fases = objectEntries(faseMap);
    if (fases.length === 0) {
      cronogramaFaseBars.innerHTML = `<div class="empty">Sem dados de cronograma.</div>`;
    } else {
      const maxFase = Math.max(...fases.map(([, valor]) => Number(valor || 0)), 1);
      cronogramaFaseBars.innerHTML = fases
        .map(([fase, dias]) => {
          const pct = (Number(dias || 0) / maxFase) * 100;
          return `
            <div class="bar-item">
              <span>${escapeHtml(fase)} (${formatarNumero(dias)} dias)</span>
              <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
            </div>
          `;
        })
        .join("");
    }
  }

  const monitoramento = CRONOGRAMA_PASSIVOS.filter((item) => item.fase === "Monitoramento");
  const base = monitoramento.length > 0 ? monitoramento : CRONOGRAMA_PASSIVOS;
  const dados = objectEntries(contarPorCampo(base, "passivo", "prazo_dias"))
    .filter(([, dias]) => Number(dias || 0) > 0)
    .sort((a, b) => b[1] - a[1]);

  renderGraficoRosca(
    cronogramaMonitoramentoChart,
    cronogramaMonitoramentoLegend,
    dados,
    PALETA_PASSIVOS,
    "dias"
  );
}

function inicializarGeradorPrad() {
  if (!pradEmpresa || !pradAcoesEditBody || !pradPreview) {
    return;
  }

  if (pradEmpresa.dataset.ready === "1") {
    return;
  }

  pradEmpresa.value = RELATORIO_PRAD_BASE.empresa;
  pradEmpreendimento.value = RELATORIO_PRAD_BASE.empreendimento;
  pradLocalizacao.value = RELATORIO_PRAD_BASE.localizacao;
  pradResponsavel.value = RELATORIO_PRAD_BASE.responsavel;
  pradDataVistoria.value = new Date().toISOString().slice(0, 10);
  pradPrazoMeses.value = String(RELATORIO_PRAD_BASE.prazo_meses);
  pradAreaTotal.value = String(RELATORIO_PRAD_BASE.area_total_ha);
  pradAreaRecuperacao.value = String(RELATORIO_PRAD_BASE.area_recuperacao_ha);
  pradCoberturaVegetal.value = String(RELATORIO_PRAD_BASE.cobertura_vegetal_pct);
  pradMetaSobrevivencia.value = String(RELATORIO_PRAD_BASE.meta_sobrevivencia_pct);
  pradDiagnosticoTexto.value = RELATORIO_PRAD_BASE.diagnostico.map((item) => `- ${item}`).join("\n");
  pradMetasTexto.value = RELATORIO_PRAD_BASE.metas.map((item) => `- ${item}`).join("\n");
  pradObservacoes.value = RELATORIO_PRAD_BASE.observacoes;

  pradAcoesEditBody.innerHTML = RELATORIO_PRAD_BASE.acoes
    .map(
      (acao) => `
      <tr>
        <td><input class="prad-action-input" data-field="acao" value="${escapeHtml(acao[0])}" /></td>
        <td><input class="prad-action-input" data-field="responsavel" value="${escapeHtml(acao[1])}" /></td>
        <td><input class="prad-action-input" data-field="prioridade" value="${escapeHtml(acao[2])}" /></td>
        <td><input class="prad-action-input" data-field="status" value="${escapeHtml(acao[3])}" /></td>
      </tr>
    `
    )
    .join("");

  pradEmpresa.dataset.ready = "1";
}

function atualizarPreviewPrad() {
  if (!pradPreview) {
    return;
  }
  pradPreview.value = gerarTextoRelatorioPrad();
}

function gerarTextoRelatorioPrad() {
  const diagnostico = textoParaItens(pradDiagnosticoTexto?.value || "", RELATORIO_PRAD_BASE.diagnostico);
  const metas = textoParaItens(pradMetasTexto?.value || "", RELATORIO_PRAD_BASE.metas);
  const acoes = coletarAcoesPradEditadas();

  const areaTotal = Number(pradAreaTotal?.value || 0);
  const areaRec = Number(pradAreaRecuperacao?.value || 0);
  const recPct = areaTotal > 0 ? (areaRec / areaTotal) * 100 : 0;

  const totalKg = registros.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const valorizadoKg = registros.reduce((acc, item) => {
    return item.destino === "Reciclagem" ||
      item.destino === "Coprocessamento" ||
      item.destino === "Reaproveitamento energético"
      ? acc + Number(item.quantidade || 0)
      : acc;
  }, 0);
  const taxaValorizacao = totalKg > 0 ? (valorizadoKg / totalKg) * 100 : 0;

  const linhasAcoes = acoes
    .map((item, idx) => `${idx + 1}. ${item.acao} | ${item.responsavel} | ${item.prioridade} | ${item.status}`)
    .join("\n");

  return [
    `# Relatório PRAD - ${normalizarTexto(pradEmpreendimento?.value || "")}`,
    "",
    `Empresa: ${normalizarTexto(pradEmpresa?.value || "")}`,
    `Empreendimento: ${normalizarTexto(pradEmpreendimento?.value || "")}`,
    `Localização: ${normalizarTexto(pradLocalizacao?.value || "")}`,
    `Responsável técnico: ${normalizarTexto(pradResponsavel?.value || "")}`,
    `Data da vistoria: ${formatarData(pradDataVistoria?.value || "")}`,
    "",
    "## Indicadores",
    `- Prazo de execução: ${formatarNumero(pradPrazoMeses?.value || 0)} meses`,
    `- Área total degradada: ${formatarNumero(areaTotal)} ha`,
    `- Área em recuperação: ${formatarNumero(areaRec)} ha`,
    `- Recuperação atual: ${formatarNumero(recPct)}%`,
    `- Cobertura vegetal atual: ${formatarNumero(pradCoberturaVegetal?.value || 0)}%`,
    `- Meta de sobrevivência: ${formatarNumero(pradMetaSobrevivencia?.value || 0)}%`,
    `- Valorização de resíduos (base app): ${formatarNumero(taxaValorizacao)}%`,
    "",
    "## Diagnóstico técnico",
    ...diagnostico.map((item) => `- ${item}`),
    "",
    "## Objetivos e metas",
    ...metas.map((item) => `- ${item}`),
    "",
    "## Plano de ação",
    linhasAcoes || "Sem ações definidas.",
    "",
    "## Observações técnicas",
    normalizarTexto(pradObservacoes?.value || "") || "Sem observações complementares.",
    "",
    "Relatório gerado automaticamente pelo aplicativo."
  ].join("\n");
}

function coletarAcoesPradEditadas() {
  if (!pradAcoesEditBody) {
    return [];
  }

  return [...pradAcoesEditBody.querySelectorAll("tr")]
    .map((linha) => ({
      acao: normalizarTexto(linha.querySelector('input[data-field="acao"]')?.value || ""),
      responsavel: normalizarTexto(linha.querySelector('input[data-field="responsavel"]')?.value || ""),
      prioridade: normalizarTexto(linha.querySelector('input[data-field="prioridade"]')?.value || ""),
      status: normalizarTexto(linha.querySelector('input[data-field="status"]')?.value || "")
    }))
    .filter((item) => item.acao);
}

function baixarRelatorioPrad(tipo) {
  const baseNome = `PRAD_${slugNomeArquivo(pradEmpreendimento?.value || pradEmpresa?.value || "prad")}_${new Date().toISOString().slice(0, 10)}`;
  const texto = gerarTextoRelatorioPrad();

  if (tipo === "md") {
    baixarBlob(new Blob([texto], { type: "text/markdown;charset=utf-8" }), `${baseNome}.md`);
    return;
  }

  if (tipo === "txt") {
    baixarBlob(new Blob([texto], { type: "text/plain;charset=utf-8" }), `${baseNome}.txt`);
    return;
  }

  if (!window.XLSX) {
    mostrarAviso("Biblioteca XLSX não carregada. Verifique sua conexão para exportar .xlsx.");
    return;
  }

  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();

  const resumo = [
    { Campo: "Empresa", Valor: normalizarTexto(pradEmpresa?.value || "") },
    { Campo: "Empreendimento", Valor: normalizarTexto(pradEmpreendimento?.value || "") },
    { Campo: "Localização", Valor: normalizarTexto(pradLocalizacao?.value || "") },
    { Campo: "Responsável técnico", Valor: normalizarTexto(pradResponsavel?.value || "") },
    { Campo: "Data da vistoria", Valor: formatarData(pradDataVistoria?.value || "") },
    { Campo: "Prazo (meses)", Valor: Number(pradPrazoMeses?.value || 0) },
    { Campo: "Área total degradada (ha)", Valor: Number(pradAreaTotal?.value || 0) },
    { Campo: "Área em recuperação (ha)", Valor: Number(pradAreaRecuperacao?.value || 0) },
    { Campo: "Cobertura vegetal (%)", Valor: Number(pradCoberturaVegetal?.value || 0) },
    { Campo: "Meta de sobrevivência (%)", Valor: Number(pradMetaSobrevivencia?.value || 0) }
  ];

  const acoes = coletarAcoesPradEditadas();
  const residuos = registros.map((item) => ({
    Data: formatarData(item.data),
    Tipo: item.tipo,
    Classe: item.classe,
    Origem: item.origem,
    QuantidadeKg: Number(item.quantidade || 0),
    Destino: item.destino,
    Status: item.status
  }));

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumo), "Resumo PRAD");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(acoes), "Plano Acao");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(residuos), "Base Residuos");

  const xlsxBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  baixarBlob(
    new Blob([xlsxBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${baseNome}.xlsx`
  );
}

function baixarBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderRelatorioRecuperacao() {
  if (!relatorioIndicadores || !relatorioDiagnostico || !relatorioMetas || !relatorioCronograma || !relatorioAcoes || !relatorioMonitoramento) {
    return;
  }

  const totalKg = registros.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const soloContaminadoKg = registros
    .filter((item) => String(item.tipo || "").toLowerCase().includes("solo contaminado"))
    .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const naoConformes = registros.filter((item) => isNaoConformidade(item.status)).length;
  const taxaNaoConforme = registros.length > 0 ? (naoConformes / registros.length) * 100 : 0;
  const kgValorizado = registros.reduce((acc, item) => {
    return isDestinoValorizacao(item.destino) ? acc + Number(item.quantidade || 0) : acc;
  }, 0);
  const taxaValorizacao = totalKg > 0 ? (kgValorizado / totalKg) * 100 : 0;

  relatorioIndicadores.innerHTML = `
    <article class="kpi">
      <div class="label">Área em recuperação</div>
      <div class="value">3,8 ha</div>
      <div class="meta">${escapeHtml(normalizarTexto(relatorioRecuperacao.area))}</div>
    </article>
    <article class="kpi">
      <div class="label">Solo contaminado monitorado</div>
      <div class="value">${formatarNumero(soloContaminadoKg)} kg</div>
      <div class="meta">Base de registros operacionais</div>
    </article>
    <article class="kpi">
      <div class="label">Não conformidades</div>
      <div class="value">${naoConformes}</div>
      <div class="meta">${formatarNumero(taxaNaoConforme)}% dos registros</div>
    </article>
    <article class="kpi">
      <div class="label">Valorização de resíduos</div>
      <div class="value">${formatarNumero(taxaValorizacao)}%</div>
      <div class="meta">Referência para redução de passivo</div>
    </article>
  `;

  relatorioDiagnostico.innerHTML = relatorioRecuperacao.diagnostico
    .map((item) => `<div class="list-item">${escapeHtml(normalizarTexto(item))}</div>`)
    .join("");

  relatorioMetas.innerHTML = relatorioRecuperacao.metas
    .map((item) => `<li>${escapeHtml(normalizarTexto(item))}</li>`)
    .join("");

  relatorioCronograma.innerHTML = relatorioRecuperacao.cronograma
    .map(
      (fase) => `
      <tr>
        <td>${escapeHtml(normalizarTexto(fase.fase))}</td>
        <td>${escapeHtml(normalizarTexto(fase.periodo))}</td>
        <td>${escapeHtml(normalizarTexto(fase.escopo))}</td>
        <td>${escapeHtml(normalizarTexto(fase.entregavel))}</td>
      </tr>
    `
    )
    .join("");

  relatorioAcoes.innerHTML = relatorioRecuperacao.acoes
    .map((acao) => {
      const classeStatus = mapearClasseStatusAcao(acao.status);
      return `
        <tr>
          <td>${escapeHtml(normalizarTexto(acao.acao))}</td>
          <td>${escapeHtml(normalizarTexto(acao.responsavel))}</td>
          <td>${escapeHtml(normalizarTexto(acao.prazo))}</td>
          <td>${escapeHtml(normalizarTexto(acao.prioridade))}</td>
          <td><span class="tag ${classeStatus}">${escapeHtml(normalizarTexto(acao.status))}</span></td>
        </tr>
      `;
    })
    .join("");

  relatorioMonitoramento.innerHTML = relatorioRecuperacao.monitoramento
    .map((item) => `<li>${escapeHtml(normalizarTexto(item))}</li>`)
    .join("");
}

function mapearClasseStatusAcao(status) {
  if (status === "Concluída" || status === "Concluído") {
    return "ok";
  }
  if (status === "Em andamento") {
    return "info";
  }
  if (status === "Atrasada") {
    return "alert";
  }
  return "warn";
}

function renderSlides() {
  if (!slidesGrid) {
    return;
  }

  const filtrados = slides.filter((slide) => {
    if (!termoSlide) {
      return true;
    }

    const texto = `${slide.title} ${slide.texts.join(" ")}`.toLowerCase();
    return texto.includes(termoSlide);
  });

  if (filtrados.length === 0) {
    slidesGrid.innerHTML = `<div class="empty">Nenhum slide encontrado para essa busca.</div>`;
    return;
  }

  slidesGrid.innerHTML = filtrados
    .map((slide) => {
      const comentarios = slide.texts.filter((linha) => linha && linha !== slide.title);
      const comentarioPrincipal = comentarios[0] || "";
      const pontos = comentarios
        .slice(1, 9)
        .map((linha) => `<li>${escapeHtml(linha)}</li>`)
        .join("");

      const imagensDoSlide = Array.isArray(slide.images) && slide.images.length > 0
        ? slide.images
        : [`apresentacao/pres_slide${String(slide.slide).padStart(2, "0")}.png`];

      const imagens = imagensDoSlide
        .map(
          (img) =>
            `<img src="assets/images/${encodeURI(String(img))}" alt="Slide ${slide.slide} - ${escapeHtml(slide.title)}" loading="lazy" />`
        )
        .join("");

      return `
        <article class="slide-card">
          <h3>Slide ${slide.slide}: ${escapeHtml(slide.title)}</h3>
          <div class="slide-image-group">${imagens || `<div class="empty">Sem imagem neste slide.</div>`}</div>
          ${comentarioPrincipal ? `<p class="slide-comment"><strong>Tema:</strong> ${escapeHtml(comentarioPrincipal)}</p>` : ""}
          ${pontos ? `<ul class="slide-points">${pontos}</ul>` : ""}
        </article>
      `;
    })
    .join("");
}

function loadRegistros() {
  try {
    const raw = storageGet(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item, index) => normalizarRegistroCarregado(item, index))
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

function normalizarRegistroCarregado(item, index) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const quantidade = parseQuantidade(item.quantidade);
  const tipo = normalizarTexto(String(item.tipo || "Não informado"));
  const classeInferida = normalizarTexto(String(item.classe || ""));
  const classe = tiposResiduosPorClasse[classeInferida] ? classeInferida : inferirClassePorTipo(tipo);

  return {
    id: String(item.id || `R-${Date.now()}-${index}`),
    data: String(item.data || ""),
    tipo,
    classe: classe || "Classe I",
    origem: normalizarTexto(String(item.origem || "Não informado")),
    quantidade: Number.isFinite(quantidade) ? quantidade : 0,
    destino: normalizarTexto(String(item.destino || "Não informado")),
    status: normalizarTexto(String(item.status || "Não informado"))
  };
}

function inferirClassePorTipo(tipo) {
  const valor = normalizarTexto(tipo);
  for (const classe of Object.keys(tiposResiduosPorClasse)) {
    const tipos = tiposResiduosPorClasse[classe] || [];
    if (tipos.some((item) => normalizarTexto(item) === valor)) {
      return classe;
    }
  }
  return "Classe I";
}

function saveRegistros() {
  storageSet(STORAGE_KEY, JSON.stringify(registros));
}

function storageGet(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (_) {
    return STORAGE_FALLBACK.has(chave) ? STORAGE_FALLBACK.get(chave) : null;
  }
}

function storageSet(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (_) {
    STORAGE_FALLBACK.set(chave, valor);
  }
}

function mostrarAviso(texto) {
  if (!footer || !texto) {
    return;
  }

  let aviso = document.getElementById("app-aviso");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "app-aviso";
    aviso.style.margin = "6px 0 0";
    aviso.style.fontSize = "0.85rem";
    aviso.style.color = "var(--accent)";
    footer.append(aviso);
  }

  aviso.textContent = texto;
}

function renderGraficoRosca(container, legendContainer, entries, palette, unidade) {
  if (!container || !legendContainer) {
    return;
  }

  if (!entries || entries.length === 0) {
    container.style.background = "none";
    container.innerHTML = `<div class="donut-hole"><strong>0</strong><span>${unidade}</span></div>`;
    legendContainer.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    return;
  }

  const total = entries.reduce((acc, [, valor]) => acc + Number(valor || 0), 0);
  if (total <= 0) {
    container.style.background = "none";
    container.innerHTML = `<div class="donut-hole"><strong>0</strong><span>${unidade}</span></div>`;
    legendContainer.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    return;
  }

  let acumulado = 0;
  const fatias = [];
  const legenda = entries
    .map(([nome, valor], index) => {
      const cor = palette[index % palette.length];
      const numeric = Number(valor || 0);
      const pct = (numeric / total) * 100;
      const inicio = acumulado;
      acumulado += pct * 3.6;
      fatias.push(`${cor} ${inicio.toFixed(2)}deg ${acumulado.toFixed(2)}deg`);
      let sufixo = "reg";
      if (unidade === "kg") {
        sufixo = "kg";
      } else if (unidade === "dias") {
        sufixo = "dias";
      }
      const valorFormatado = `${formatarNumero(numeric)} ${sufixo}`;
      return `
        <div class="legend-item">
          <span class="legend-chip" style="background:${cor}"></span>
          <span>${escapeHtml(nome)}: <strong>${valorFormatado}</strong> (${formatarNumero(pct)}%)</span>
        </div>
      `;
    })
    .join("");

  container.style.background = `conic-gradient(${fatias.join(",")})`;
  container.innerHTML = `<div class="donut-hole"><strong>${formatarNumero(total)}</strong><span>${unidade}</span></div>`;
  legendContainer.innerHTML = legenda;
}

function renderBarraEmpilhada(container, legendContainer, entries, palette, unidade) {
  if (!container || !legendContainer) {
    return;
  }

  if (!entries || entries.length === 0) {
    container.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    legendContainer.innerHTML = "";
    return;
  }

  const total = entries.reduce((acc, [, valor]) => acc + Number(valor || 0), 0);
  if (total <= 0) {
    container.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    legendContainer.innerHTML = "";
    return;
  }

  const segmentos = entries
    .map(([, valor], index) => {
      const cor = palette[index % palette.length];
      const pct = (Number(valor || 0) / total) * 100;
      return `<span class="stack-segment" style="width:${pct.toFixed(2)}%; background:${cor}"></span>`;
    })
    .join("");

  const legenda = entries
    .map(([nome, valor], index) => {
      const cor = palette[index % palette.length];
      const numeric = Number(valor || 0);
      const pct = (numeric / total) * 100;
      return `
        <div class="legend-item">
          <span class="legend-chip" style="background:${cor}"></span>
          <span>${escapeHtml(nome)}: <strong>${formatarNumero(numeric)} ${unidade}</strong> (${formatarNumero(pct)}%)</span>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `<div class="stack-track">${segmentos}</div>`;
  legendContainer.innerHTML = legenda;
}

function contarPorCampo(array, campo, campoSoma) {
  return array.reduce((acc, item) => {
    const chave = item[campo] || "Não informado";
    const incremento = campoSoma ? Number(item[campoSoma] || 0) : 1;
    acc[chave] = (acc[chave] || 0) + incremento;
    return acc;
  }, {});
}

function objectEntries(obj) {
  const entries = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      entries.push([key, obj[key]]);
    }
  }
  return entries;
}

function objectValues(obj) {
  const values = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      values.push(obj[key]);
    }
  }
  return values;
}

function agruparKgPorMes(array) {
  const acumulado = new Map();

  array.forEach((item) => {
    if (!item.data) {
      return;
    }

    const mes = String(item.data).slice(0, 7);
    if (mes.length !== 7) {
      return;
    }

    const atual = acumulado.get(mes) || 0;
    acumulado.set(mes, atual + Number(item.quantidade || 0));
  });

  return [...acumulado.entries()].sort(([mesA], [mesB]) => mesA.localeCompare(mesB));
}

function agruparValorizacaoAterroPorMes(array) {
  const acumulado = new Map();

  array.forEach((item) => {
    if (!item.data) {
      return;
    }

    const mes = String(item.data).slice(0, 7);
    if (mes.length !== 7) {
      return;
    }

    const atual = acumulado.get(mes) || { valorizacao: 0, aterro: 0 };
    const quantidade = Number(item.quantidade || 0);

    if (item.destino === "Aterro industrial licenciado") {
      atual.aterro += quantidade;
    } else if (isDestinoValorizacao(item.destino)) {
      atual.valorizacao += quantidade;
    }

    acumulado.set(mes, atual);
  });

  return [...acumulado.entries()]
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .map(([mes, valores]) => ({
      mes,
      valorizacao: valores.valorizacao,
      aterro: valores.aterro
    }));
}

function formatarMesAno(chaveMes) {
  const [ano, mes] = String(chaveMes).split("-");
  const data = new Date(Number(ano), Number(mes) - 1, 1);
  if (Number.isNaN(data.getTime())) {
    return chaveMes;
  }

  return data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function textoParaItens(texto, padrao) {
  const itens = String(texto || "")
    .split("\n")
    .map((linha) => linha.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean);
  return itens.length > 0 ? itens : padrao;
}

function slugNomeArquivo(texto) {
  return String(texto || "prad")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "prad";
}

function isNaoConformidade(status) {
  const normalizado = normalizarTexto(String(status || "")).toLowerCase();
  return normalizado.includes("não conformidade") || normalizado.includes("nao conformidade");
}

function isDestinoValorizacao(destino) {
  const normalizado = normalizarTexto(String(destino || "")).toLowerCase();
  return (
    normalizado === "reciclagem" ||
    normalizado === "coprocessamento" ||
    normalizado === "reaproveitamento energético" ||
    normalizado === "reaproveitamento energetico"
  );
}

function fotoPorTipoResiduo(tipo) {
  const chave = normalizarTexto(String(tipo || "")).toLowerCase();

  if (chave.includes("cinza")) {
    return "slide05.png";
  }
  if (chave.includes("lodo")) {
    return "slide06.png";
  }
  if (chave.includes("óleo") || chave.includes("oleo")) {
    return "slide19.png";
  }
  if (chave.includes("químic") || chave.includes("quimic")) {
    return "slide03.png";
  }
  if (chave.includes("recicl")) {
    return "slide05.png";
  }
  if (chave.includes("biomassa")) {
    return "slide11.png";
  }
  if (chave.includes("solo")) {
    return "slide17.png";
  }
  if (chave.includes("epi") || chave.includes("absorvente")) {
    return "slide20.png";
  }
  return "slide01.png";
}

function fotoPorPassivo(passivo, fase) {
  const p = normalizarTexto(String(passivo || "")).toLowerCase();
  const f = normalizarTexto(String(fase || "")).toLowerCase();

  if (p.includes("óleo") || p.includes("oleo")) {
    if (f.includes("monitor")) {
      return "slide20.png";
    }
    return "slide19.png";
  }

  if (f.includes("diagnóst") || f.includes("diagnost")) {
    return "slide17.png";
  }
  if (f.includes("conten")) {
    return "slide18.png";
  }
  if (f.includes("recuper")) {
    return "slide20.png";
  }
  if (f.includes("monitor")) {
    return "slide20.png";
  }
  return "slide17.png";
}

function parseQuantidade(valor) {
  const texto = String(valor || "").trim();
  const normalizado = texto.includes(",")
    ? texto.replace(/\./g, "").replace(",", ".")
    : texto;
  return Number(normalizado);
}

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(Number(valor || 0));
}

function formatarData(isoData) {
  if (!isoData) {
    return "-";
  }

  const data = new Date(`${isoData}T00:00:00`);
  return Number.isNaN(data.getTime()) ? isoData : data.toLocaleDateString("pt-BR");
}

const MOJIBAKE_MAP = new Map([
  ["Ã¡", "á"],
  ["Ã¢", "â"],
  ["Ã£", "ã"],
  ["Ãà", "à"],
  ["Ãä", "ä"],
  ["Ãé", "é"],
  ["Ãê", "ê"],
  ["Ãè", "è"],
  ["Ãí", "í"],
  ["Ãì", "ì"],
  ["Ãó", "ó"],
  ["Ãô", "ô"],
  ["Ãõ", "õ"],
  ["Ãò", "ò"],
  ["Ãú", "ú"],
  ["Ãù", "ù"],
  ["Ãç", "ç"],
  ["ÃÁ", "Á"],
  ["ÃÂ", "Â"],
  ["ÃÃ", "Ã"],
  ["ÃÀ", "À"],
  ["ÃÉ", "É"],
  ["ÃÊ", "Ê"],
  ["ÃÓ", "Ó"],
  ["ÃÔ", "Ô"],
  ["ÃÕ", "Õ"],
  ["ÃÚ", "Ú"],
  ["ÃÇ", "Ç"],
  ["Âº", "º"],
  ["Âª", "ª"],
  ["Â°", "°"],
  ["Ã¢â‚¬Â¢", "â€¢"],
  ["Ã¢â‚¬â€œ", "â€“"],
  ["Ã¢â‚¬â€", "â€”"],
  ["Ã¢â‚¬Å“", "\""],
  ["Ã¢â‚¬Â", "\""],
  ["Ã¢â‚¬Ëœ", "'"],
  ["Ã¢â‚¬â„¢", "'"],
  ["ÃƒÂ¡", "Ã¡"],
  ["ÃƒÂ¢", "Ã¢"],
  ["ÃƒÂ£", "Ã£"],
  ["Ãƒ ", "Ã "],
  ["ÃƒÂ¤", "Ã¤"],
  ["ÃƒÂ©", "Ã©"],
  ["ÃƒÂª", "Ãª"],
  ["ÃƒÂ¨", "Ã¨"],
  ["ÃƒÂ­", "Ã­"],
  ["ÃƒÂ¬", "Ã¬"],
  ["ÃƒÂ³", "Ã³"],
  ["ÃƒÂ´", "Ã´"],
  ["ÃƒÂµ", "Ãµ"],
  ["ÃƒÂ²", "Ã²"],
  ["ÃƒÂº", "Ãº"],
  ["ÃƒÂ¹", "Ã¹"],
  ["ÃƒÂ§", "Ã§"],
  ["ÃƒÂ", "Ã"],
  ["Ãƒâ€š", "Ã‚"],
  ["ÃƒÆ’", "Ãƒ"],
  ["Ãƒâ‚¬", "Ã€"],
  ["Ãƒâ€°", "Ã‰"],
  ["ÃƒÅ ", "ÃŠ"],
  ["Ãƒâ€œ", "Ã“"],
  ["Ãƒâ€", "Ã”"],
  ["Ãƒâ€¢", "Ã•"],
  ["ÃƒÅ¡", "Ãš"],
  ["Ãƒâ€¡", "Ã‡"],
  ["Ã‚Âº", "Âº"],
  ["Ã‚Âª", "Âª"],
  ["Ã‚Â°", "Â°"],
  ["Ã‚", ""]
]);

function corrigirMojibake(texto) {
  let saida = texto;

  for (let i = 0; i < 3; i += 1) {
    const antes = saida;
    for (const [quebrado, correto] of MOJIBAKE_MAP.entries()) {
      saida = saida.split(quebrado).join(correto);
    }

    if (saida === antes) {
      break;
    }
  }

  return saida;
}

function normalizarTexto(texto) {
  if (!texto) {
    return "";
  }

  let normalizado = String(texto).trim();

  if (/[ÃƒÃ‚Ã¢]/.test(normalizado)) {
    normalizado = corrigirMojibake(normalizado);
  }

  if (normalizado === "â€¢") {
    return "";
  }

  return normalizado.replace(/\s+/g, " ").trim();
}

function escapeHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


