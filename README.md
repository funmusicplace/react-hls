# React HLS Video Player

![NPM Downloads](https://img.shields.io/npm/dm/react-hls-video-player?style=flat-square)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/react-hls-video-player)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-hls-video-player)

## Introduction

`react-hls-video-player` is a simple HLS live stream player.
It uses [hls.js](https://github.com/video-dev/hls.js) to play your hls live stream if your browser supports `html 5 video` and `MediaSource Extension`.

## Install

`yarn add react-hls-video-player`
or
`npm i react-hls-video-player`

## Examples

### Using the ReactHlsPlayer component

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ReactHlsPlayer from 'react-hls-video-player'

ReactDOM.render(
    <ReactHlsPlayer
        src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        autoPlay={false}
        controls={true}
        width="100%"
        height="auto"
    />,
    document.getElementById('app'),
)
```

### Using hlsConfig (advanced use case)

All available config properties can be found on the [Fine Tuning](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning) section of the Hls.js API.md

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ReactHlsPlayer from 'react-hls-video-player'

ReactDOM.render(
    <ReactHlsPlayer
        src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        hlsConfig={{
            maxLoadingDelay: 4,
            minAutoBitrate: 0,
            lowLatencyMode: true,
        }}
    />,
    document.getElementById('app'),
)
```

### Using playerRef

The `playerRef` returns a ref to the underlying video component, and as such will give you access to all video component properties and methods.

```javascript
import React from 'react'
import ReactHlsPlayer from 'react-hls-video-player'

function MyCustomComponent() {
    const playerRef = React.useRef()

    function playVideo() {
        playerRef.current.play()
    }

    function pauseVideo() {
        playerRef.current.pause()
    }

    function toggleControls() {
        playerRef.current.controls = !playerRef.current.controls
    }

    return (
        <ReactHlsPlayer
            playerRef={playerRef}
            src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        />
    )
}

ReactDOM.render(<MyCustomComponent />, document.getElementById('app'))
```

You can also listen to events of the video

```javascript
import React from 'react'
import ReactHlsPlayer from 'react-hls-video-player'

function MyCustomComponent() {
    const playerRef = React.useRef()

    React.useEffect(() => {
        function fireOnVideoStart() {
            // Do some stuff when the video starts/resumes playing
        }

        playerRef.current.addEventListener('play', fireOnVideoStart)

        return playerRef.current.removeEventListener('play', fireOnVideoStart)
    }, [])

    React.useEffect(() => {
        function fireOnVideoEnd() {
            // Do some stuff when the video ends
        }

        playerRef.current.addEventListener('ended', fireOnVideoEnd)

        return playerRef.current.removeEventListener('ended', fireOnVideoEnd)
    }, [])

    return (
        <ReactHlsPlayer
            playerRef={playerRef}
            src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        />
    )
}

ReactDOM.render(<MyCustomComponent />, document.getElementById('app'))
```

## Props

All [video properties](https://www.w3schools.com/tags/att_video_poster.asp) are supported and passed down to the underlying video component

| Prop                        | Description                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| src `String`, `required`    | The hls url that you want to play                                                                                        |
| playerRef `React Ref`       | Pass in your own ref to interact with the video player directly. This will override the default ref.                     |
| hlsConfig `Object`          | `hls.js` config, you can see all config [here](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning)  |
| autoPlay `Boolean`          | Autoplay when component is ready. Defaults to `false`                                                                    |
| controls `Boolean`          | Whether or not to show the playback controls. Defaults to `false`                                                        |
| height `Number`             | Video height. Defaults to `auto`                                                                                         |
| width `Number`              | Video width. Defaults to `100%`                                                                                          |
| loop `Boolean`              | Specifies that the video will start over again, every time it is finished. Defaults to `false`                           |
| muted `Boolean`             | Specifies that the audio output of the video should be muted. Defaults to `false`                                        |
| poster `String`             | Specifies if and how the author thinks the video should be loaded when the page loads                                    |
| preload `String`            | Specifies an image to be shown while the video is downloading, or until the user hits the play button. Options: `auto`, `metadata`, `none` |
| playsInline `Boolean`       | Indicates that the video is to be played "inline", that is within the element's playback area. Defaults to `undefined`   |
| disablePictureInPicture `Boolean` | Prevents the browser from offering a picture-in-picture context menu or to request picture-in-picture automatically in some cases. Defaults to `undefined` |
| disableRemotePlayback `Boolean` | Disables the capability of remote playback in devices that are attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast, DLNA, AirPlay, etc.). Defaults to `undefined` |
| controlsList `String`       | Determines what controls to show on the media element whenever the browser shows its own set of controls. Defaults to `undefined` |
| crossOrigin `String`        | This enumerated attribute indicates whether to use CORS to fetch the related video. Options: `anonymous`, `use-credentials`, or `undefined` |
| mediaGroup `String`         | The name of the group the media element belongs to. Defaults to `undefined`                                              |

## NextJS Example
To use in NextJS, wrap the ReactHlsPlayer in a client component to ensure client side rendering of the component.

```ts
'use client'
import dynamic from 'next/dynamic'
import { ReactHlsPlayerProps } from 'react-hls-video-player'

const ReactHlsPlayer = dynamic(() => import('react-hls-video-player').then((mod) => mod.default), {
    ssr: false,
})

export default function ClientHlsPlayer({
    src,
    className,
    autoPlay = false,
    controls = true,
    ...props
}: ReactHlsPlayerProps) {
    return (
        <ReactHlsPlayer
            src={src}
            controls={controls}
            autoPlay={autoPlay}
            className={`rounded-[12px] w-full max-w-[571px] ${className || ''}`}
            {...props}
        />
    )
}
```

### Additional Notes

By default, the HLS config will have `enableWorker` set to `false`. There have been issues with the HLS.js library that breaks some React apps, so I've disabled it to prevent people from running in to this issue. If you want to enable it and see if it works with your React app, you can simply pass in `enableWorker: true` to the `hlsConfig` prop object. [See this issue for more information](https://github.com/video-dev/hls.js/issues/2064)

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
