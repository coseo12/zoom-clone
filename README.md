# Zoom Clone

Zoom clone using NodeJS, WebRTC and Websockets.

- master: WebRTC example
- chat: Chat example

## WebRTC

- [MDN](https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API)

- [x] Peer A :
      getUserMedia -> addTracks -> createOffer -> setLocalDescription

- [x] Peer B :
      setRemoteDescription -> getUserMedia -> addTracks -> createAnswer -> setLocalDescription

- [x] IceCandidate

- [ ] Senders

- [ ] STUN

## Library

### WS

- [ws](https://www.npmjs.com/package/ws)

### SocketIO

- [SocketIO](https://socket.io/)

- ${host}/socket.io/socket.io.js

- [AdminUI](https://www.npmjs.com/package/@socket.io/admin-ui)

- [localtunnel](https://www.npmjs.com/package/localtunnel)
