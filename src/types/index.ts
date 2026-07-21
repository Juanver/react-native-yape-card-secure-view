export type CloseReason = 'USER_DISMISS' | 'TIMEOUT' | 'SYSTEM_BACKGROUND';
export type ValidationErrorCode =
  'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'SIGNATURE_MISMATCH';

export interface SecureViewEvents {
  onSecureViewOpened: { cardId: string };
  onValidationError: { code: ValidationErrorCode; message: string };
  onCardDataShown: { cardId: string };
  onSecureViewClosed: { cardId: string; reason: CloseReason };
}
