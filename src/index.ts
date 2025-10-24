import './environment';
import getGoogleSheetsConfig from './config/googleSheetsConfig';
import GoogleSheetsService from './services/googleSheetsService';
import QueueService from './services/queueService';
import { LearnerScorePayload } from './types';

const config = getGoogleSheetsConfig();
const googleSheetsService = new GoogleSheetsService(config);
const queueService = new QueueService(googleSheetsService, config.maxRetryAttempts, config.retryInitialDelayMs);

export const saveLearnerResult = async (payload: LearnerScorePayload): Promise<void> => {
  await queueService.addToQueue(payload);
};

export const getQueueStatus = () => queueService.getQueueStatus();
