import React, { useState } from 'react';
import './styles.css';
import { DashboardFilterState } from './types/dashboard';
import { DashboardFilters } from './components/DashboardFilters';
import { useDashboard } from './hooks/useDashboard';
import { MetricsCards } from './components/MetricsCards';
import { ScoreDistributionChart } from './components/ScoreDistributionChart';
import { ProficiencyChart } from './components/ProficiencyChart';

const App: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilterState>({});
  const { metrics, loading, error } = useDashboard(filters);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>แดชบอร์ดภาพรวมสำหรับแอดมิน</h1>
        <p>
          วิเคราะห์ผลการเรียนรู้ของผู้เรียนแบบเรียลไทม์ พร้อมตัวชี้วัดเชิงลึกและการกรองตามเวลา/ประเภทแบบทดสอบ
        </p>
      </header>

      <DashboardFilters filters={filters} onFilterChange={setFilters} />

      {loading && <div className="status">กำลังโหลดข้อมูล...</div>}
      {error && <div className="status error">เกิดข้อผิดพลาด: {error}</div>}

      {metrics && !loading && !error && (
        <>
          <MetricsCards metrics={metrics} />

          <section className="charts-section">
            <ScoreDistributionChart distribution={metrics.scoreDistribution} />
            <ProficiencyChart proficiencyLevels={metrics.proficiencyLevels} />
          </section>
        </>
      )}
    </div>
  );
};

export default App;
