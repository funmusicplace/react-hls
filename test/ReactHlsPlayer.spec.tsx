import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ReactHlsPlayer from '../src/components/ReactHlsPlayer';
import '@testing-library/jest-dom';
import Hls from 'hls.js';

describe('ReactHlsPlayer', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let capturedWarnings: string[];
  const mockSrc =
    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';

  beforeEach(() => {
    jest.clearAllMocks();
    capturedWarnings = [];
    consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation((message) => {
        capturedWarnings.push(message);
      });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    cleanup();
  });

  it('renders video element', () => {
    render(<ReactHlsPlayer src={mockSrc} />);
    const videoElement = screen.getByTestId('react-hls-player');
    expect(videoElement).toBeInTheDocument();
    expect(capturedWarnings).toHaveLength(0);
  });

  it('initializes Hls when supported', () => {
    let hlsInstance = null as Hls | null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />);
    expect(hlsInstance).not.toBeNull();
    expect(hlsInstance?.attachMedia).toHaveBeenCalled();
    expect(hlsInstance?.loadSource).toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(0);
  });

  it('renders fallback content when HLS is not supported', async () => {
    (Hls.isSupported as jest.Mock).mockReturnValueOnce(false);
    render(<ReactHlsPlayer src={mockSrc} />);
    const videoElement = screen.getByTestId('react-hls-player-fallback');
    expect(videoElement).toHaveAttribute('src', mockSrc);
    expect(videoElement).toHaveTextContent(
      'Your browser does not support the video tag.'
    );
    expect(capturedWarnings).toHaveLength(0);
  });

  it('handles autoplay correctly when autoplay is passed as true', () => {
    const mockPlay = jest.fn().mockImplementation(async () => {});

    let hlsInstance: Hls | null = null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    jest.spyOn(HTMLVideoElement.prototype, 'play').mockImplementation(mockPlay);

    render(
      <ReactHlsPlayer
        src={mockSrc}
        getHLSInstance={getHLSInstance}
        autoPlay={true}
      />
    );

    expect(hlsInstance).not.toBeNull();
    expect(mockPlay).toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(0);

    mockPlay.mockClear();
  });

  it('handles autoplay correctly when autoplay is passed as false', () => {
    const mockPlay = jest.fn().mockImplementation(async () => {});

    let hlsInstance: Hls | null = null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    jest.spyOn(HTMLVideoElement.prototype, 'play').mockImplementation(mockPlay);

    render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />);

    expect(hlsInstance).not.toBeNull();
    expect(mockPlay).not.toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(0);

    mockPlay.mockClear();
  });

  it('calls recoverMediaError function on fatal MEDIA_ERROR', () => {
    let hlsInstance = null as Hls | null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />);
    expect(hlsInstance).not.toBeNull();
    hlsInstance!.emit(Hls.Events.ERROR, Hls.Events.ERROR, {
      fatal: true,
      type: Hls.ErrorTypes.MEDIA_ERROR,
      details: Hls.ErrorDetails.LEVEL_EMPTY_ERROR,
      error: { name: 'Media Error', message: 'This is a test media error' },
    });
    expect(hlsInstance?.recoverMediaError).toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(1);
  });

  it('calls start load function on fatal MEDIA_ERROR', () => {
    let hlsInstance = null as Hls | null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />);
    expect(hlsInstance).not.toBeNull();
    hlsInstance!.emit(Hls.Events.ERROR, Hls.Events.ERROR, {
      fatal: true,
      type: Hls.ErrorTypes.NETWORK_ERROR,
      details: Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL,
      error: { name: 'Network Error', message: 'This is a test network error' },
    });
    expect(hlsInstance?.startLoad).toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(1);
  });

  it('calls no functions on non-fatal ERROR', () => {
    let hlsInstance = null as Hls | null;
    const getHLSInstance = (hls: Hls) => {
      hlsInstance = hls;
    };

    render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />);
    expect(hlsInstance).not.toBeNull();
    hlsInstance!.emit(Hls.Events.ERROR, Hls.Events.ERROR, {
      fatal: false,
      type: Hls.ErrorTypes.OTHER_ERROR,
      details: Hls.ErrorDetails.UNKNOWN,
      error: { name: 'Unknown Error', message: 'This is a test unknown error' },
    });
    expect(hlsInstance?.startLoad).not.toHaveBeenCalled();
    expect(hlsInstance?.recoverMediaError).not.toHaveBeenCalled();
    expect(capturedWarnings).toHaveLength(0);
  });
});
