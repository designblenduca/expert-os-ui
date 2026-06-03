import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, TrendingUp, FilePlus, Landmark, Brain, Bot, 
  GraduationCap, Lightbulb, Users,
  Settings, Megaphone, Coins, Package, HardHat
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BMentorPage } from './components/BMentorPage';
import { BusinessPillarsPage } from './components/BusinessPillarsPage';
import { IntelligenceCenter } from './components/IntelligenceCenter';
import { KnowledgeBusinessPage } from './components/KnowledgeBusinessPage';
import { ManageAgentsPage } from './components/ManageAgentsPage';
import { MetricEntriesPage } from './components/MetricEntriesPage';
import { MetricsPage } from './components/MetricsPage';
import { MyClientsPage } from './components/MyClientsPage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const chartHoverGuidePlugin: Plugin<'line'> = {
  id: 'chartHoverGuide',
  afterDatasetsDraw: (chart) => {
    const tooltip = chart.tooltip;
    const activePoint = tooltip?.dataPoints?.[0];

    if (!tooltip || tooltip.opacity === 0 || !activePoint) return;

    const { ctx, chartArea } = chart;
    const x = activePoint.element.x;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'metrics_new', label: 'Novas Métricas', icon: TrendingUp },
  { id: 'metrics_add', label: 'Cadastro de Métricas', icon: FilePlus },
  { id: 'pillars', label: 'Pilares do Negócio', icon: Landmark },
  { id: 'intelligence', label: 'Central de Inteligência', icon: Brain },
  { id: 'agents', label: 'Gerenciar Agentes', icon: Bot },
  { id: 'bmentor', label: "B'Mentor", icon: GraduationCap },
  { id: 'knowledge', label: 'Negócios de Conhecimento', icon: Lightbulb },
  { id: 'clients', label: 'Meus Clientes', icon: Users },
];

const PAGE_LABELS = NAV_ITEMS.reduce<Record<string, string>>((labels, item) => {
  labels[item.id] = item.label;
  return labels;
}, {});

const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const ACHIEVEMENT_PLATES = [
  { id: '50k', src: getAssetPath('/plates/placa-50k.png'), alt: 'Placa conquistada 50K' },
  { id: '100k', src: getAssetPath('/plates/placa-100k.png'), alt: 'Placa conquistada 100K' },
  { id: '200k', src: getAssetPath('/plates/placa-200k.png'), alt: 'Placa conquistada 200K' },
  { id: '1m', src: getAssetPath('/plates/placa-1m.png'), alt: 'Placa conquistada 1M' },
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [intelCategory, setIntelCategory] = useState<string | null>(null);
  const [intelSearch, setIntelSearch] = useState('');
  const [selectedPlate, setSelectedPlate] = useState<(typeof ACHIEVEMENT_PLATES)[number] | null>(null);
  const chartRef = useRef<any>(null);
  const [chartData, setChartData] = useState<any>({ datasets: [] });

  // Setup High-Quality Chart
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const conversionLine = ctx.createLinearGradient(0, 0, 800, 0);
    conversionLine.addColorStop(0, '#BDCCEB');
    conversionLine.addColorStop(1, '#8EA4D0');

    const roiLine = ctx.createLinearGradient(0, 0, 800, 0);
    roiLine.addColorStop(0, '#3F73DD');
    roiLine.addColorStop(1, '#2C65DA');

    const cacLine = ctx.createLinearGradient(0, 0, 800, 0);
    cacLine.addColorStop(0, '#2357C3');
    cacLine.addColorStop(1, '#1F4EAD');

    const conversionArea = ctx.createLinearGradient(0, 0, 0, 360);
    conversionArea.addColorStop(0, 'rgba(189, 204, 235, 0.26)');
    conversionArea.addColorStop(1, 'rgba(189, 204, 235, 0)');

    const roiArea = ctx.createLinearGradient(0, 0, 0, 360);
    roiArea.addColorStop(0, 'rgba(63, 115, 221, 0.2)');
    roiArea.addColorStop(1, 'rgba(63, 115, 221, 0)');

    const cacArea = ctx.createLinearGradient(0, 0, 0, 360);
    cacArea.addColorStop(0, 'rgba(35, 87, 195, 0.18)');
    cacArea.addColorStop(1, 'rgba(35, 87, 195, 0)');

    const labels = Array.from({ length: 30 }, (_, index) => `Apr ${index + 1}`);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Taxa de Conversão',
          data: [1800, 3200, 2400, 4100, 3800, 5200, 6900, 6200, 7800, 8600, 1800, 9400, 10400, 11300, 11400, 12800, 10800, 12900, 14300, 15100, 14400, 16200, 17000, 17800, 16800, 19000, 19700, 20600, 21400, 22300],
          borderColor: conversionLine,
          backgroundColor: conversionArea,
          pointBackgroundColor: '#BDCCEB',
          pointHoverBackgroundColor: '#BDCCEB',
          pointBorderColor: '#BDCCEB',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.18,
        },
        {
          label: 'ROI de Campanhas',
          data: [1400, 2300, 1900, 3000, 2300, 3600, 4600, 4200, 5100, 5600, 2300, 6200, 6800, 7400, 7200, 8200, 6900, 8000, 9100, 9700, 9500, 10500, 11000, 11600, 10300, 12100, 12400, 12900, 13500, 14100],
          borderColor: roiLine,
          backgroundColor: roiArea,
          pointBackgroundColor: '#3F73DD',
          pointHoverBackgroundColor: '#3F73DD',
          pointBorderColor: '#3F73DD',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.18,
        },
        {
          label: 'Custo por Aquisição (CAC)',
          data: [900, 1300, 1100, 1700, 1400, 1900, 2200, 2100, 2500, 2700, 2500, 2900, 3300, 3600, 3200, 3800, 4000, 3500, 4200, 4300, 3900, 4600, 4900, 5100, 4800, 5300, 5500, 5700, 5900, 6100],
          borderColor: cacLine,
          backgroundColor: cacArea,
          pointBackgroundColor: '#2357C3',
          pointHoverBackgroundColor: '#2357C3',
          pointBorderColor: '#2357C3',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.18,
        },
      ]
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 8, 14, 0.96)',
        titleColor: '#AEB8CC',
        bodyColor: '#FFF',
        bodyFont: { size: 14, weight: 600 },
        titleFont: { size: 16, weight: 600 },
        padding: 18,
        cornerRadius: 14,
        borderColor: 'rgba(63, 115, 221, 0.28)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString('pt-BR')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 25000,
        grid: { color: 'rgba(63, 115, 221, 0.16)', drawBorder: false, borderDash: [4, 4] },
        border: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#A0A8BA',
          stepSize: 5000,
          font: { size: 12 },
          callback: (val: any) => Number(val).toLocaleString('en-US')
        }
      },
      x: {
        grid: { display: false },
        border: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#A0A8BA',
          font: { size: 12 },
          maxRotation: 0,
          autoSkip: false,
          callback: (_val: any, index: number) => ([4, 9, 14, 19, 24, 29].includes(index) ? `Apr ${index + 1}` : '')
        }
      }
    },
    interaction: { intersect: false, mode: 'index' as const },
  };

  return (
    <>
      <div className="ambient-bg" />
      <div className="app-container">
        {/* Sidebar */}
        <motion.aside 
          className="sidebar glass-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="brand">
            <div
              className="logo-img"
              style={{ '--logo-mask': `url("${getAssetPath('/logo.svg')}")` } as React.CSSProperties}
            ></div>
          </div>
          
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li 
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  {activePage === item.id && <div className="nav-item-active-bg" />}
                  <item.icon className="nav-icon" size={20} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="user-profile">
            <div className="avatar">M</div>
            <div className="user-info">
              <span className="user-name">Mateus</span>
              <span className="user-role">CEO</span>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="main-content glass-panel">
          <AnimatePresence mode="wait">
            {activePage === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <header className="page-header">
                  <h2>Bem-vindo de volta, <span className="highlight">Mateus</span></h2>
                  <p className="subtitle">Aqui está o resumo da sua operação hoje.</p>
                </header>

                <section className="achievements-section glass-panel">
                  <h3>Placas Conquistadas</h3>
                  <div className="achievement-plates-track">
                    <div className="progress-bar-bg">
                      <motion.div 
                        className="progress-fill" 
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>

                    {ACHIEVEMENT_PLATES.map((plate, idx) => (
                      <motion.div 
                        key={plate.id}
                        className="achievement-plate-level"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                      >
                        <motion.button
                          type="button"
                          className="achievement-plate-button"
                          onClick={() => setSelectedPlate(plate)}
                          whileHover={{ y: -8, scale: 1.05 }}
                          whileTap={{ scale: 0.96 }}
                          aria-label={`Ampliar ${plate.alt}`}
                        >
                          <motion.img
                            layoutId={`achievement-plate-${plate.id}`}
                            src={plate.src}
                            alt={plate.alt}
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <section className="metrics-grid">
                  {[
                    { title: 'Operação', val: '98.5%', trend: '+2.4%', icon: Settings },
                    { title: 'Marketing', val: '12.4k', trend: '+15%', icon: Megaphone },
                    { title: 'Vendas', val: 'R$ 45.200', trend: '+8.2%', icon: Coins },
                    { title: 'Produto', val: '4.9/5', trend: '+0.2', icon: Package }
                  ].map((metric, idx) => (
                    <motion.div 
                      key={idx}
                      className="metric-card glass-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                    >
                      <div className="metric-header">
                        <div className="metric-icon-wrapper">
                          <metric.icon size={20} />
                        </div>
                        <h4>{metric.title}</h4>
                      </div>
                      <div className="metric-value">{metric.val}</div>
                      <div className="metric-trend">{metric.trend}</div>
                    </motion.div>
                  ))}
                </section>

                <motion.section 
                  className="chart-section glass-panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="chart-header">
                    <div className="chart-title-block">
                      <h3>Faturamento</h3>
                      <div className="chart-kpi-row">
                        <strong>...</strong>
                        <span>...%</span>
                      </div>
                      <p>Métrica de Faturamento</p>
                    </div>
                    <span className="chart-period">Abril 2026</span>
                  </div>
                  <div className="chart-container">
                    {chartData.datasets.length > 0 && (
                      <Line
                        ref={chartRef}
                        data={chartData}
                        options={chartOptions}
                        plugins={[chartHoverGuidePlugin]}
                      />
                    )}
                  </div>
                </motion.section>
              </motion.div>
            )}

            {activePage === 'intelligence' && (
              <motion.div
                key="intelligence"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <IntelligenceCenter 
                  selectedCategory={intelCategory}
                  setSelectedCategory={setIntelCategory}
                  searchTerm={intelSearch}
                  setSearchTerm={setIntelSearch}
                />
              </motion.div>
            )}

            {activePage === 'metrics_new' && (
              <motion.div
                key="metrics-new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <MetricsPage />
              </motion.div>
            )}

            {activePage === 'metrics_add' && (
              <motion.div
                key="metrics-add"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <MetricEntriesPage />
              </motion.div>
            )}

            {activePage === 'pillars' && (
              <motion.div
                key="pillars"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <BusinessPillarsPage />
              </motion.div>
            )}

            {activePage === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <ManageAgentsPage />
              </motion.div>
            )}

            {activePage === 'bmentor' && (
              <motion.div
                key="bmentor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <BMentorPage />
              </motion.div>
            )}

            {activePage === 'knowledge' && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <KnowledgeBusinessPage />
              </motion.div>
            )}

            {activePage === 'clients' && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page"
              >
                <MyClientsPage />
              </motion.div>
            )}

            {activePage !== 'home' && activePage !== 'intelligence' && activePage !== 'metrics_new' && activePage !== 'metrics_add' && activePage !== 'pillars' && activePage !== 'agents' && activePage !== 'bmentor' && activePage !== 'knowledge' && activePage !== 'clients' && (
              <motion.div 
                key={activePage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="page construction-container"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HardHat size={80} className="construction-icon" />
                </motion.div>
                <h2>{PAGE_LABELS[activePage] || 'Página'} em Construção</h2>
                <p>Esta funcionalidade está sendo desenvolvida com o padrão Apple Liquid Glass e estará disponível em breve.</p>
                <button className="btn-primary" onClick={() => setActivePage('home')}>
                  Voltar para a Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {selectedPlate && (
          <motion.div
            className="plate-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlate(null)}
          >
            <motion.img
              layoutId={`achievement-plate-${selectedPlate.id}`}
              className="plate-modal-image"
              src={selectedPlate.src}
              alt={selectedPlate.alt}
              onClick={(event) => event.stopPropagation()}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
