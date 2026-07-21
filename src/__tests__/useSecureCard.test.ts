import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useSecureCard } from '../hooks/useSecureCard';
import NativeYapeCardSecureView from '../NativeYapeCardSecureView';
import { YapeCardSecureViewEmitter } from '../events/YapeCardSecureViewEmitter';

jest.mock('react-test-renderer', () => {
  const actual = jest.requireActual('react-test-renderer') as any;
  return {
    ...actual,
    createRoot: (element: any) => {
      const root = actual.create(element);
      return {
        render: (newElement: any) => root.update(newElement),
        unmount: () => root.unmount(),
      };
    },
  };
});

jest.mock('../NativeYapeCardSecureView', () => ({
  openSecureView: jest.fn(() => Promise.resolve(true)),
  closeSecureView: jest.fn(),
}));

jest.mock('../events/YapeCardSecureViewEmitter', () => {
  const listeners: Record<string, Function> = {};
  return {
    YapeCardSecureViewEmitter: {
      addListener: jest.fn((event: string, callback: Function) => {
        listeners[event] = callback;
        return { remove: jest.fn() };
      }),
      removeAllListeners: jest.fn(),
      emit: (event: string, payload?: any) => {
        if (listeners[event]) {
          listeners[event](payload);
        }
      },
    },
  };
});

describe('Hook useSecureCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct default values', async () => {
    const { result } = await renderHook(() => useSecureCard());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isRendering).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update the state to "isOpen" and "isRendering" when the native view opens', async () => {
    const { result } = await renderHook(() => useSecureCard());

    await act(async () => {
      await result.current.openCard('card_123', 'token_temporal_valido');
    });

    expect(NativeYapeCardSecureView.openSecureView).toHaveBeenCalledWith(
      'card_123',
      'token_temporal_valido'
    );

    await act(() => {
      (YapeCardSecureViewEmitter as any).emit('onSecureViewOpened', {
        cardId: 'card_123',
      });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isRendering).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should hide the loading state "isRendering" when the data is already shown', async () => {
    const { result } = await renderHook(() => useSecureCard());

    await act(() => {
      (YapeCardSecureViewEmitter as any).emit('onCardDataShown', {
        cardId: 'card_123',
      });
    });

    expect(result.current.isRendering).toBe(false);
  });

  it('should handle a token validation error from the native side correctly', async () => {
    const { result } = await renderHook(() => useSecureCard());

    const mockError = {
      code: 'TOKEN_EXPIRED',
      message: 'El token ha expirado por timeout.',
    };

    await act(() => {
      (YapeCardSecureViewEmitter as any).emit('onValidationError', mockError);
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isRendering).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });
});
