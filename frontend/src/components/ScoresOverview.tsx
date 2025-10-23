import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { getAttempts, getAttemptDetail, getStudents, getQuizzes, updateScore, addNote } from '../api';
import { AttemptDetail, AttemptSummary, Student, Quiz } from '../types';
import AttemptDetailModal from './AttemptDetailModal';

interface Filters {
  studentId?: number;
  quizId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const ScoresOverview = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [selectedAttemptDetail, setSelectedAttemptDetail] = useState<AttemptDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    getStudents().then(setStudents).catch(() => setError('ไม่สามารถโหลดข้อมูลผู้เรียนได้'));
    getQuizzes().then(setQuizzes).catch(() => setError('ไม่สามารถโหลดข้อมูลแบบทดสอบได้'));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAttempts(filters)
      .then(setAttempts)
      .catch(() => setError('ไม่สามารถโหลดข้อมูลคะแนนได้'))
      .finally(() => setLoading(false));
  }, [filters, refreshFlag]);

  useEffect(() => {
    if (selectedAttemptId == null) {
      setSelectedAttemptDetail(null);
      return;
    }

    getAttemptDetail(selectedAttemptId)
      .then(setSelectedAttemptDetail)
      .catch(() => setError('ไม่สามารถโหลดรายละเอียดของการทำแบบทดสอบได้'));
  }, [selectedAttemptId, refreshFlag]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (value === '' || value === 'all') {
        delete next[field];
      } else if (field === 'studentId' || field === 'quizId') {
        next[field] = Number(value);
      } else {
        next[field] = value;
      }
      return next;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const openAttempt = (id: number) => {
    setSelectedAttemptId(id);
  };

  const closeModal = () => {
    setSelectedAttemptId(null);
  };

  const handleScoreUpdate = async (id: number, newScore: number, note?: string) => {
    await updateScore(id, newScore, note);
    setRefreshFlag(flag => flag + 1);
  };

  const handleNoteAdd = async (id: number, note: string) => {
    await addNote(id, note);
    setRefreshFlag(flag => flag + 1);
  };

  const downloadReport = (studentId: number, studentName: string) => {
    const safeName = studentName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]+/g, '-');
    const link = document.createElement('a');
    link.href = `/api/admin/report/${studentId}/export`;
    link.download = `${safeName}-report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = useMemo(() => students, [students]);
  const filteredQuizzes = useMemo(() => quizzes, [quizzes]);

  return (
    <div className="container">
      <section className="filters-section">
        <h2>ภาพรวมคะแนนสอบ</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="student">ผู้เรียน</label>
            <select
              id="student"
              value={filters.studentId ?? 'all'}
              onChange={(event) => handleFilterChange('studentId', event.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="quiz">แบบทดสอบ</label>
            <select
              id="quiz"
              value={filters.quizId ?? 'all'}
              onChange={(event) => handleFilterChange('quizId', event.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              {filteredQuizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="startDate">เริ่มวันที่</label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate ?? ''}
              onChange={(event) => handleFilterChange('startDate', event.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="endDate">ถึงวันที่</label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate ?? ''}
              onChange={(event) => handleFilterChange('endDate', event.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="search">ค้นหาจากชื่อ/อีเมล</label>
            <input
              id="search"
              type="text"
              placeholder="ระบุคำค้น..."
              value={filters.search ?? ''}
              onChange={(event) => handleFilterChange('search', event.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={clearFilters}>ล้างตัวกรอง</button>
        </div>
      </section>

      <section className="attempts-table">
        <div style={{ display: 'flex', padding: '1.5rem', borderBottom: '1px solid #eee', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>ผลการทำแบบทดสอบ ({attempts.length})</h2>
          {filters.studentId && (
            <button
              className="btn btn-success"
              onClick={() => {
                const student = students.find(s => s.id === filters.studentId);
                if (student) {
                  downloadReport(student.id, student.name);
                }
              }}
            >
              ดาวน์โหลดรายงานผู้เรียน
            </button>
          )}
        </div>

        {loading && <div className="loading">กำลังโหลดข้อมูล...</div>}
        {error && <div className="loading" style={{ color: '#dc2626' }}>{error}</div>}
        {!loading && attempts.length === 0 && !error && (
          <div className="empty-state">ยังไม่มีข้อมูลการทำแบบทดสอบตามตัวกรองที่เลือก</div>
        )}

        {!loading && attempts.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ผู้เรียน</th>
                <th>แบบทดสอบ</th>
                <th>วันที่ทำ</th>
                <th>คะแนน</th>
                <th>หมายเหตุล่าสุด</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map(attempt => {
                const percentage = Math.round(attempt.percentage);
                let scoreClass = 'score-high';
                if (percentage < 50) scoreClass = 'score-low';
                else if (percentage < 75) scoreClass = 'score-medium';

                return (
                  <tr key={attempt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{attempt.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{attempt.studentEmail}</div>
                    </td>
                    <td>
                      <div>{attempt.quizTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Attempt #{attempt.attemptCount}</div>
                    </td>
                    <td>{format(new Date(attempt.startedAt), 'dd MMM yyyy HH:mm')}</td>
                    <td>
                      <div className={`score-display ${scoreClass}`}>
                        {attempt.score}/{attempt.maxScore} ({percentage}%)
                      </div>
                      <div>
                        <span className={`status-badge status-${attempt.status}`}>
                          {attempt.status === 'completed' ? 'เสร็จสมบูรณ์' : 'ระหว่างทำ'}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#374151' }}>
                      {attempt.lastAuditNote ? (
                        <>
                          <div>{attempt.lastAuditNote}</div>
                          {attempt.lastAuditAt && (
                            <div style={{ color: '#6b7280' }}>
                              {format(new Date(attempt.lastAuditAt), 'dd MMM yyyy HH:mm')}
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>ไม่มีบันทึกหมายเหตุ</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={() => openAttempt(attempt.id)}>
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {selectedAttemptId && selectedAttemptDetail && (
        <AttemptDetailModal
          attempt={selectedAttemptDetail}
          onClose={closeModal}
          onScoreUpdate={handleScoreUpdate}
          onNoteAdd={handleNoteAdd}
        />
      )}
    </div>
  );
};

export default ScoresOverview;
