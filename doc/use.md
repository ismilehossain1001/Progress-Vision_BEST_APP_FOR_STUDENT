# How to Use Progress Vision

This guide explains how to set up, run, and use **Progress Vision** on your local computer or mobile device.

## Prerequisites

1.  **Google Gemini API Key**: You need a valid API key from [Google AI Studio](https://aistudio.google.com/).
2.  **Node.js**: Recommended (v18 or higher) for running a local development server.

---

## Setup Instructions (Local Computer)

Since the original code is built for a specific playground environment using direct CDN imports, the best way to run this on your own machine is to port it to a standard **Vite** project.

### Step 1: Initialize a Project
Open your terminal and create a new Vite project:

```bash
npm create vite@latest progress-vision -- --template react-ts
cd progress-vision
npm install
```

### Step 2: Install Dependencies
Install the required libraries used in the app:

```bash
npm install @google/genai lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Configure Tailwind
Update `tailwind.config.js` to match the design system. Copy the configuration from the `script` tag in the original `index.html` (fonts, colors, animations) into the `extend` section of your new config file.

### Step 4: Copy Source Files
1.  Copy all files from the `components/` folder to `src/components/`.
2.  Copy `services/` to `src/services/`.
3.  Copy `types.ts` to `src/types.ts`.
4.  Replace the contents of `src/App.tsx` with the provided `App.tsx`.

### Step 5: Configure API Key
Create a `.env` file in the root of your project:

```env
VITE_API_KEY=your_actual_gemini_api_key_here
```

**Important:** In `services/geminiService.ts`, update the API key initialization:

```typescript
// Change this:
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// To this (for Vite):
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
```

### Step 6: Run the App
Start the development server:

```bash
npm run dev
```
The app will usually run at `http://localhost:5173`.

---

## How to Use on Mobile

You can access the application on your mobile device (phone/tablet) if it is connected to the same Wi-Fi network as your computer.

1.  **Find your Local IP Address**:
    *   **Windows**: Open Command Prompt, type `ipconfig`. Look for "IPv4 Address" (e.g., `192.168.1.5`).
    *   **Mac/Linux**: Open Terminal, type `ifconfig | grep "inet "`.

2.  **Expose Network via Vite**:
    Update your `package.json` dev script:
    ```json
    "scripts": {
      "dev": "vite --host"
    }
    ```
    Or run: `npm run dev -- --host`

3.  **Access on Mobile**:
    Open your mobile browser (Chrome/Safari) and type the address shown in your terminal, usually:
    `http://192.168.1.X:5173`

    *Note: Camera and Microphone permissions will be requested. On some modern browsers, these permissions might be blocked if not serving over HTTPS. For full functionality on mobile, consider deploying to Vercel or Netlify.*

---

## User Guide

### 1. Dashboard
*   View your current Level, XP, and Streak.
*   See a snapshot of your latest activity.

### 2. Log (Upload)
*   Click the **Log** tab.
*   Upload a photo or video of your activity (workout, drawing, coding, etc.).
*   Select the analysis mode (Form, Mood, or Power).
*   Wait for the AI to analyze and score your progress.

### 3. Focus Mode
*   Click the **Focus** tab.
*   Set a timer (Focus, Short Break, Long Break).
*   Add tasks to your "Mission Objectives" list.

### 4. AI Mentor (Voice)
*   Click the **Floating Orb** in the bottom right corner.
*   Type a question or click the **Microphone** to speak.
*   The AI will respond with text and voice.

### 5. Settings
*   Click the **Gear Icon** (top right).
*   Change the visual theme:
    *   **Neon Core**: Default futuristic look.
    *   **Zen Flow**: Calmer, low contrast.
    *   **Hyper Data**: High contrast green terminal look.
