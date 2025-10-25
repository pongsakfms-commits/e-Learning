import React from 'react';
import { DashboardMetrics } from '../types/dashboard';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

const formatNumber = (value: number | null): string => {
  if (value === null) return 'N/A';
  return value.toFixed(2);
};

const formatPercent = (value: number | null): string => {
  if (value === null) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <>
      <div className="metrics-section">
        <h3>📊 ข้อมูลรวม (Totals)</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">จำนวนผู้เรียนทั้งหมด</div>
            <div className="metric-value">{metrics.totals.totalLearners}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ผู้เรียนที่มีผลสอบ (Filtered)</div>
            <div className="metric-value">{metrics.totals.filteredLearners}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ผู้เรียนที่ผ่านข้อสอบ</div>
            <div className="metric-value">{metrics.totals.learnersCompletedExam}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">จำนวนครั้งทำข้อสอบ</div>
            <div className="metric-value">{metrics.totals.attempts}</div>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h3>🎯 สถิติคะแนน (Scores)</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">ค่าเฉลี่ย (Average)</div>
            <div className="metric-value">{formatNumber(metrics.scores.average)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">มัธยฐาน (Median)</div>
            <div className="metric-value">{formatNumber(metrics.scores.median)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ส่วนเบี่ยงเบนมาตรฐาน (SD)</div>
            <div className="metric-value">{formatNumber(metrics.scores.standardDeviation)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Min / Max</div>
            <div className="metric-value">
              {formatNumber(metrics.scores.min)} / {formatNumber(metrics.scores.max)}
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h3>✅ อัตราการผ่าน (Pass Ratio)</h3>
        <div className="metric-card-large">
          <div className="metric-value-large">{formatPercent(metrics.passRatio)}</div>
        </div>
      </div>

      <div className="metrics-section">
        <h3>🏆 ระดับความสามารถ (Proficiency Levels)</h3>
        <div className="metrics-grid">
          {Object.entries(metrics.proficiencyLevels).map(([level, count]) => (
            <div key={level} className="metric-card">
              <div className="metric-label">{level}</div>
              <div className="metric-value">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
