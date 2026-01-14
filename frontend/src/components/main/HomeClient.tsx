'use client'

import Link from "next/link";
import FeatureCard from "./FeatureCard";
import { useInView } from "@/hooks/useInView";

export default function HomeClient() {
  const { ref: featureRef, inView: featureInView } = useInView<HTMLDivElement>();
  const { ref: stackRef, inView: stackInView } = useInView<HTMLDivElement>();
  const { ref: ctaRef, inView: ctaInView } = useInView<HTMLDivElement>();

  return (
    <div className="min-h-screen w-full">
      <main className="container mx-auto px-4">

        {/* Hero: 첫 로딩 화면 중앙 고정 */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-2xl">
          

          <div className="relative text-center w-full">
            <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow">
              보행자 교통안전 분석 대시보드
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto drop-shadow">
              전국 보행자 사고 데이터와 교통 시설 정보를 통합한 데이터 기반 교통 안전 분석 플랫폼
            </p>

            <div className="mt-10 bg-white lg:max-w-4xl mx-auto px-6 py-8 rounded-xl shadow-sm backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">프로젝트 목적</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                이 프로젝트는 월별 사고 데이터와 횡단보도·신호등 시설 정보를 결합하여 보행자 안전 지수를 평가하고
                신호등 설치 및 기능 개선의 우선순위를 정량적으로 제시하는 것을 목표로 합니다.
              </p>
            </div>

            {/* 스크롤 유도 */}
            <div className="mt-12 text-white/70 text-sm">↓ 스크롤하여 자세히 보기</div>
          </div>
        </section>

        {/* 주요 기능: 스크롤 시 등장 */}
        <section
          ref={featureRef}
          className={`pb-16 transition-all duration-700 ease-out ${featureInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-4xl mx-auto">
            <FeatureCard icon="/globe.svg" title="인터랙티브 지도 분석">
              <ul className="list-disc list-inside">
                <li>전국 → 시도 → 시군구 3단계 확대 지도</li>
                <li>월별 보행자 사고 분포 시각화</li>
                <li>사고 다발지역(Hotspot) 히트맵 표시</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="/window.svg" title="KPI 중심 대시보드">
              <ul className="list-disc list-inside">
                <li>신호등 설치율 및 사고 감소율</li>
                <li>시설 취약도 기반 안전 지수</li>
                <li>지역 간 비교 및 월별 트렌드 분석</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="/file.svg" title="신호등·횡단보도 시설 분석">
              <ul className="list-disc list-inside">
                <li>음향신호기 등 편의시설 설치 현황</li>
                <li>시설 취약성+사고 위험도 결합 분석</li>
                <li>개선 필요 시설 자동 추천</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="/file.svg" title="시민 참여형 건의 시스템">
              <ul className="list-disc list-inside">
                <li>지도 기반 신호등 설치 건의</li>
                <li>주변 사고 이력 자동 첨부</li>
                <li>관리자 검토·처리 상태 추적</li>
              </ul>
            </FeatureCard>
          </div>
        </section>

        {/* 기술 스택: 스크롤 시 등장 */}
        <section
          ref={stackRef}
          className={`pb-16 transition-all duration-700 ease-out delay-100 ${stackInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">기술 스택</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-4xl mx-auto">
            <FeatureCard icon="/frontend.svg" title="프론트엔드 구성">
              <ul className="list-disc list-inside">
                <li>Next.js 16(App Router)</li>
                <li>React + TypeScript</li>
                <li>Leaflet - 인터랙티브 지도</li>
                <li>Chart.js / D3.js - 통계·트렌드 시각화</li>
                <li>Tailwind CSS - 반응형 UI</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="/backend.svg" title="백엔드 구성">
              <ul className="list-disc list-inside">
                <li>Spring Boot 3.5.8</li>
                <li>Spring Data JPA</li>
                <li>RESTful API</li>
                <li>MySQL 8</li>
                <li>OAuth2 기반 인증</li>
              </ul>
            </FeatureCard>
          </div>
        </section>

        {/* CTA: 스크롤 시 등장 */}
        <section
          ref={ctaRef}
          className={`text-center py-20 transition-all duration-700 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-xl inline-block"
          >
            대시보드 바로가기
          </Link>
        </section>

      </main>
    </div>
  );
}
