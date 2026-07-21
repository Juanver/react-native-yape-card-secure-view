import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, AppState } from 'react-native';
import NativeYapeCardSecureView from '../NativeYapeCardSecureView';
import { YapeCardSecureViewEmitter } from '../events/YapeCardSecureViewEmitter';
import type { ValidationErrorCode } from '../types';

interface UseSecureCardStatus {
  isOpen: boolean;
  isRendering: boolean;
  error: { code: ValidationErrorCode; message: string } | null;
}

const SESSION_TIMEOUT_MS = 30000;

export const useSecureCard = () => {
  const [status, setStatus] = useState<UseSecureCardStatus>({
    isOpen: false,
    isRendering: false,
    error: null,
  });

  const isOpenRef = useRef(status.isOpen);
  isOpenRef.current = status.isOpen;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearSessionTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const closeCard = useCallback(() => {
    clearSessionTimer();
    NativeYapeCardSecureView.closeSecureView();
    if (Platform.OS === 'ios') {
      setStatus({ isOpen: false, isRendering: false, error: null });
    }
  }, []);

  const startSessionTimer = useCallback(() => {
    clearSessionTimer();
    timeoutRef.current = setTimeout(() => {
      if (isOpenRef.current) closeCard();
    }, SESSION_TIMEOUT_MS);
  }, [closeCard]);

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
        startSessionTimer();
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
        clearSessionTimer();
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
        clearSessionTimer();
        setStatus({ isOpen: false, isRendering: false, error: null });
      }
    );

    return () => {
      openedSub.remove();
      shownSub.remove();
      errorSub.remove();
      closedSub.remove();
    };
  }, [startSessionTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/) && isOpenRef.current) {
        if (Platform.OS === 'ios') {
          closeCard();
        }
      }
    });

    return () => subscription.remove();
  }, [closeCard]);

  const openCard = useCallback(
    async (cardId: string, secureToken: string) => {
      try {
        setStatus((prev) => ({ ...prev, error: null }));
        await NativeYapeCardSecureView.openSecureView(cardId, secureToken);

        if (Platform.OS === 'ios') {
          setStatus((prev) => ({ ...prev, isOpen: true, isRendering: true }));
          startSessionTimer();
          setTimeout(
            () => setStatus((prev) => ({ ...prev, isRendering: false })),
            100
          );
        }
      } catch (error: any) {
        setStatus((prev) => ({
          ...prev,
          error: {
            code: 'TOKEN_INVALID',
            message: error?.message || 'Error desconocido',
          },
        }));
      }
    },
    [startSessionTimer]
  );

  return {
    ...status,
    openCard,
    closeCard,
  };
};
