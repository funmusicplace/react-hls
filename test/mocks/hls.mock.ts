import { EventEmitter } from 'eventemitter3'
import { HlsConfig, ManifestParsedData, HlsEventEmitter } from 'hls.js'
import { ErrorDetails, ErrorTypes, Events } from './hlsVars.mock'

class MockHls extends EventEmitter implements HlsEventEmitter {
    static isSupported = jest.fn().mockReturnValue(true)
    static Events = Events
    static ErrorTypes = ErrorTypes
    static ErrorDetails = ErrorDetails

    attachMedia: jest.Mock
    loadSource: jest.Mock
    startLoad: jest.Mock
    recoverMediaError: jest.Mock
    destroy: jest.Mock

    constructor(config?: HlsConfig) {
        super()

        this.attachMedia = jest.fn().mockImplementation((media: HTMLMediaElement) => {
            this.emit(Events.MEDIA_ATTACHED, { media })
        })

        this.loadSource = jest.fn().mockImplementation((src: string) => {
            this.emit(Events.MANIFEST_PARSED, {} as ManifestParsedData)
        })

        this.startLoad = jest.fn()
        this.recoverMediaError = jest.fn()
        this.destroy = jest.fn()
    }
}

export default MockHls
