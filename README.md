# ClarityCast Client 🎥

**ClarityCast** is the frontend application for a modern, production-ready video recording and communication platform — inspired by tools like **Riverside.fm**. Unlike basic WebRTC peer-to-peer examples, ClarityCast is built to support high-quality video streaming with a scalable signaling and recording pipeline.

This React-based client connects to a WebSocket signaling server and establishes a WebRTC connection between the **sender** (broadcaster) and the **receiver** (viewer/recorder).

---

## 🎯 Project Goal

To build a fully featured, Riverside.fm-style platform enabling:
- Studio-quality video/audio recording
- Multi-user remote collaboration
- Cloud-based file storage
- Scalable architecture for production use

---

## 🔍 Features

- 🚀 Sender and Receiver roles via URL routes
- 🔄 WebSocket-based signaling
- 📡 WebRTC-based real-time video transmission
- ✅ Stream display via React refs
- 💎 Responsive layout with centered video playback

---

## 🧱 Tech Stack

- React (with Hooks)
- WebRTC
- WebSocket
- JavaScript (ES6+)
- HTML5 Video API

---

## 📁 Project Structure

```bash
clarity-cast-client/
├── src/components
│   ├── Sender.jsx         # Capture and stream video
│   ├── Receiver.jsx       # Receive and render stream
│   └── App.jsx
├── public/
└── README.md
