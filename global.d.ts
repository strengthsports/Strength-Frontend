/// <reference types="nativewind/types" />


declare global {
    interface Window {
      crypto: {
        getRandomValues: (array: Uint8Array) => Uint8Array;
      };
    }
  }