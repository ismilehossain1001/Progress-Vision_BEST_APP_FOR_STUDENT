# Progress Vision - System Architecture

## 1. Executive Summary
**Progress Vision** is a Single Page Application (SPA) designed to act as an AI-powered personal growth companion. It leverages Google's Gemini 2.5 Flash model for multimodal analysis (Vision & Text) to track user progress in fitness, skills, and productivity.

## 2. Technical Stack

### Core Framework
*   **Library:** React 19 (Functional Components, Hooks)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Cyberpunk/Neon Theme)
*   **Icons:** Lucide React

### Artificial Intelligence
*   **Provider:** Google GenAI SDK (`@google/genai`)
*   **Model:** `gemini-2.5-flash`
*   ** Capabilities:**
    *   *Computer Vision:* Analyzing user uploads (posture, form, completion).
    *   *NLP:* Chat interface with specific "Coach" system instructions.
    *   *JSON Extraction:* Structured data generation for gamification stats.

### Data Persistence (Database Strategy)
*   **Current Strategy:** `localStorage` (Client-Side).
*   **Reasoning:** To ensure the app is immediately deployable and "runnable" without complex backend configuration, all data (User Profile, Logs, Goals) is stored in the user's browser.
*   **Implication:** Data is device-specific. Clearing cache resets progress.
*   **Future Upgrade Path:** For multi-device sync, a solution like Firebase or Supabase would be added, but it is **not required** for the Vercel deployment of this version.

---

## 3. Module Breakdown

### `App.tsx` (The Core)
Manages the global state (`user`, `entries`, `goals`) and routing between views. It handles the "Gamification Loop" (XP gain and leveling up) whenever a sub-component triggers an action.

### `components/VideoUploader.tsx` (Neural Link)
The primary input mechanism.
1.  Captures Media (Image/Video).
2.  Converts to Base64.
3.  Sends to Gemini with a context-aware prompt.
4.  Receives analysis and updates the global log.

### `components/AIChat.tsx` (Voice Interface)
A floating overlay that provides persistent access to the AI coach.
*   **Input:** Web Speech API (Speech-to-Text).
*   **Processing:** Gemini Chat Session.
*   **Output:** Web Speech API (Text-to-Speech) + Visual UI.

---

## 4. Visual Design System
The app implements a "Neon Core" aesthetic using Tailwind utility classes:
*   **Dark Mode Default:** Backgrounds are `#050510` (Dark Navy/Black).
*   **Accents:** `neon-cyan`, `neon-purple`, `neon-blue` defined in config.
*   **Effects:** Heavy use of CSS `backdrop-filter: blur()`, `box-shadow` glows, and CSS animations (`pulse`, `float`).

---

## 5. Deployment Architecture
*   **Platform:** Vercel (recommended) or Netlify.
*   **Build System:** Vite.
*   **Environment Variables:** `VITE_API_KEY` is required for the SDK to function in production.