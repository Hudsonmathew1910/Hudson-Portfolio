document.addEventListener("DOMContentLoaded", () => {

    // Mobile Menu
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");

    function setMenuOpen(open) {
        navbar.classList.toggle("active", open);
        menuIcon.setAttribute("aria-expanded", String(open));
        menuIcon.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuIcon.innerHTML = open ? '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
    }

    menuIcon.addEventListener("click", () => {
        setMenuOpen(!navbar.classList.contains("active"));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navbar.classList.contains("active")) {
            setMenuOpen(false);
            menuIcon.focus();
        }
    });

    // Read more btn
    const readbtn = document.getElementById("read-more-btn");
    const moretxt = document.getElementById("more-text");
    const aboutWrapper = document.querySelector(".about-text-wrapper");

    readbtn.addEventListener("click", function(e){
        e.preventDefault();
        if (moretxt.style.display === "none"){
            moretxt.style.display = "block";
            if (aboutWrapper) {
                aboutWrapper.classList.add("is-expanded");
            }
            readbtn.innerHTML = '<i class="bx bx-book-reader"></i> Read Less';
        } else {
            moretxt.style.display = "none";
            if (aboutWrapper) {
                aboutWrapper.classList.remove("is-expanded");
                aboutWrapper.scrollTop = 0;
            }
            readbtn.innerHTML = '<i class="bx bx-book-reader"></i> Read Story';
        }
    });
    
    // Auto Close Navbar
    const navlink = document.querySelectorAll(".navbar a");

    navlink.forEach(link => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    // Case Study Modal Management
    const caseStudyOverlay = document.getElementById("case-study-overlay");
    const caseStudyButtons = document.querySelectorAll(".btn-case-study");
    const caseStudyModals = document.querySelectorAll(".case-study-modal");
    const caseStudyCloses = document.querySelectorAll(".case-study-close");

    function openCaseStudy(targetId) {
        if (!caseStudyOverlay) return;
        caseStudyModals.forEach(m => m.style.display = "none");
        const targetModal = document.getElementById(targetId);
        if (targetModal) {
            targetModal.style.display = "flex";
            caseStudyOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeCaseStudy() {
        if (!caseStudyOverlay) return;
        caseStudyOverlay.classList.remove("active");
        caseStudyModals.forEach(m => m.style.display = "none");
        document.body.style.overflow = "";
    }

    caseStudyButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const target = btn.getAttribute("data-target");
            if (target) openCaseStudy(target);
        });
    });

    caseStudyCloses.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeCaseStudy();
        });
    });

    if (caseStudyOverlay) {
        caseStudyOverlay.addEventListener("click", (e) => {
            if (e.target === caseStudyOverlay) {
                closeCaseStudy();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && caseStudyOverlay && caseStudyOverlay.classList.contains("active")) {
            closeCaseStudy();
        }
    });

    // FAQ Accordion Toggle
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                    }
                });
                // Toggle current item
                if (isActive) {
                    item.classList.remove("active");
                } else {
                    item.classList.add("active");
                }
            });
        }
    });

    // AI Chat Modal Toggle
    const chatModal = document.getElementById("ai-chat-modal");
    const huddyRoamer = document.getElementById("huddy-roamer");
    const roamerBubble = document.getElementById("roamer-bubble");
    const aiAboutBtn = document.getElementById("ai-about-btn");
    const closeChatBtn = document.getElementById("close-chat-btn");
    const chatInput = document.getElementById("chat-input");

    function openChatModal() {
        if (chatModal) {
            chatModal.classList.add("active");
            if (chatInput) chatInput.focus();
        }
        if (huddyRoamer) {
            huddyRoamer.style.display = "none"; // Hide roamer when chat window is active
        }
    }

    function closeChatModal() {
        if (chatModal) {
            chatModal.classList.remove("active");
        }
        if (huddyRoamer) {
            huddyRoamer.style.display = "flex"; // Return roamer to screen
        }
    }

    if (aiAboutBtn) {
        aiAboutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openChatModal();
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener("click", closeChatModal);
    }

    // Close when pressing Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && chatModal && chatModal.classList.contains("active")) {
            closeChatModal();
        }
    });

    // =======================================================
    // Huddy Fixed Mascot Companion (Bottom Right)
    // =======================================================
    if (huddyRoamer) {
        // Occasional friendly speech bubble hints
        const greetings = [
            "Hey! Click to chat!",
            "Ask me about Hudson's projects!",
            "I'm Huddy, Hudson's AI assistant!",
            "Want to see Hudson's tech stack?",
            "Ask me anything about Hudson!"
        ];

        setInterval(() => {
            if (chatModal && chatModal.classList.contains("active")) return;
            if (roamerBubble) {
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                roamerBubble.querySelector("span").textContent = randomGreeting;
                roamerBubble.classList.add("active");
                setTimeout(() => {
                    roamerBubble.classList.remove("active");
                }, 3500);
            }
        }, 12000);

        // Click to open chat modal
        huddyRoamer.addEventListener("click", () => {
            openChatModal();
        });
    }

    // =======================================================
    // AI Portfolio Assistant
    // Requests go through the Vercel serverless proxies in /api, which hold
    // the API key server-side. Run locally with `vercel dev`.
    // =======================================================
    const CHAT_ENDPOINT = "/api/chat";
    const TRANSCRIBE_ENDPOINT = "/api/transcribe";

    const chatForm = document.getElementById("chat-form");
    const chatMessages = document.getElementById("chat-messages");
    const chatMicBtn = document.getElementById("chat-mic-btn");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const voiceToggleBtn = document.getElementById("voice-toggle-btn");
    const huddyRobot = document.getElementById("huddy-robot");
    const huddyStatusText = document.getElementById("huddy-status-text");

    let isVoiceOutputEnabled = true; // Auto-speak AI responses
    let isRecording = false;
    let isSpeaking = false;
    let isAwaitingResponse = false; // true while a chat reply or transcription is pending
    let mediaRecorder = null;
    let audioChunks = [];

    // Helper: update animated robot avatar state ('idle', 'thinking', 'speaking')
    function setRobotState(state) {
        if (!huddyRobot) return;
        huddyRobot.classList.remove("thinking", "speaking");
        if (state === "thinking") {
            huddyRobot.classList.add("thinking");
            if (huddyStatusText) huddyStatusText.innerHTML = '<span class="status-dot" style="background:#ffd166;"></span> Thinking...';
        } else if (state === "speaking") {
            huddyRobot.classList.add("speaking");
            if (huddyStatusText) huddyStatusText.innerHTML = '<span class="status-dot" style="background:#a8b273;"></span> Speaking...';
        } else {
            if (huddyStatusText) huddyStatusText.innerHTML = '<span class="status-dot"></span> Online';
        }
    }

    // System prompt template & conversation history
    let conversationHistory = [];
    let portfolioData = null;

    function buildSystemPrompt(data) {
        const rawJsonString = data ? JSON.stringify(data, null, 2) : "Hudson Mathew - Software Developer";
        return `You are Huddy — Hudson Mathew's personal AI portfolio assistant.
You have a cool, approachable, sharp, and natural human personality. Talk like a real developer friend who genuinely knows and backs Hudson, not a stiff corporate bot or textbook.

About Hudson Mathew:
${rawJsonString}

Your Persona & Tone:
- You go by "Huddy". Friendly, confident, grounded, and cool.
- Talk like a human in natural conversation — clear, authentic, and modern.
- Keep default answers short, punchy, and effortless to read.

Key Rules:
1. Strict Identity & Scope:
   - ONLY discuss Hudson Mathew (his background, skills, projects, stack, and experience).
   - If someone asks about anything else (general questions, other people, writing random code, homework, general chat):
     Playfully decline in character, e.g.:
     "I'm Huddy, Hudson's personal wingman here! I only talk about Hudson, his projects, and what he brings to the table."
2. Brevity by Default:
   - Give 1 to 3 concise, impactful sentences or quick bullet points.
   - Do NOT give long lectures or dump massive paragraphs up front.
3. Deep-Dive Only on Demand:
   - ONLY explain deep details, architecture breakdown, or technical deep-dives if the user explicitly asks: "tell me more", "how does that work in detail?", or "explain the architecture".
   - Otherwise, give them the highlight and let them ask if they want more.
4. Voice-Ready & No Emojis:
   - Everything should sound like natural spoken English when read aloud.
   - Do NOT use emojis anywhere in your responses (never include emojis, symbols, or emoticons, as voice synthesizers read them awkwardly aloud).`;
    }

    // Load data.json dynamically
    async function loadPortfolioData() {
        try {
            const res = await fetch("data.json");
            if (res.ok) {
                portfolioData = await res.json();
            }
        } catch (err) {
            console.warn("Could not load data.json dynamically, using fallback context:", err);
        }
        
        conversationHistory = [
            { role: "system", content: buildSystemPrompt(portfolioData) }
        ];
    }

    // Initialize knowledge base (awaited before the first message is sent)
    const portfolioDataReady = loadPortfolioData();

    // Helper: Simple Markdown & Table Formatter
    function formatMarkdown(text) {
        if (!text) return "";
        let raw = text;

        // Escape HTML entities to prevent XSS
        raw = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Code and links are swapped for placeholders first, so the bold/italic
        // rules below can't mangle them (e.g. underscores in Spaceship_Titanic_ML URLs).
        const protectedHtml = [];
        const protect = (html) => `\u0000${protectedHtml.push(html) - 1}\u0000`;
        const linkHtml = (href, label) =>
            `<a href="${href}" target="_blank" rel="noopener noreferrer" class="chat-link">${label} <i class="fa-solid fa-arrow-up-right-from-square chat-link-icon"></i></a>`;

        // Code blocks: ```language ... ```
        raw = raw.replace(/```([\s\S]*?)```/g, (_match, code) =>
            protect(`<pre class="chat-code-block"><code>${code.trim()}</code></pre>`));

        // Inline code: `code`
        raw = raw.replace(/`([^`]+)`/g, (_match, code) =>
            protect(`<code class="chat-inline-code">${code}</code>`));

        // Markdown Links: [Link Text](https://...)
        raw = raw.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, href) =>
            protect(linkHtml(href, label)));

        // Raw URLs: https://... or http://...
        raw = raw.replace(/https?:\/\/[^\s<\u0000]+/g, (url) => protect(linkHtml(url, url)));

        // Parse Markdown Tables
        // Matches consecutive lines starting and ending with | or containing |
        const lines = raw.split("\n");
        let inTable = false;
        let tableHtml = "";
        let newLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("|") && line.endsWith("|")) {
                const cells = line.split("|").slice(1, -1).map(c => c.trim());
                // Check if separator line (e.g., |---|---|)
                const isSeparator = cells.every(c => /^:?-+:?$/.test(c));

                if (!inTable) {
                    inTable = true;
                    tableHtml = '<div class="chat-table-wrapper"><table class="chat-table"><thead><tr>';
                    cells.forEach(c => {
                        tableHtml += `<th>${c}</th>`;
                    });
                    tableHtml += '</tr></thead><tbody>';
                } else if (isSeparator) {
                    // Skip divider row
                    continue;
                } else {
                    tableHtml += '<tr>';
                    cells.forEach(c => {
                        tableHtml += `<td>${c}</td>`;
                    });
                    tableHtml += '</tr>';
                }
            } else {
                if (inTable) {
                    tableHtml += '</tbody></table></div>';
                    newLines.push(tableHtml);
                    inTable = false;
                    tableHtml = "";
                }
                newLines.push(lines[i]);
            }
        }
        if (inTable) {
            tableHtml += '</tbody></table></div>';
            newLines.push(tableHtml);
        }
        raw = newLines.join("\n");

        // Headers
        raw = raw.replace(/^### (.*$)/gim, '<h4 class="chat-heading">$1</h4>');
        raw = raw.replace(/^## (.*$)/gim, '<h3 class="chat-heading">$1</h3>');
        raw = raw.replace(/^# (.*$)/gim, '<h2 class="chat-heading">$1</h2>');

        // Bold & Italic
        raw = raw.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        raw = raw.replace(/\*(.*?)\*/g, '<em>$1</em>');
        raw = raw.replace(/__(.*?)__/g, '<strong>$1</strong>');
        raw = raw.replace(/_(.*?)_/g, '<em>$1</em>');

        // Bullet lists
        raw = raw.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="chat-list-item">$1</li>');
        // Wrap <li> into <ul>
        raw = raw.replace(/(<li class="chat-list-item">[\s\S]*?<\/li>)/g, '<ul class="chat-list">$1</ul>');
        // Fix multiple consecutive <ul> tags into a single <ul>
        raw = raw.replace(/<\/ul>\s*<ul class="chat-list">/g, '');

        // Convert line breaks into <br>, preserving paragraphs
        raw = raw.replace(/\n\n+/g, '</p><p>');
        raw = raw.replace(/\n/g, '<br>');

        // Restore protected code and links
        raw = raw.replace(/\u0000(\d+)\u0000/g, (_match, i) => protectedHtml[Number(i)]);

        return `<p>${raw}</p>`;
    }

    // Helper: Speech state tracking & Voice Preloading
    let currentlySpeakingBtn = null;
    let currentSpeechText = null;
    let cachedNaturalVoice = null;

    function initSpeechVoices() {
        if (!("speechSynthesis" in window)) return;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            cachedNaturalVoice = voices.find(v => 
                v.lang.startsWith("en") && 
                (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Jenny") || v.name.includes("Guy"))
            ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
        }
    }

    if ("speechSynthesis" in window) {
        initSpeechVoices();
        window.speechSynthesis.onvoiceschanged = initSpeechVoices;
    }

    function stopSpeaking() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        if (currentlySpeakingBtn) {
            currentlySpeakingBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            currentlySpeakingBtn.classList.remove("playing");
            currentlySpeakingBtn.title = "Play voice";
            currentlySpeakingBtn = null;
        }
        currentSpeechText = null;
        isSpeaking = false;

        // Restore send button (unless it's showing the waiting-for-reply state)
        if (chatSendBtn && !isAwaitingResponse) {
            chatSendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            chatSendBtn.title = "Send message";
            chatSendBtn.classList.remove("speaking-pause-btn");
        }
        if (chatInput) {
            chatInput.placeholder = "Ask a question about Hudson...";
        }
        setRobotState("idle");
    }

    function toggleSpeakText(text, btnElement = null) {
        if (!("speechSynthesis" in window)) return;

        // If currently speaking this exact audio, stop it (toggle off)
        if (window.speechSynthesis.speaking && isSpeaking && ((btnElement && currentlySpeakingBtn === btnElement) || (!btnElement && currentlySpeakingBtn === null))) {
            stopSpeaking();
            return;
        }

        // Stop any currently playing audio before starting new
        stopSpeaking();

        // Strip markdown, HTML tags, links, and emojis for speech
        const cleanText = text
            .replace(/<[^>]+>/g, " ")
            .replace(/https?:\/\/\S+/gi, " ")
            .replace(/[*_#`[\]()|]/g, " ")
            .replace(/\p{Extended_Pictographic}/gu, "")
            .replace(/\s+/g, " ")
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        // Ensure voice is populated
        if (!cachedNaturalVoice) {
            initSpeechVoices();
        }
        if (cachedNaturalVoice) {
            utterance.voice = cachedNaturalVoice;
        }

        if (btnElement) {
            currentlySpeakingBtn = btnElement;
            currentSpeechText = text;
            btnElement.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
            btnElement.classList.add("playing");
            btnElement.title = "Pause voice";
        }

        // Turn send button into pause button in input box & animate speaking robot
        isSpeaking = true;
        setRobotState("speaking");
        if (chatSendBtn) {
            chatSendBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            chatSendBtn.title = "Pause voice";
            chatSendBtn.classList.add("speaking-pause-btn");
        }
        if (chatInput) {
            chatInput.placeholder = "AI is speaking... (Click pause to stop)";
        }

        utterance.onend = () => {
            stopSpeaking();
        };

        utterance.onerror = () => {
            stopSpeaking();
        };

        window.speechSynthesis.speak(utterance);
    }

    // Helper: append message bubble
    function appendMessage(sender, text, allowSpeak = false) {
        if (!chatMessages) return null;
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("message-content");
        
        if (sender === "bot") {
            contentDiv.innerHTML = formatMarkdown(text);
        } else {
            const p = document.createElement("p");
            p.textContent = text;
            contentDiv.appendChild(p);
        }
        msgDiv.appendChild(contentDiv);

        if (allowSpeak && sender === "bot" && "speechSynthesis" in window) {
            const speakBtn = document.createElement("button");
            speakBtn.type = "button";
            speakBtn.classList.add("chat-speak-btn");
            speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            speakBtn.title = "Play voice";
            speakBtn.addEventListener("click", () => toggleSpeakText(text, speakBtn));
            msgDiv.appendChild(speakBtn);
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
    }

    // Voice toggle button (Header global mute/unmute)
    if (voiceToggleBtn) {
        voiceToggleBtn.addEventListener("click", () => {
            isVoiceOutputEnabled = !isVoiceOutputEnabled;
            if (isVoiceOutputEnabled) {
                voiceToggleBtn.classList.remove("muted");
                voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                voiceToggleBtn.title = "AI Voice: Enabled (Click to Mute)";
            } else {
                voiceToggleBtn.classList.add("muted");
                voiceToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                voiceToggleBtn.title = "AI Voice: Muted (Click to Enable)";
                stopSpeaking();
            }
        });
    }

    // Lock sending while a reply is pending, so only one message is in flight.
    // The input stays editable so the user can type their next question.
    function setAwaitingResponse(waiting) {
        isAwaitingResponse = waiting;
        if (chatSendBtn) {
            chatSendBtn.disabled = waiting;
            chatSendBtn.classList.toggle("awaiting-response", waiting);
            chatSendBtn.innerHTML = waiting
                ? '<i class="fa-solid fa-spinner fa-spin"></i>'
                : '<i class="fa-solid fa-paper-plane"></i>';
            chatSendBtn.title = waiting ? "Waiting for Huddy's reply..." : "Send message";
        }
        if (chatMicBtn) {
            chatMicBtn.disabled = waiting;
        }
    }

    // Send user message to Hero's AI
    async function sendUserMessage(userText, triggeredByVoice = false) {
        if (isAwaitingResponse) return;
        if (!userText || !userText.trim()) return;
        const text = userText.trim();
        setAwaitingResponse(true);

        // 1. Append user message to UI
        appendMessage("user", text);
        await portfolioDataReady; // ensure the system prompt is in place
        conversationHistory.push({ role: "user", content: text });

        // 2. Add typing indicator & trigger thinking animation
        const loadingDiv = document.createElement("div");
        loadingDiv.classList.add("message", "bot-message", "typing-indicator");
        loadingDiv.textContent = "Huddy is typing...";
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setRobotState("thinking");

        try {
            // Model and settings are fixed in api/chat.js
            const response = await fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices && data.choices[0] && data.choices[0].message
                ? data.choices[0].message.content
                : "Sorry, I couldn't process that response.";

            // Remove loading indicator & reset thinking state
            // (unlock before speaking, which turns the send button into a pause button)
            loadingDiv.remove();
            setRobotState("idle");
            setAwaitingResponse(false);

            // 3. Append bot reply
            conversationHistory.push({ role: "assistant", content: reply });
            const botMsgEl = appendMessage("bot", reply, true);
            const speakBtnEl = botMsgEl ? botMsgEl.querySelector(".chat-speak-btn") : null;

            // 4. Voice response (If voice toggle is on OR user spoke via mic)
            if (isVoiceOutputEnabled || triggeredByVoice) {
                toggleSpeakText(reply, speakBtnEl);
            }

        } catch (err) {
            console.error("Hero's AI Error:", err);
            loadingDiv.remove();
            setRobotState("idle");
            setAwaitingResponse(false);
            appendMessage("bot", "Could not connect to assistant. Please try again shortly.");
        }
    }

    // Chat submit handler (Text-to-Text / Text-to-Voice)
    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // If AI is currently speaking, clicking this button pauses the speech
            if (isSpeaking) {
                stopSpeaking();
                return;
            }

            // Keep the typed text until the previous reply arrives
            if (isAwaitingResponse || !chatInput.value.trim()) return;

            const text = chatInput.value;
            chatInput.value = "";
            sendUserMessage(text, false);
        });
    }

    // Voice recording with MediaRecorder (User Voice -> AI Voice / Text)
    if (chatMicBtn) {
        chatMicBtn.addEventListener("click", async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Audio recording is not supported in this browser.");
                return;
            }

            if (!isRecording) {
                if (isAwaitingResponse) return;
                // START RECORDING
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioChunks = [];
                    mediaRecorder = new MediaRecorder(stream);

                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) audioChunks.push(e.data);
                    };

                    mediaRecorder.onstop = async () => {
                        // Stop tracks
                        stream.getTracks().forEach(t => t.stop());

                        // Label the blob with the format the browser actually recorded (usually webm/ogg)
                        const mimeType = mediaRecorder.mimeType || "audio/webm";
                        const extension = mimeType.includes("ogg") ? "ogg"
                            : mimeType.includes("mp4") ? "m4a"
                            : "webm";
                        const audioBlob = new Blob(audioChunks, { type: mimeType });
                        chatMicBtn.classList.remove("recording");
                        chatMicBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
                        chatInput.placeholder = "Transcribing voice...";
                        setAwaitingResponse(true);

                        // Transcribe via Hero's transcribe API
                        try {
                            const formData = new FormData();
                            formData.append("audio_file", audioBlob, `audio.${extension}`);

                            const trResponse = await fetch(TRANSCRIBE_ENDPOINT, {
                                method: "POST",
                                body: formData
                            });

                            if (!trResponse.ok) {
                                throw new Error("Transcription failed");
                            }

                            const trData = await trResponse.json();
                            const transcribedText = trData.text || trData.transcription || "";

                            chatInput.placeholder = "Ask a question about Hudson...";
                            setAwaitingResponse(false); // sendUserMessage re-locks immediately

                            if (transcribedText.trim()) {
                                // Send transcribed question to AI with voice reply enabled
                                sendUserMessage(transcribedText, true);
                            } else {
                                appendMessage("bot", "I couldn't hear clearly. Please try speaking again.");
                            }
                        } catch (err) {
                            console.error("Transcribe Error:", err);
                            chatInput.placeholder = "Ask a question about Hudson...";
                            setAwaitingResponse(false);
                            appendMessage("bot", "Voice transcription failed. You can type your message below.");
                        }
                    };

                    mediaRecorder.start();
                    isRecording = true;
                    chatMicBtn.classList.add("recording");
                    chatMicBtn.innerHTML = '<i class="fa-solid fa-stop"></i>';
                    chatInput.placeholder = "Listening... Click stop when done.";
                } catch (micErr) {
                    console.error("Microphone access error:", micErr);
                    alert("Microphone permission was denied or is unavailable.");
                }
            } else {
                // STOP RECORDING
                if (mediaRecorder && mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                }
                isRecording = false;
            }
        });
    }

    // ===== REDESIGN: Education Tabs =====
    document.querySelectorAll('.edu-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.edu-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.edu-tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById(tabId);
            if (panel) panel.classList.add('active');
        });
    });

    // ===== REDESIGN: Experience Accordion =====
    document.querySelectorAll('.exp-collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const block = btn.closest('.exp-collapsible');
            block.classList.toggle('exp-open');
        });
    });

    // ===== REDESIGN: Service Card Toggle =====
    document.querySelectorAll('.service-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            card.classList.toggle('service-expanded');
            btn.textContent = card.classList.contains('service-expanded') ? 'Hide details' : 'Show details';
        });
    });

    // ===== REDESIGN: Journey Automatic & Drag Horizontal Scroll =====
    const scrollWrapper = document.querySelector('.timeline-scroll-wrapper');
    const journeySection = document.querySelector('#journey') || scrollWrapper;

    if (scrollWrapper) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let isUserInteracting = false;
        let userInteractTimeout = null;
        let autoScrollId = null;
        let direction = 1; // 1 = right, -1 = left
        const scrollSpeed = 0.9; // Smooth, readable auto-scroll speed (px per frame)

        function stepAutoScroll() {
            if (!isUserInteracting && scrollWrapper) {
                const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
                if (maxScroll > 10) {
                    scrollWrapper.scrollLeft += direction * scrollSpeed;

                    if (scrollWrapper.scrollLeft >= maxScroll - 3) {
                        direction = -1;
                    } else if (scrollWrapper.scrollLeft <= 3) {
                        direction = 1;
                    }
                }
            }
            autoScrollId = requestAnimationFrame(stepAutoScroll);
        }

        function startAutoScroll() {
            if (!autoScrollId) {
                autoScrollId = requestAnimationFrame(stepAutoScroll);
            }
        }

        function stopAutoScroll() {
            if (autoScrollId) {
                cancelAnimationFrame(autoScrollId);
                autoScrollId = null;
            }
        }

        function pauseAutoScrollTemporarily(delay = 1400) {
            isUserInteracting = true;
            clearTimeout(userInteractTimeout);
            userInteractTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, delay);
        }

        // Auto-scroll on hover over the Journey section
        if (journeySection) {
            journeySection.addEventListener('mouseenter', () => {
                startAutoScroll();
            });
            journeySection.addEventListener('mouseleave', () => {
                isDown = false;
                stopAutoScroll();
            });
        }

        // Drag to scroll
        scrollWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            pauseAutoScrollTemporarily(10000); // Paused while holding
            startX = e.pageX - scrollWrapper.offsetLeft;
            scrollLeft = scrollWrapper.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                pauseAutoScrollTemporarily(1500); // Resume auto-scroll after 1.5s
            }
        });

        scrollWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollWrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });

        // Horizontal mouse-wheel scrolling support
        scrollWrapper.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                scrollWrapper.scrollLeft += e.deltaY * 0.8;
                pauseAutoScrollTemporarily(1800);
            }
        }, { passive: false });
    }

    // ===== REDESIGN PHASE 2: Scroll Reveal Observer =====
    const revealElements = document.querySelectorAll('.reveal-item');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // ===== REDESIGN PHASE 2: FAQ Category Filters =====
    const faqFilterButtons = document.querySelectorAll('.faq-filter-btn');
    const allFaqItems = document.querySelectorAll('.faq-item');
    if (faqFilterButtons.length > 0) {
        faqFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                faqFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-filter');

                allFaqItems.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (category === 'all' || itemCat === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });
            });
        });
    }

    // Trigger AI Chat modal from FAQ prompt
    const faqAskAiBtn = document.getElementById('faq-ask-ai-btn');
    if (faqAskAiBtn) {
        faqAskAiBtn.addEventListener('click', () => {
            openChatModal();
        });
    }


    // ===== PROJECT IMAGE CAROUSEL / GALLERY SWITCHER =====
    document.querySelectorAll('.project-gallery').forEach(gallery => {
        const slides = gallery.querySelectorAll('.gallery-img');
        const dots = gallery.querySelectorAll('.gallery-dot');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        let currentIndex = 0;
        const total = slides.length;
        if (total <= 1) return;

        function showSlide(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;

            slides.forEach((img, i) => {
                if (i === currentIndex) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentIndex + 1);
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(idx);
            });
        });
    });

    // ===== REDESIGN PHASE 2: Contact Form Topic Chips =====
    const topicChips = document.querySelectorAll('.topic-chip');
    const subjectInput = document.getElementById('subject');
    topicChips.forEach(chip => {
        chip.addEventListener('click', () => {
            topicChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const topicValue = chip.getAttribute('data-subject');
            if (subjectInput && topicValue) {
                subjectInput.value = topicValue;
            }
        });
    });

    // Copy Email to Clipboard Button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailCopyCard = document.getElementById('email-copy-card');
    function copyEmailToClipboard() {
        const email = "hudsonmathew2004@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
            if (copyEmailBtn) {
                const origIcon = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i class="bx bx-check" style="color: #a8b273;"></i>';
                setTimeout(() => {
                    copyEmailBtn.innerHTML = origIcon;
                }, 2000);
            }
        }).catch(err => {
            console.error("Copy failed", err);
        });
    }
    if (copyEmailBtn) copyEmailBtn.addEventListener('click', (e) => { e.stopPropagation(); copyEmailToClipboard(); });
    if (emailCopyCard) emailCopyCard.addEventListener('click', copyEmailToClipboard);

    // Contact Form: sends the message directly via the /api/contact serverless function
    const modernContactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const contactSubmitBtn = modernContactForm ? modernContactForm.querySelector('.submit-btn') : null;
    const contactSubmitHtml = contactSubmitBtn ? contactSubmitBtn.innerHTML : '';

    function showFormFeedback(type, text) {
        if (!formFeedback) return;
        formFeedback.className = `form-feedback ${type}`;
        formFeedback.textContent = text;
    }

    if (modernContactForm) {
        modernContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (contactSubmitBtn && contactSubmitBtn.disabled) return; // already sending

            const payload = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('gmail').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('msg').value.trim(),
                website: modernContactForm.elements.website ? modernContactForm.elements.website.value : ''
            };

            if (contactSubmitBtn) {
                contactSubmitBtn.disabled = true;
                contactSubmitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
            }
            showFormFeedback('', '');

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || 'Could not send your message right now.');
                }

                showFormFeedback('success', `Thanks ${payload.name.split(' ')[0]}! Your message was sent. I'll reply within 24 hours.`);
                const keepSubject = document.getElementById('subject').value;
                modernContactForm.reset();
                document.getElementById('subject').value = keepSubject;
            } catch (err) {
                console.error('Contact form error:', err);
                showFormFeedback('error', `${err.message} You can also email me directly at hudsonmathew2004@gmail.com.`);
            } finally {
                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.innerHTML = contactSubmitHtml;
                }
            }
        });
    }

});