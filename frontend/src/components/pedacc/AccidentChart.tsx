"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { AccData } from '@/features/pedacc/types';

// 디자인을 위해 Filler 추가 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 공통 차트 컨테이너 컴포넌트
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">{title}</h3>
      <div className="relative w-full h-64 sm:h-72 font-sans">
        {children}
      </div>
    </div>
  );
}

function padRange(min: number, max: number, padRatio = 0.1) {
  const span = Math.max(1, max - min);
  const pad = span * padRatio;
  return { min: Math.floor(min - pad), max: Math.ceil(max + pad) };
}

// 1. 연도별 추세 차트 (Line)
export function YearlyTrendChart({ yearlyData }: { yearlyData: AccData[] }) {
  const accidents = yearlyData.map(d => d.accident_count);
  const casualties = yearlyData.map(d => d.casualty_count);
  const deaths = yearlyData.map(d => d.fatality_count);

  const left = padRange(Math.min(...accidents, ...casualties), Math.max(...accidents, ...casualties), 0.15);
  const right = padRange(Math.min(...deaths), Math.max(...deaths), 0.2);

  const data = {
    labels: yearlyData.map(d => `${d.year}`),
    datasets: [
      {
        label: '  사고',
        data: accidents,
        borderColor: '#6366f1', // Indigo 500
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '  사상자',
        data: casualties,
        borderColor: '#f59e0b', // Amber 500
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 4,
      },
      {
        label: '  사망',
        data: deaths,
        borderColor: '#f43f5e', // Rose 500
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
        pointStyle: 'rectRot',
        pointRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        position: 'left',
        min: left.min,
        max: left.max,
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: '사고/사상자 수', color: '#64748b' },
      },
      y1: {
        position: 'right',
        min: right.min,
        max: right.max,
        grid: { drawOnChartArea: false },
        ticks: { color: '#f43f5e', font: { size: 11, weight: 'bold' } },
        title: { display: true, text: '사망자 수', color: '#f43f5e' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      }
    },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 6, padding:20, font: { size: 12, weight: 600, lineHeight: 2, } } },
      tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 },
    },
  };

  return (
    <ChartCard title="연도별 사고 추세">
      <Line data={data} options={options} />
    </ChartCard>
  );
}

// 2. 월별 차트 (Bar)
export function MonthlyChart({ monthlyData, selectedYear }: { monthlyData: AccData[], selectedYear: number }) {
  const yearData = monthlyData.filter(d => d.year === selectedYear);
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return yearData.find(d => d.month === month) || { month, accident_count: 0, casualty_count: 0, fatality_count: 0 };
  });

  const data = {
    labels: monthlyStats.map(d => `${d.month}월`),
    datasets: [
      {
        label: '사고',
        data: monthlyStats.map(d => d.accident_count),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
      {
        label: '사상자',
        data: monthlyStats.map(d => d.casualty_count),
        backgroundColor: '#fbbf24',
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { boxWidth: 12, usePointStyle: true } },
    },
  };

  return (
    <ChartCard title={`${selectedYear}년 월별 사고 현황`}>
      <Bar data={data} options={options} />
    </ChartCard>
  );
}

// 3. 사고 유형별 현황 (Horizontal Bar)
export function AccidentTypeChart({ yearlyData }: { yearlyData: AccData[] }) {
  if (yearlyData.length === 0) return null;

  const total = yearlyData.reduce((acc, curr) => ({
    fatality_count: acc.fatality_count + curr.fatality_count,
    serious_injury_count: acc.serious_injury_count + curr.serious_injury_count,
    minor_injury_count: acc.minor_injury_count + curr.minor_injury_count,
    reported_injury_count: acc.reported_injury_count + curr.reported_injury_count,
  }), { fatality_count: 0, serious_injury_count: 0, minor_injury_count: 0, reported_injury_count: 0 });

  const data = {
    labels: ['사망', '중상', '경상', '부상신고'],
    datasets: [
      {
        data: [total.fatality_count, total.serious_injury_count, total.minor_injury_count, total.reported_injury_count],
        backgroundColor: ['#f43f5e', '#fb923c', '#fbbf24', '#22c55e'],
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const, // 가로 막대 차트로 변경하여 모던함 강조
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
      y: { grid: { display: false }, ticks: { color: '#475569', font: { weight: 'bold' } } }
    },
  };

  return (
    <ChartCard title="누적 사고 유형별 비중">
      <Bar data={data} options={options} />
    </ChartCard>
  );
}