# HealthScribe: AI Symptom Checker & Clinical EHR Scribe

HealthScribe is a modern, high-end Web Application designed as a private, AI-powered Medical Scribe and Diagnostic Assistant. The app focuses on real-time symptom assessment, local speech-to-text recording, dynamic text-to-speech feedback, and offline-first Electronic Health Records (EHR) database management.

All diagnostic operations are performed using advanced Large Language Models (LLMs) via the **Groq API**, and all generated health reports are saved strictly offline on the user's browser sandbox storage.

---

## Key Features

1. **AI Symptom Checker**: 
   * Engage in natural, clinical-grade symptom checkup dialogues.
   * Driven by high-performance Llama-3.1 models via the Groq API.
2. **Multi-Modal Input (Voice & Photo Uploads)**:
   * **Voice Input**: Dynamic, live browser-native Speech Recognition transcription.
   * **Camera / Upload**: Take photos of physical symptoms or upload image files directly into the consultation chat.
3. **Structured Scribe Summaries (EHR)**:
   * Automatic clinical abstraction of consultation logs.
   * Generates formal, standard Electronic Health Record (EHR) sheets detailing:
     * *I. History of Present Illness (Chief Complaint)*
     * *II. Extracted Symptoms & Review of Systems*
     * *III. Clinical Guidance & Home Care Plan*
4. **Text-to-Speech (TTS) Read Aloud**:
   * Listen to report details read aloud dynamically using Web Speech Synthesis.
5. **Private Local Health Records Dashboard**:
   * View all saved consultations in a dashboard.
   * Filter, search, read, delete individual charts, or wipe history completely.
6. **Data Management & Custom API Keys**:
   * Save custom Groq API keys locally to bypass default rate limits.
   * Export all health history as a single JSON backup.

---

## Technology Stack

* **Frontend Framework**: React with TypeScript & Vite
* **Styling**: Vanilla TailwindCSS & Shadcn UI
* **Core APIs**:
  * **Groq API**: Large Language Model inferences (Llama-3.1-8b-instant model)
  * **Web Speech API**: Browser-native SpeechRecognition & SpeechSynthesis Utterances
* **Database & Security**: Sandboxed browser Local Storage (completely decentralized and private)

---

## Project Structure

* `/src/components`:
  * `ChatInterface.tsx`: Main chat room bubble console.
  * `MultiModalInput.tsx`: Microphone transcription and camera capture.
  * `SummaryCard.tsx`: Certified EHR health charts layout and deletion.
  * `theme-provider.tsx`: Dynamic Dark & Light theme controller.
* `/src/utils`:
  * `groqApi.ts`: Groq API configurations, fallback clinical templates, and chat prompts.
  * `summaryUtils.ts`: Clinical JSON abstractions and report parser.
  * `speechUtils.ts`: Voice synthesis handlers.
* `/src/services`:
  * `mockServer.ts`: Sandboxed local storage database manager.
* `/src/pages`:
  * `Index.tsx`: Premium product landing page.
  * `Chat.tsx`: AI symptom checkup control center.
  * `Dashboard.tsx`: Health records database log view.
  * `Profile.tsx`: User profile and Data Management (API Key, Backup exports, database resets).

---

## Local Setup & Development

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Start Development Server
Start the local development server:
```bash
npm run dev
```
By default, the server will launch at `http://localhost:8080/`.

### 3. Production Build
Generate a compiled bundle:
```bash
npm run build
```
The compiled output files will be output to `/dist`.
