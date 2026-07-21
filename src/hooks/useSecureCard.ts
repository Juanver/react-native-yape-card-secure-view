import { useState, useEffect, useCallback } from 'react';
import NativeYapeCardSecureView from '../NativeYapeCardSecureView';
import { YapeCardSecureViewEmitter } from '../events/YapeCardSecureViewEmitter';
import type { ValidationErrorCode } from '../types';

interface UseSecureCardStatus {
  isOpen: boolean;
  isRendering: boolean;
  error: { code: ValidationErrorCode; message: string } | null;
}

export const useSecureCard = () => {
  const [status, setStatus] = useState<UseSecureCardStatus>({
    isOpen: false,
    isRendering: false,
    error: null,
  });

  useEffect(() => {
    const openedSub = YapeCardSecureViewEmitter.addListener(
      'onSecureViewOpened',
      () => {
        setStatus((prev) => ({
          ...prev,
          isOpen: true,
          isRendering: true,
          error: null,
        }));
      }
    );

    const shownSub = YapeCardSecureViewEmitter.addListener(
      'onCardDataShown',
      () => {
        setStatus((prev) => ({ ...prev, isRendering: false }));
      }
    );

    const errorSub = YapeCardSecureViewEmitter.addListener(
      'onValidationError',
      (err) => {
        setStatus((prev) => ({
          ...prev,
          isOpen: false,
          isRendering: false,
          error: err,
        }));
      }
    );

    const closedSub = YapeCardSecureViewEmitter.addListener(
      'onSecureViewClosed',
      () => {
        setStatus({ isOpen: false, isRendering: false, error: null });
      }
    );

    return () => {
      openedSub.remove();
      shownSub.remove();
      errorSub.remove();
      closedSub.remove();
    };
  }, []);

  const openCard = useCallback(async (cardId: string, secureToken: string) => {
    try {
      setStatus((prev) => ({ ...prev, error: null }));
      await NativeYapeCardSecureView.openSecureView(cardId, secureToken);
    } catch (error: any) {
      setStatus((prev) => ({
        ...prev,
        error: {
          code: 'TOKEN_INVALID',
          message: error?.message || 'Error desconocido',
        },
      }));
    }
  }, []);

  const closeCard = useCallback(() => {
    NativeYapeCardSecureView.closeSecureView();
  }, []);

  return {
    ...status,
    openCard,
    closeCard,
  };
};
