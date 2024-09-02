import { EventEmitter } from 'eventemitter3';
import { HlsConfig } from 'hls.js';

const Events = {
  MEDIA_ATTACHED: 'hlsMediaAttached',
  MANIFEST_PARSED: 'hlsManifestParsed',
  ERROR: 'hlsError',
};

const ErrorTypes = {
  NETWORK_ERROR: 'networkError',
  MEDIA_ERROR: 'mediaError',
};

class MockHls extends EventEmitter {
  static isSupported = jest.fn().mockReturnValue(true);
  static Events = Events;
  static ErrorTypes = ErrorTypes;

  attachMedia: jest.Mock;
  loadSource: jest.Mock;
  startLoad: jest.Mock;
  recoverMediaError: jest.Mock;
  destroy: jest.Mock;

  constructor(config?: HlsConfig) {
    super();

    this.attachMedia = jest
      .fn()
      .mockImplementation((media: HTMLMediaElement) => {
        console.log('attachMedia called');
        setTimeout(() => {
          const emitResult = this.emit(Events.MEDIA_ATTACHED, { media });
          console.log(`MEDIA_ATTACHED emit result: ${emitResult}`);
        }, 0);
      });

    this.loadSource = jest.fn().mockImplementation((src: string) => {
      console.log('loadSource called with:', src);
      setTimeout(() => {
        this.emit(Events.MANIFEST_PARSED);
      }, 0);
    });

    this.startLoad = jest.fn();
    this.recoverMediaError = jest.fn();
    this.destroy = jest.fn();
  }
}

export default MockHls;
