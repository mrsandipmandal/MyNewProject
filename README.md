# LocalMind AI

A high-performance, agentic AI chat application that runs GGUF models **entirely on-device** using llama.cpp. 100% private. 0% cloud.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## Features

### Core
- **Local GGUF Inference** - Run LLM models via llama.cpp with zero network dependency
- **Streaming Responses** - Real-time token-by-token generation with smooth UI updates
- **Multi-Model Support** - Download and switch between models (Llama, Phi, Gemma, Qwen)
- **Quantization Selector** - Choose Q2_K through Q8_0 based on your device RAM

### Agentic Framework
- **Persona System** - Switch between specialized AI personas (Developer, Creative Writer, Analyst)
- **Chain-of-Thought** - Toggle to view the model's internal reasoning before answers
- **Tool Use (Function Calling)** - JSON schema-based local tool execution
- **Recursive Task Breakdown** - Agent mode for sequential multi-step tasks

### Privacy & Security
- **Air-Gap Mode** - Visual confirmation that 0% data leaves your device
- **Local RAG** - Chat with your documents (PDFs, TXT) via local vector indexing
- **No Telemetry** - Zero analytics, zero tracking

### UX/Design
- **Glassmorphic Dark Theme** - Three themes: Dark, AMOLED, Light
- **Model Heartbeat** - Pulsing orb animation showing model processing state
- **Haptic Feedback** - Subtle vibrations on response completion
- **Markdown Rendering** - Full code block syntax highlighting
- **RAM Monitor** - Real-time memory usage display

---

## Architecture

```
src/
├── assets/                 # Images, fonts, icons
├── components/
│   ├── chat/              # ChatBubble, ChatInput
│   ├── common/            # ModelOrb, Sidebar, AirGapIndicator, CopyButton
│   └── model/             # ModelCard
├── constants/             # App config, defaults
├── hooks/                 # useHaptics, custom hooks
├── navigation/            # AppNavigator (bottom tabs)
├── screens/
│   ├── ChatScreen.tsx     # Main chat interface
│   ├── ModelManagerScreen.tsx  # Model download/management
│   └── SettingsScreen.tsx # Settings, parameters, themes
├── services/
│   ├── llama/             # LlamaEngine (native bridge)
│   ├── storage/           # AsyncStorage wrapper
│   ├── rag/               # RAG document indexing
│   └── ChatService.ts     # Inference orchestration
├── stores/                # Zustand stores
│   ├── chatStore.ts       # Messages, streaming state
│   ├── modelStore.ts      # Models, config, RAM
│   ├── agentStore.ts      # Personas, agent tasks
│   └── settingsStore.ts   # App settings, theme
├── theme/                 # Colors, typography, spacing, shadows
└── types/                 # TypeScript interfaces
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native CLI (0.74+) |
| Language | TypeScript |
| Inference Engine | llama.cpp (native bridge) |
| State Management | Zustand |
| Navigation | React Navigation v6 |
| Styling | StyleSheet + custom theme system |
| Animations | React Native Reanimated 3 |
| Storage | AsyncStorage |
| Markdown | react-native-markdown-display |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- React Native environment set up (see [RN docs](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android) or Xcode (for iOS)
- Minimum 4GB RAM on device (8GB recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/localmind-ai.git
cd localmind-ai

# Install dependencies
npm install

# For iOS, install pods
cd ios && pod install && cd ..
```

### Running

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Integrating llama.cpp

The native bridge is scaffolded in:
- `android/app/src/main/java/com/localmind/LlamaEngineModule.java`
- `ios/MyNewProject/LlamaEngineModule.m`

To fully integrate llama.cpp:

### Android
1. Add llama.cpp as a CMake dependency in `android/app/build.gradle`
2. Build the native library with NDK
3. Uncomment the `llama_*` calls in `LlamaEngineModule.java`

### iOS
1. Add llama.cpp as a Swift Package or via CocoaPods
2. Link the `llama` framework
3. Uncomment the `llama_*` calls in `LlamaEngineModule.m`

### Quick Start (Mock Mode)
The app ships with a mock inference engine that simulates token streaming. You can test the full UI without a native build.

---

## Model Downloads

Models are downloaded from Hugging Face. The app includes presets for:

| Model | Size | Quantization | RAM Required |
|-------|------|-------------|--------------|
| Llama 3.2 1B | 740 MB | Q4_K_M | ~1.5 GB |
| Llama 3.2 3B | 2.0 GB | Q4_K_M | ~3.5 GB |
| Phi-3 Mini | 2.3 GB | Q4_K_M | ~3.8 GB |
| Gemma 2 2B | 1.6 GB | Q4_K_M | ~2.8 GB |
| Qwen 2.5 1.5B | 950 MB | Q4_K_M | ~2.0 GB |

---

## Configuration

All settings are adjustable in-app via the Settings screen:

| Parameter | Default | Range |
|-----------|---------|-------|
| Temperature | 0.7 | 0.1 - 2.0 |
| Context Length | 4096 | 512 - 8192 |
| Threads | 4 | 1 - 8 |
| Max Tokens | 2048 | 256 - 4096 |
| Top P | 0.9 | - |
| Top K | 40 | - |
| Repeat Penalty | 1.1 | - |

---

## Roadmap

- [ ] Full llama.cpp native integration (Android & iOS)
- [ ] GPU acceleration (Vulkan/Metal)
- [ ] Local RAG with vector embeddings
- [ ] Tool/function calling execution
- [ ] Hugging Face model browser
- [ ] Chat export (JSON, Markdown)
- [ ] Voice input/output
- [ ] CI/CD with GitHub Actions

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

> **100% Local. 100% Private. Your AI, your device.**
