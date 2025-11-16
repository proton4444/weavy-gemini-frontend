# Weavy-Style Gemini Node Editor

A **Weavy-like node-based AI canvas** built with React, TypeScript, Vite, React Flow, Tailwind CSS, and Google Gemini API.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Features

- **Dark, cinematic UI** resembling Weavy's node editor
- **Node-based workflow** with drag-and-drop canvas
- **Three node types**:
  - **TextNode**: Input prompts for the AI
  - **GeminiNode**: Calls Google Gemini API and displays results
  - **OutputNode**: Shows the final output
- **Real-time execution** with "Run workflow" button
- **Property inspector** panel for editing node properties
- **Local persistence** using localStorage
- **Responsive layout** with top bar, sidebar, and floating bottom toolbar

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- A **Gemini API key** from [Google AI Studio](https://ai.google.dev/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd weavy-gemini-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

   > Get your free API key from: https://ai.google.dev/

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:

   Visit [http://localhost:5173](http://localhost:5173)

## 🎨 Visual Design

The UI closely matches Weavy's design language:

- **Dark background** (#050608)
- **Rounded node cards** with subtle shadows
- **Color-coded nodes**:
  - Green (#143C2E) for input/control nodes
  - Purple (#2A1848) for AI/output nodes
- **Smooth curved edges** between nodes
- **Semi-transparent floating toolbar** at the bottom
- **Clean, minimal sidebar** with icon buttons

## 🏗️ Project Structure

```
weavy-gemini-frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx          # Top navigation bar
│   │   │   ├── Sidebar.tsx         # Left icon sidebar
│   │   │   ├── RightPanel.tsx      # Properties inspector
│   │   │   └── BottomToolbar.tsx   # Floating bottom controls
│   │   ├── nodes/
│   │   │   ├── BaseNode.tsx        # Shared node card component
│   │   │   ├── TextNode.tsx        # Prompt input node
│   │   │   ├── GeminiNode.tsx      # Gemini API node
│   │   │   └── OutputNode.tsx      # Output display node
│   │   └── FlowCanvas.tsx          # Main React Flow canvas
│   ├── lib/
│   │   └── gemini.ts               # Gemini API integration
│   ├── App.tsx                     # Main app component
│   ├── index.css                   # Global styles + Tailwind
│   └── main.tsx                    # App entry point
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

## 📖 How to Use

1. **Edit the prompt**: Click on the green "Prompt" node and type your prompt in the textarea (or edit in the right panel)

2. **Run the workflow**: Click the "Run workflow" button in the bottom toolbar

3. **View results**: The Gemini node and Output node will display the AI's response

4. **Connect nodes**: Drag from a node's handle to create new connections

5. **Move nodes**: Click and drag nodes to rearrange the canvas

6. **Auto-save**: Your workflow is automatically saved to localStorage

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **React Flow** | Node-based editor |
| **Tailwind CSS** | Styling |
| **Google Gemini API** | AI text generation |

## 🔐 Security Note

**⚠️ Important**: This is a prototype app. The Gemini API key is exposed to the browser, which is **not safe for production**.

For a production app, you should:
- Create a backend API to proxy Gemini calls
- Store the API key server-side
- Implement proper authentication

## 🎯 Future Enhancements

Possible improvements for v2:

- [ ] Multiple Gemini nodes in a chain
- [ ] Branching workflows (one input → multiple outputs)
- [ ] Image support (Gemini vision)
- [ ] Pre-built workflow templates
- [ ] Export/import workflows as JSON
- [ ] Undo/redo functionality
- [ ] Custom node creation
- [ ] Real-time collaboration

## 📝 License

MIT License - feel free to use this project as you wish!

## 🙏 Acknowledgments

- Visual design inspired by [Weavy](https://weavy.com/)
- Built with [React Flow](https://reactflow.dev/)
- Powered by [Google Gemini](https://ai.google.dev/)

---

**Made with ❤️ using Claude Code**
