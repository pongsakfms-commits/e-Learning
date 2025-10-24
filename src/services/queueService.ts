import { LearnerScorePayload } from '../types';
import logger from '../utils/logger';
import GoogleSheetsService from './googleSheetsService';

interface QueueItem {
  id: string;
  payload: LearnerScorePayload;
  attempts: number;
  nextRetryAt: Date;
  error?: string;
}

class QueueService {
  private queue: QueueItem[] = [];
  private googleSheetsService: GoogleSheetsService;
  private isProcessing: boolean = false;
  private maxAttempts: number = 5;
  private retryDelayMs: number = 5000;

  constructor(googleSheetsService: GoogleSheetsService, maxAttempts: number = 5, retryDelayMs: number = 5000) {
    this.googleSheetsService = googleSheetsService;
    this.maxAttempts = maxAttempts;
    this.retryDelayMs = retryDelayMs;
  }

  async addToQueue(payload: LearnerScorePayload): Promise<void> {
    const item: QueueItem = {
      id: `${payload.learner.id}-${payload.activity.id}-${Date.now()}`,
      payload,
      attempts: 0,
      nextRetryAt: new Date()
    };

    this.queue.push(item);
    logger.info('Item added to queue', { itemId: item.id, queueLength: this.queue.length });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      if (new Date() < item.nextRetryAt) {
        await this.sleep(item.nextRetryAt.getTime() - Date.now());
      }

      try {
        await this.googleSheetsService.appendLearnerScore(item.payload);
        this.queue.shift();
        logger.info('Queue item processed successfully', { itemId: item.id });
      } catch (error) {
        item.attempts += 1;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        item.error = errorMessage;

        logger.error('Failed to process queue item', {
          itemId: item.id,
          attempts: item.attempts,
          error: errorMessage
        });

        if (item.attempts >= this.maxAttempts) {
          logger.error('Queue item exceeded max retry attempts, removing from queue', {
            itemId: item.id,
            payload: item.payload
          });
          this.queue.shift();
        } else {
          const delay = this.retryDelayMs * Math.pow(2, item.attempts - 1);
          item.nextRetryAt = new Date(Date.now() + delay);
          logger.info('Queue item scheduled for retry', {
            itemId: item.id,
            nextRetryAt: item.nextRetryAt,
            delayMs: delay
          });
          this.queue.shift();
          this.queue.push(item);
        }
      }
    }

    this.isProcessing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getQueueStatus(): { length: number; items: QueueItem[] } {
    return {
      length: this.queue.length,
      items: this.queue.map(item => ({ ...item }))
    };
  }
}

export default QueueService;
