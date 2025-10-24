import '../environment';
import { GoogleSheetsConfig } from '../types';
import logger from '../utils/logger';

function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables');
  }

  if (!serviceAccountEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in environment variables');
  }

  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY is not set in environment variables');
  }

  const config: GoogleSheetsConfig = {
    spreadsheetId,
    worksheetLearnerData: process.env.SHEET_NAME_LEARNER_DATA || 'LearnerData',
    worksheetScores: process.env.SHEET_NAME_SCORES || 'Scores',
    serviceAccountEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
    maxRetryAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3', 10),
    retryInitialDelayMs: parseInt(process.env.RETRY_INITIAL_DELAY_MS || '1000', 10)
  };

  logger.info('Google Sheets config loaded successfully', {
    spreadsheetId: config.spreadsheetId,
    worksheetLearnerData: config.worksheetLearnerData,
    worksheetScores: config.worksheetScores,
    maxRetryAttempts: config.maxRetryAttempts
  });

  return config;
}

export default getGoogleSheetsConfig;
