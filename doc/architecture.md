# Progress Vision - Application Architecture

## 1. Overview
**Progress Vision** is an advanced AI-powered personal growth and daily progress tracking application. It combines gamification elements (XP, leveling, rewards) with multimodal AI analysis (computer vision and natural language processing) to help users improve fitness, skills, and productivity.

The application is built as a **Single Page Application (SPA)** with a futuristic, "Cyberpunk/Neon" aesthetic, emphasizing immersive UI interactions, animations, and voice control.

---

## 2. Tech Stack

### Frontend Core
*   **Framework:** React 19 (Functional Components, Hooks).
*   **Language:** TypeScript (Strict typing for data models).
*   **Build/Runtime:** Browser-native ES Modules (no complex bundler config required for this specific implementation).

### Styling & UI
*   **CSS Framework:** Tailwind CSS (v3.4 via CDN).
*   **Icons:** Lucide React.
*   **Charts/Visualization:** Recharts (Radar, Pie, Line charts).
*   **Fonts:** Google Fonts ('Exo 2' for UI, 'Rajdhani' for headers).
*   **Animations:** CSS Keyframes (Glow, Float, Pulse) and Tailwind `animate-*` utilities.

### Artificial Intelligence
*   **SDK:** `@google/genai` (Google Gemini API).
*   **Models Used:** 
    *   `gemini-2.5-flash`: Used for rapid image analysis, chat responses, and JSON structured output.
*   **Features:** Multimodal input (Text + Image/Video Frames), System Instructions, JSON Schema enforcement.

### Web APIs
*   **Speech Recognition:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for voice-to-text.
*   **Speech Synthesis:** Web Speech API (`speechSynthesis`) for text-to-voice.
*   **Media:** HTML5 Video/Audio APIs.
*   **Storage:** `localStorage` for client-side persistence.

---

## 3. Project Structure

```text
/
├── index.html              # Entry point, Tailwind Config, Import Maps
├── index.tsx               # React DOM root mounting
├── App.tsx                 # Main State Container, Routing, Data Persistence
├── types.ts                # TypeScript Interfaces (User, Goal, Entry, etc.)
├── metadata.json           # Application permissions manifest
├── services/
│   └── geminiService.ts    # API wrapper for Google GenAI interactions
└── components/
    ├── Navigation.tsx      # Bottom tab bar navigation
    ├── Dashboard.tsx       # Main user overview (Stats, XP, Streak)
    ├── VideoUploader.tsx   # Media capture & AI analysis engine
    ├── AIChat.tsx          # Voice-enabled AI mentor interface
    ├── GoalTracker.tsx     # Gamified objective management
    ├── Timeline.tsx        # Historical feed of progress scans
    ├── CalendarView.tsx    # Monthly view & Radar charts
    ├── FocusMode.tsx       # Pomodoro timer & Task list
    ├── DailyNotes.tsx      # Sticky-note style journaling
    ├── RewardsGallery.tsx  # Gamification trophy case
    ├── Login.tsx           # Simulated authentication flow
    ├── ModeSelector.tsx    # Theme switcher (Neon/Zen/Hyper)
    └── ... (Modals)
```

---

## 4. Core Systems

### A. Data Persistence & State Management
The application uses a **centralized state pattern** within `App.tsx` that syncs strictly with the browser's `localStorage`. 
*   **Lazy Initialization:** State is hydrated from local storage on mount.
*   **Reactive Saving:** `useEffect` hooks trigger saves whenever core state objects (User, Entries, Goals) change.
*   **Data Models:** Defined in `types.ts` to ensure consistency across the app.

### B. AI Analysis Engine (`VideoUploader.tsx` & `geminiService.ts`)
1.  **Input:** User uploads an image or video.
2.  **Preprocessing:** Video frames or Images are converted to Base64 strings.
3.  **Prompt Engineering:** The app selects a context based on the selected mode (Biometric, Emotional, or Velocity).
4.  **API Call:** The Base64 data is sent to Gemini Flash with a specific JSON Schema.
5.  **Output:** Gemini returns a structured JSON object containing a numerical score (0-100), emotion tag, constructive feedback, and descriptive tags.

### C. Gamification System
*   **XP Loop:** Actions (Uploading, Completing Goals) grant XP.
*   **Leveling:** `App.tsx` calculates level thresholds. When a user levels up, a `Reward` object is generated.
*   **Rarity System:** Rewards have rarity tiers (Common, Rare, Legendary) which determine the visual glow effects and XP bonuses.

### D. Voice Interface (`AIChat.tsx`)
*   **Input:** Uses the browser's microphone to capture speech, converts to text in real-time, and sends to the chat window.
*   **Processing:** Sends chat history + new message to Gemini.
*   **Output:** The AI response is read aloud using `SpeechSynthesisUtterance`, selecting the most "robotic" or clean voice available in the browser.

---

## 5. Design & UI/UX Strategy

The application employs a **"Glassmorphism + Neon"** design language suitable for a sci-fi/future-tech theme.

### Color Palette (Tailwind Config)
*   **Backgrounds:** Deep localized blacks (`#050510`) and dark blues (`#0f0f1e`).
*   **Accents:** 
    *   **Neon Cyan (`#0afff0`):** Primary actions, active states, technology data.
    *   **Neon Purple (`#bc13fe`):** Gamification, AI insight, "Legendary" items.
    *   **Neon Green (`#0aff60`):** Success states, growth metrics.

### Visual Effects
*   **Glow:** CSS box-shadows are used extensively to create neon tube effects.
*   **Backdrop Blur:** `backdrop-blur-xl` is used on overlays and navigation to maintain context while focusing attention.
*   **Animations:**
    *   `animate-pulse-fast`: Used for recording indicators and "live" AI states.
    *   `animate-float`: Used for the AI Orb trigger.
    *   `animate-in`: Used for smooth page transitions and modal appearances.

### Themes (`ModeSelector.tsx`)
The app supports dynamic class injection to alter the visual mood:
1.  **Neon Core:** Default, high contrast, heavy glow.
2.  **Zen Flow:** Desaturated, lower contrast, "Day/Focus" mode.
3.  **Hyper Data:** Matrix-green aesthetic, high saturation.