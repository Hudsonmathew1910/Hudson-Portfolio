# Hudson Mathew — Portfolio Site + AI Assistant

This project is a two-part personal branding setup:
1. A **static single-page portfolio website** built with **HTML, CSS, and JavaScript**
2. A **Django-based AI portfolio assistant** powered by **GPT-4o-mini via OpenRouter**, designed to answer questions only about Hudson using a local `data.json` knowledge base

Together, they provide a modern portfolio plus an interactive chat experience for recruiters, clients, and collaborators.

---

## Features

### Portfolio Website (HTML/CSS/JS)
- Single-page layout with sections: **Home, About, Services, Projects, Contact**
- Anchor navigation (`#home`, `#about`, etc.)
- Mobile-friendly responsive design with hamburger menu
- **Read More / Read Less** toggle in the About section
- Contact form using a `mailto:` flow (no backend required)
- Dark theme with clean UI and smooth transitions
- Floating button/link to open the AI Assistant app

### AI Portfolio Assistant (Django + OpenRouter)
- Chatbot that answers questions like:
	- “What projects has Hudson built?”
	- “What are Hudson’s skills?”
- Uses **GPT-4o-mini** through the **OpenRouter API**
- Knowledge comes from a single editable file: `data.json`
- Built-in safeguards to keep answers on-topic and prevent hallucinations
- Conversation history trimming to control token usage and keep the app fast

---

## Tech Stack
### Frontend (Portfolio)
- **HTML5** — single-page structure
- **CSS3** — dark theme, responsive layout, animations
- **JavaScript (Vanilla)** — menu toggle, read-more toggle, `mailto:` contact logic
- **Icons:** Boxicons, Font Awesome
- **Fonts:** Google Fonts (Montserrat)

### Backend (AI Assistant)
- **Python**
- **Django**
- **OpenRouter API** — routes requests to GPT-4o-mini
- **requests** — HTTP calls from Django
- **WhiteNoise** — static file serving in production
- **python-dotenv** — environment variable management

---

## How It Works

### Portfolio Website
The portfolio is fully static (no backend). JavaScript handles:
- Mobile navbar open/close + auto-close on link click
- About section expand/collapse
- Contact form → opens the user’s email client via `mailto:`

### AI Assistant
On each chat request:
1. Django loads `data.json`
2. Data is compacted into a short summary for the prompt
3. Conversation history is sanitized and trimmed (last ~12 turns)
4. A strict system prompt enforces “Hudson-only” answers
5. The app calls OpenRouter and returns the response to the browser UI

---

## Folder / Files (typical)
- `index.html` — portfolio page
- `style.css` — portfolio styling
- `script.js` — portfolio interactivity
- `portfolio_ai/` — Django project
- `chat/` — Django app for chatbot
- `data.json` — chatbot knowledge base

---

## Deployment
- **Portfolio:** GitHub Pages or any static hosting (no build step)
- **AI Assistant:** Deploy Django app on Render / Replit (Gunicorn recommended), with WhiteNoise for static files

---

## Author
**Hudson Mathew** — March 2026
