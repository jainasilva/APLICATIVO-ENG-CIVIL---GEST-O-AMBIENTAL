const slides = [
  { title: 'Slide 1', src: '../Slide1.png' },
  { title: 'Slide 2', src: '../Slide2.png' },
  { title: 'Slide 3', src: '../Slide03.png' },
  { title: 'Slide 4', src: '../Slide04.jpg' },
  { title: 'Slide 5', src: '../slide05.jpg' },
  { title: 'Slide 6', src: '../Slide6.png' },
  { title: 'Slide 7', src: '../slide07.jpg' },
  { title: 'Slide 8', src: '../slide08.png' },
  { title: 'Slide 9', src: '../slide09.png' },
  { title: 'Slide 10', src: '../slide10.png' },
  { title: 'Slide 11', src: '../slide11.jpg' },
  { title: 'Slide 12', src: '../slide12.png' },
  { title: 'Slide 13', src: '../slide13.png' },
  { title: 'Slide 14', src: '../slide14.jpg' },
  { title: 'Slide 15', src: '../slide15.png' },
  { title: 'Slide 16', src: '../slide16.png' },
  { title: 'Slide 17', src: '../slide17.png' },
  { title: 'Slide 18', src: '../slide18.jpg' },
  { title: 'Slide 19', src: '../slide19.png' },
  { title: 'Slide 20', src: '../slide20.png' },
  { title: 'Slide 21', src: '../slide21.png' },
  { title: 'Slide 22', src: '../slide22.png' },
  { title: 'Slide 23', src: '../slide23.png' },
  { title: 'Slide 24', src: '../slide24.png' },
  { title: 'Slide 25', src: '../slide25.png' },
  { title: 'Slide 26', src: '../slide26.png' },
  { title: 'Slide 28', src: '../slide28.png' },
];

const indicators = {
  solidWaste: 320,
  effluentVolume: 1520,
  recyclingRate: 72,
  wasteReduction: 18,
  effluentProgress: 68,
  recyclingProgress: 74,
};

const actionPlan = [
  { Ação: 'Auditoria de resíduos sólidos', Responsável: 'Equipe Ambiental', Prazo: '30/06/2026', Status: 'Em andamento' },
  { Ação: 'Plano de redução de efluentes', Responsável: 'Operações', Prazo: '15/07/2026', Status: 'Planejado' },
  { Ação: 'Capacitação de colaboradores', Responsável: 'RH', Prazo: '01/08/2026', Status: 'Planejado' },
  { Ação: 'Monitoramento contínuo', Responsável: 'Engenharia', Prazo: '31/12/2026', Status: 'Em andamento' },
];

const dashboardData = {
  categories: ['Resíduos', 'Efluentes', 'Reciclagem', 'Redução'],
  values: [indicators.solidWaste, indicators.effluentVolume, indicators.recyclingRate, indicators.wasteReduction],
};

const currentSlideIndex = { value: 0 };

function $(selector) {
  return document.querySelector(selector);
}

function renderSlide(index) {
  const slide = slides[index];
  const imageElement = $('#current-slide-image');
  const titleElement = $('#current-slide-title');
  const indexElement = $('#current-slide-index');
  if (!slide) return;

  imageElement.src = slide.src;
  imageElement.alt = slide.title;
  titleElement.textContent = slide.title;
  indexElement.textContent = `Slide ${index + 1} de ${slides.length}`;

  document.querySelectorAll('.slide-thumb').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === index);
  });
}

function buildSlideList() {
  const list = $('#slide-list');
  slides.forEach((slide, index) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'slide-thumb';
    thumb.innerHTML = `<img src="${slide.src}" alt="${slide.title}" /><div class="slide-caption">${slide.title}</div>`;
    thumb.addEventListener('click', () => {
      currentSlideIndex.value = index;
      renderSlide(index);
    });
    list.appendChild(thumb);
  });
}

function bindEvents() {
  $('#prev-slide').addEventListener('click', () => {
    currentSlideIndex.value = (currentSlideIndex.value - 1 + slides.length) % slides.length;
    renderSlide(currentSlideIndex.value);
  });

  $('#next-slide').addEventListener('click', () => {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
    renderSlide(currentSlideIndex.value);
  });

  $('#theme-bracell').addEventListener('click', () => {
    document.querySelector('.app-shell').dataset.theme = 'bracell';
  });

  $('#theme-neutral').addEventListener('click', () => {
    document.querySelector('.app-shell').dataset.theme = 'neutral';
  });

  $('#export-report').addEventListener('click', () => {
    exportActionPlan();
  });

  $('#print-report').addEventListener('click', () => {
    window.print();
  });
}

function renderIndicators() {
  $('#solid-waste').textContent = `${indicators.solidWaste} t`;
  $('#effluent-volume').textContent = `${indicators.effluentVolume} m³`;
  $('#recycling-rate').textContent = `${indicators.recyclingRate}%`;
  $('#waste-reduction').textContent = `${indicators.wasteReduction}%`;
  $('#effluent-progress').style.width = `${indicators.effluentProgress}%`;
  $('#recycling-progress').style.width = `${indicators.recyclingProgress}%`;
}

function exportActionPlan() {
  const workbook = XLSX.utils.book_new();
  const wsData = [Object.keys(actionPlan[0])].concat(actionPlan.map(item => Object.values(item)));
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plano de Ação');
  XLSX.writeFile(workbook, 'Plano_de_Acao_Bracell.xlsx');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function renderDashboardChart() {
  const canvas = document.getElementById('dashboard-chart');
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dashboardData.categories,
      datasets: [
        {
          label: 'Indicadores Bracell',
          data: dashboardData.values,
          backgroundColor: ['#00573d', '#0a6a4d', '#0f7d57', '#0d8c5e'],
          borderRadius: 12,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#233023',
          },
          grid: {
            color: 'rgba(35, 48, 35, 0.12)',
          },
        },
        x: {
          ticks: {
            color: '#233023',
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#233023',
          },
        },
      },
    },
  });
}

async function addScriptLibrary() {
  await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
  buildSlideList();
  renderSlide(currentSlideIndex.value);
  renderIndicators();
  renderDashboardChart();
  bindEvents();
}

addScriptLibrary();
