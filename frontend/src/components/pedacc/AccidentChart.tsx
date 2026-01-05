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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type YearlyData = {
  year: number;
  accident_count: number;
  casualty_count: number;
  fatality_count: number;
  serious_injury_count: number;
  minor_injury_count: number;
  reported_injury_count: number;
};

type MonthlyData = {
  year: number;
  month: number;
  accident_count: number;
  casualty_count: number;
  fatality_count: number;
  serious_injury_count: number;
  minor_injury_count: number;
  reported_injury_count: number;
};

interface AccidentChartProps {
  yearlyData: YearlyData[];
  monthlyData: MonthlyData[];
  selectedYear: number | null;
}

export function YearlyTrendChart({ yearlyData }: { yearlyData: YearlyData[] }) {
  const data = {
    labels: yearlyData.map(d => `${d.year}년`),
    datasets: [
      {
        label: '사고',
        data: yearlyData.map(d => d.accident_count),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
      {
        label: '사상자',
        data: yearlyData.map(d => d.casualty_count),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
      {
        label: '사망',
        data: yearlyData.map(d => d.fatality_count),
        borderColor: 'rgb(220, 38, 127)',
        backgroundColor: 'rgba(220, 38, 127, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '연도별 사고 추세',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}

export function MonthlyChart({ monthlyData, selectedYear }: { monthlyData: MonthlyData[], selectedYear: number }) {
  const yearData = monthlyData.filter(d => d.year === selectedYear);
  
  // 1-12월 데이터 준비
  const monthlyStats = [];
  for (let month = 1; month <= 12; month++) {
    const monthData = yearData.find(d => d.month === month);
    monthlyStats.push(monthData || {
      year: selectedYear,
      month,
      accident_count: 0,
      casualty_count: 0,
      fatality_count: 0,
      serious_injury_count: 0,
      minor_injury_count: 0,
      reported_injury_count: 0,
    });
  }

  const data = {
    labels: monthlyStats.map(d => `${d.month}월`),
    datasets: [
      {
        label: '사고',
        data: monthlyStats.map(d => d.accident_count),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: '사상자',
        data: monthlyStats.map(d => d.casualty_count),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
      {
        label: '사망',
        data: monthlyStats.map(d => d.fatality_count),
        backgroundColor: 'rgba(220, 38, 127, 0.8)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedYear}년 월별 사고 현황`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export function AccidentTypeChart({ yearlyData }: { yearlyData: YearlyData[] }) {
  if (yearlyData.length === 0) return null;

  // 전체 기간 합계
  const total = yearlyData.reduce((acc, curr) => ({
    accident_count: acc.accident_count + curr.accident_count,
    casualty_count: acc.casualty_count + curr.casualty_count,
    fatality_count: acc.fatality_count + curr.fatality_count,
    serious_injury_count: acc.serious_injury_count + curr.serious_injury_count,
    minor_injury_count: acc.minor_injury_count + curr.minor_injury_count,
    reported_injury_count: acc.reported_injury_count + curr.reported_injury_count,
  }), {
    accident_count: 0,
    casualty_count: 0,
    fatality_count: 0,
    serious_injury_count: 0,
    minor_injury_count: 0,
    reported_injury_count: 0,
  });

  const data = {
    labels: ['사망', '중상', '경상', '부상신고'],
    datasets: [
      {
        data: [
          total.fatality_count,
          total.serious_injury_count,
          total.minor_injury_count,
          total.reported_injury_count,
        ],
        backgroundColor: [
          'rgba(220, 38, 127, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(220, 38, 127, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '사고 유형별 현황',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}