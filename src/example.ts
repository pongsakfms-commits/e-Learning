import './environment';
import getGoogleSheetsConfig from './config/googleSheetsConfig';
import GoogleSheetsService from './services/googleSheetsService';
import QueueService from './services/queueService';
import { LearnerScorePayload } from './types';
import logger from './utils/logger';

async function example() {
  try {
    const config = getGoogleSheetsConfig();
    const googleSheetsService = new GoogleSheetsService(config);
    const queueService = new QueueService(
      googleSheetsService,
      config.maxRetryAttempts,
      config.retryInitialDelayMs
    );

    const learnerScorePayload: LearnerScorePayload = {
      learner: {
        id: 'learner-001',
        name: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        metadata: {
          grade: '6',
          school: 'โรงเรียนตัวอย่าง'
        }
      },
      activity: {
        id: 'activity-001',
        title: 'แบบทดสอบคณิตศาสตร์ บทที่ 1',
        metadata: {
          subject: 'คณิตศาสตร์',
          chapter: 1
        }
      },
      score: {
        value: 85,
        max: 100,
        grade: 'A',
        metadata: {
          timeSpent: 1200,
          attempts: 1
        }
      },
      completedAt: new Date()
    };

    logger.info('Saving learner result to Google Sheets...');
    await queueService.addToQueue(learnerScorePayload);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const status = queueService.getQueueStatus();
    logger.info('Queue status', status);

    logger.info('Example completed successfully');
  } catch (error) {
    logger.error('Example failed', { error });
    process.exit(1);
  }
}

example();
