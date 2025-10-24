import '../environment';
import getGoogleSheetsConfig from '../config/googleSheetsConfig';
import GoogleSheetsService from '../services/googleSheetsService';
import QueueService from '../services/queueService';
import { LearnerScorePayload } from '../types';
import logger from '../utils/logger';

async function testIntegration() {
  logger.info('Starting integration test...');

  try {
    const config = getGoogleSheetsConfig();
    logger.info('Config loaded successfully');

    const googleSheetsService = new GoogleSheetsService(config);
    logger.info('Google Sheets service initialized');

    const queueService = new QueueService(
      googleSheetsService,
      config.maxRetryAttempts,
      config.retryInitialDelayMs
    );
    logger.info('Queue service initialized');

    const testPayload: LearnerScorePayload = {
      learner: {
        id: `test-learner-${Date.now()}`,
        name: 'Test User',
        email: 'test@example.com',
        metadata: {
          testRun: true,
          timestamp: Date.now()
        }
      },
      activity: {
        id: `test-activity-${Date.now()}`,
        title: 'Integration Test Activity',
        metadata: {
          type: 'test'
        }
      },
      score: {
        value: 100,
        max: 100,
        grade: 'A+',
        metadata: {
          testScore: true
        }
      },
      completedAt: new Date()
    };

    logger.info('Adding test payload to queue...');
    await queueService.addToQueue(testPayload);

    await new Promise(resolve => setTimeout(resolve, 5000));

    const status = queueService.getQueueStatus();
    logger.info('Queue status after processing', status);

    if (status.length === 0) {
      logger.info('✅ Integration test PASSED - Queue is empty, data was processed successfully');
    } else {
      logger.warn('⚠️ Integration test WARNING - Queue still has items', status);
    }
  } catch (error) {
    logger.error('❌ Integration test FAILED', { error });
    throw error;
  }
}

if (require.main === module) {
  testIntegration()
    .then(() => {
      logger.info('Integration test completed');
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

export default testIntegration;
