import { google, sheets_v4 } from 'googleapis';
import pRetry from 'p-retry';
import { GoogleSheetsConfig, Learner, LearnerScorePayload } from '../types';
import logger from '../utils/logger';

class GoogleSheetsService {
  private readonly sheetsClient: sheets_v4.Sheets;

  constructor(private readonly config: GoogleSheetsConfig) {
    const auth = new google.auth.JWT({
      email: config.serviceAccountEmail,
      key: config.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheetsClient = google.sheets({ version: 'v4', auth });
  }

  private getRetryCount(): number {
    return Math.max(this.config.maxRetryAttempts - 1, 0);
  }

  private async appendRows(range: string, values: string[][]): Promise<void> {
    const retries = this.getRetryCount();

    await pRetry(
      () =>
        this.sheetsClient.spreadsheets.values.append({
          spreadsheetId: this.config.spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values
          }
        }),
      {
        retries,
        minTimeout: this.config.retryInitialDelayMs,
        factor: 2,
        onFailedAttempt: error => {
          logger.warn(`Google Sheets append attempt ${error.attemptNumber} failed.`, {
            attemptsLeft: error.retriesLeft,
            error: error.message,
            range
          });
        }
      }
    );
  }

  async appendLearnerData(learner: Learner): Promise<void> {
    const row = [
      learner.id,
      learner.name,
      learner.email ?? '',
      learner.metadata ? JSON.stringify(learner.metadata) : ''
    ];

    await this.appendRows(`${this.config.worksheetLearnerData}!A:D`, [row]);

    logger.info('Learner data appended successfully', { learnerId: learner.id });
  }

  async appendLearnerScore(payload: LearnerScorePayload): Promise<void> {
    const row = [
      payload.learner.id,
      payload.learner.name,
      payload.learner.email ?? '',
      payload.activity.id,
      payload.activity.title,
      String(payload.score.value),
      payload.score.max !== undefined ? String(payload.score.max) : '',
      payload.score.grade ?? '',
      payload.completedAt.toISOString(),
      payload.learner.metadata ? JSON.stringify(payload.learner.metadata) : '',
      payload.activity.metadata ? JSON.stringify(payload.activity.metadata) : '',
      payload.score.metadata ? JSON.stringify(payload.score.metadata) : ''
    ];

    await this.appendRows(`${this.config.worksheetScores}!A:L`, [row]);

    logger.info('Learner score appended successfully', {
      learnerId: payload.learner.id,
      activityId: payload.activity.id
    });
  }
}

export default GoogleSheetsService;
