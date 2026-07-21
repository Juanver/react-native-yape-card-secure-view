import NativeYapeCardSecureView from './NativeYapeCardSecureView';
import { YapeCardSecureViewEmitter } from './events/YapeCardSecureViewEmitter';
import type {
  SecureViewEvents,
  ValidationErrorCode,
  CloseReason,
} from './types';

export const openSecureCardView = async (
  cardId: string,
  secureToken: string
): Promise<boolean> => {
  return await NativeYapeCardSecureView.openSecureView(cardId, secureToken);
};

export { YapeCardSecureViewEmitter };
export type { SecureViewEvents, ValidationErrorCode, CloseReason };
export { useSecureCard } from './hooks/useSecureCard';
export * from './types';
