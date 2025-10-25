import React from 'react';
import { DashboardFilterState } from '../types/dashboard';
import { EXAM_TYPES } from '../utils/examTypes';

interface DashboardFiltersProps {
  filters: DashboardFilterState;
  onFilterChange: (filters: DashboardFilterState) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ filters, onFilterChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, startDate: e.target.value || undefined });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, endDate: e.target.value || undefined });
  };

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, examType: e.target.value || undefined });
  };

  return (
    <div className="dashboard-filters">
      <h3>🔍 ตัวกรองข้อมูล</h3>
      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="startDate">วันที่เริ่มต้น:</label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate || ''}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="endDate">วันที่สิ้นสุด:</label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate || ''}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="examType">ประเภทแบบทดสอบ:</label>
          <select
            id="examType"
            value={filters.examType || ''}
            onChange={handleExamTypeChange}
          >
            {EXAM_TYPES.map(type => (
              <option key={type.value || 'all'} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
