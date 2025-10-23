import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AttemptDetail } from '../types';

interface Props {
  attempt: AttemptDetail;
  onClose: () => void;
  onScoreUpdate: (id: number, score: number, note?: string) => Promise<void>;
  onNoteAdd: (id: number, note: string) => Promise<void>;
}

const AttemptDetailModal = ({ attempt, onClose, onScoreUpdate, onNoteAdd }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [newScore, setNewScore] = useState(attempt.score);
  const [scoreNote, setScoreNote] = useState('');
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setNewScore(attempt.score);
  }, [attempt.score]);

  useEffect(() => {
    setEditMode(false);
    setScoreNote('');
    setNoteText('');
  }, [attempt.id]);

  const handleScoreSubmit = async () => {
    if (newScore < 0 || newScore > attempt.maxScore) {
      alert(`คะแนนต้องอยู่ระหว่าง 0 ถึง ${attempt.maxScore}`);
      return;
    }

    setSubmitting(true);
    try {
      await onScoreUpdate(attempt.id, newScore, scoreNote || undefined);
      setEditMode(false);
      setScoreNote('');
    } catch (err) {
      alert('ไม่สามารถบันทึกคะแนนได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNoteSubmit = async () => {
    if (!noteText.trim()) return;

    setSubmitting(true);
    try {
      await onNoteAdd(attempt.id, noteText);
      setNoteText('');
    } catch (err) {
      alert('ไม่สามารถบันทึกหมายเหตุได้');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>รายละเอียดการทำแบบทดสอบ</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>ข้อมูลผู้เรียน และแบบทดสอบ</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">ผู้เรียน</div>
                <div className="detail-value">{attempt.student.name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">อีเมล</div>
                <div className="detail-value">{attempt.student.email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">แบบทดสอบ</div>
                <div className="detail-value">{attempt.quiz.title}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">วันที่เริ่มทำ</div>
                <div className="detail-value">
                  {format(new Date(attempt.startedAt), 'dd MMM yyyy HH:mm')}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">วันที่สำเร็จ</div>
                <div className="detail-value">
                  {attempt.completedAt ? format(new Date(attempt.completedAt), 'dd MMM yyyy HH:mm') : 'ยังไม่เสร็จ'}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">สถานะ</div>
                <div className="detail-value">
                  <span className={`status-badge status-${attempt.status}`}>
                    {attempt.status === 'completed' ? 'เสร็จสมบูรณ์' : 'ระหว่างทำ'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>คะแนน</h3>
              {!editMode && (
                <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                  แก้ไขคะแนน
                </button>
              )}
            </div>

            {!editMode ? (
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">คะแนนที่ได้</div>
                  <div className="detail-value" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {attempt.score}/{attempt.maxScore}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">เปอร์เซ็นต์</div>
                  <div className="detail-value" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {Math.round(attempt.percentage)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="score">คะแนนใหม่ (สูงสุด {attempt.maxScore})</label>
                  <input
                    id="score"
                    type="number"
                    min={0}
                    max={attempt.maxScore}
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="scoreNote">เหตุผลการแก้ไขคะแนน</label>
                  <textarea
                    id="scoreNote"
                    value={scoreNote}
                    onChange={(e) => setScoreNote(e.target.value)}
                    placeholder="ระบุเหตุผลในการแก้ไขคะแนน (ถ้ามี)"
                  />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)} disabled={submitting}>
                    ยกเลิก
                  </button>
                  <button className="btn btn-success" onClick={handleScoreSubmit} disabled={submitting}>
                    {submitting ? 'กำลังบันทึก...' : 'บันทึกคะแนน'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>คำตอบของผู้เรียน</h3>
            {attempt.answers.map(answer => (
              <div key={answer.id} className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question">{answer.question}</div>
                <div className="answer-row">
                  <span className="answer-label">คำตอบของผู้เรียน:</span>
                  <span className="answer-value">{answer.learnerAnswer || 'ไม่ได้ตอบ'}</span>
                </div>
                <div className="answer-row">
                  <span className="answer-label">คำตอบที่ถูกต้อง:</span>
                  <span className="answer-value">{answer.correctAnswer || 'ไม่ระบุ'}</span>
                </div>
                <div className="answer-row">
                  <span className="answer-label">สถานะ:</span>
                  <span className="answer-value" style={{ fontWeight: 600, color: answer.isCorrect ? '#10b981' : '#ef4444' }}>
                    {answer.isCorrect ? '✓ ถูกต้อง' : '✗ ผิด'}
                  </span>
                </div>
                <div className="answer-row">
                  <span className="answer-label">คะแนนที่ได้:</span>
                  <span className="points">{answer.points}/{answer.maxPoints}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-section">
            <h3>ประวัติการแก้ไข (Audit Log)</h3>

            <div className="edit-form" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="newNote">เพิ่มหมายเหตุใหม่</label>
                <textarea
                  id="newNote"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="ระบุหมายเหตุ..."
                />
              </div>
              <div className="form-actions">
                <button className="btn btn-success" onClick={handleNoteSubmit} disabled={submitting || !noteText.trim()}>
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกหมายเหตุ'}
                </button>
              </div>
            </div>

            {attempt.auditLog.length === 0 ? (
              <div className="empty-state">ยังไม่มีประวัติการแก้ไข</div>
            ) : (
              <div className="audit-log">
                {attempt.auditLog.map(log => (
                  <div key={log.id} className="audit-entry">
                    <div className="audit-header">
                      <span className="audit-action">
                        {log.action === 'score_updated' ? '🔄 ปรับแก้คะแนน' : '📝 เพิ่มหมายเหตุ'}
                      </span>
                      <span className="audit-time">
                        {format(new Date(log.createdAt), 'dd MMM yyyy HH:mm')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>โดย: {log.actor}</div>
                    {log.action === 'score_updated' && (
                      <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        คะแนน: <strong>{log.previousScore}</strong> → <strong>{log.newScore}</strong>
                      </div>
                    )}
                    {log.note && <div className="audit-note">{log.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptDetailModal;
