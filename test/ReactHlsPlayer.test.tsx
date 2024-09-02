import React from 'react'
import { render, screen } from '@testing-library/react'
import ReactHlsPlayer from '../src/components/ReactHlsPlayer'
import '@testing-library/jest-dom'
import Hls from 'hls.js'

declare global {
    interface Window {
        HTMLMediaElement: typeof HTMLMediaElement
    }
}

class MockHTMLMediaElement {
    load: jest.Mock
    play: jest.Mock
    pause: jest.Mock

    constructor() {
        this.load = jest.fn()
        this.play = jest.fn().mockResolvedValue(undefined)
        this.pause = jest.fn()
    }
}

Object.defineProperty(window, 'HTMLMediaElement', {
    writable: true,
    value: MockHTMLMediaElement,
})

describe('ReactHlsPlayer', () => {
    const mockSrc = 'https://example.com/video.m3u8'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders video element', () => {
        render(<ReactHlsPlayer src={mockSrc} />)
        const videoElement = screen.getByTestId('react-hls-player')
        expect(videoElement).toBeInTheDocument()
    })

    it('initializes Hls when supported', () => {
        let hlsInstance = null as Hls | null
        const getHLSInstance = (hls: Hls) => {
            hlsInstance = hls
        }

        render(<ReactHlsPlayer src={mockSrc} getHLSInstance={getHLSInstance} />)
        expect(hlsInstance).not.toBeNull()
        expect(hlsInstance?.attachMedia).toHaveBeenCalled()
        expect(hlsInstance?.loadSource).toHaveBeenCalled()
    })

    it('renders fallback content when HLS is not supported', () => {
        ;(Hls.isSupported as jest.Mock).mockReturnValueOnce(false)
        render(<ReactHlsPlayer src={mockSrc} />)
        const videoElement = screen.getByTestId('react-hls-player-fallback')
        expect(videoElement).toHaveAttribute('src', mockSrc)
        expect(videoElement).toHaveTextContent('Your browser does not support the video tag.')
    })
})
