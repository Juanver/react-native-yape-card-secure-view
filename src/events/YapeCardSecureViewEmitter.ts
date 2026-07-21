// src/YapeCardSecureViewEmitter.ts
import {
  NativeEventEmitter,
  NativeModules,
  type EventSubscription,
} from 'react-native';
import NativeYapeCardSecureView from '../NativeYapeCardSecureView';
import type { SecureViewEvents } from '../types';

const YapeCardSecureViewModule = NativeModules.YapeCardSecureView
  ? NativeModules.YapeCardSecureView
  : NativeYapeCardSecureView;

const eventEmitter = new NativeEventEmitter(YapeCardSecureViewModule);

export const YapeCardSecureViewEmitter = {
  addListener<K extends keyof SecureViewEvents>(
    eventName: K,
    listener: (event: SecureViewEvents[K]) => void
  ): EventSubscription {
    return eventEmitter.addListener(eventName, (event: unknown) => {
      listener(event as SecureViewEvents[K]);
    });
  },

  removeAllListeners<K extends keyof SecureViewEvents>(eventName: K): void {
    eventEmitter.removeAllListeners(eventName);
  },
};
