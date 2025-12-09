# Deployment Guide: Progress Vision

This guide explains how to take the code from this playground and deploy it as a live website on Vercel.

## Phase 1: Local Project Setup

Since you cannot deploy directly from this playground to Vercel, you need to set up a project folder on your computer.

1.  **Create a Folder** on your computer named `progress-vision`.
2.  **Initialize Project**: Open your terminal/command prompt in that folder and run:
    ```bash
    npm create vite@latest . -- --template react-ts
    npm install
    ```
3.  **Install Dependencies**: Run the following command to install the required libraries:
    ```bash
    npm install @google/genai lucide-react recharts clsx tailwind-merge
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

---

## Phase 2: Configuration Files

You must create/update the following files in your local project to match the app's requirements.

### 1. Update `tailwind.config.js`
Replace the content of `tailwind.config.js` with:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Exo 2"', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe',
          cyan: '#0afff0',
          green: '#0aff60'
        },
        dark: {
          bg: '#050510',
          card: '#0f0f1e',
          surface: '#151525'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
```

### 2. Update `src/index.css`
Add these fonts and directives to the top of your CSS file:
```css
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Rajdhani:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #050510;
  color: #e2e8f0;
}
```

---

## Phase 3: Moving the Code

1.  **Source Folder**: Go to the `src` folder on your computer.
2.  **Copy Files**:
    *   Copy the content of `App.tsx` from the playground to `src/App.tsx`.
    *   Create a `types.ts` file in `src/` and copy the content.
    *   Create a `components` folder in `src/` and copy all component files (Dashboard, VideoUploader, etc.).
    *   Create a `services` folder in `src/` and copy `geminiService.ts`.

---

## Phase 4: Deploying to Vercel

1.  **Push to GitHub**: Upload your `progress-vision` folder to a GitHub repository.
2.  **Go to Vercel**: Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3.  **Import**: Select your GitHub repository.
4.  **Environment Variables (CRITICAL)**:
    *   In the Vercel project settings, find "Environment Variables".
    *   Add a new variable:
        *   **Name:** `VITE_API_KEY`
        *   **Value:** Your Google Gemini API Key.
5.  **Deploy**: Click "Deploy".

## Troubleshooting

*   **API Key Error:** If the AI doesn't work, check the Console (F12). If you see 401/403 errors, ensure `VITE_API_KEY` is set correctly in Vercel settings and that you **re-deployed** after setting it.
*   **Styling Issues:** If the app looks white/plain, ensure `tailwind.config.js` is set up correctly and imported in `index.css`.
*   **Microphone/Camera:** You must deploy to `https` (which Vercel does automatically) for camera/mic access to work.
