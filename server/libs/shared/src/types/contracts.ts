import { Topics } from '../topics';

export type ContractMetadata = {
  messageId?: string;
  correlationId?: string;
  replyTo?: Topics;
};
