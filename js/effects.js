
(() => {
    function beep(freq = 660, duration = 0.12, volume = 0.035) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = freq;
            osc.type = "square";
            gain.gain.value = volume;

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
            osc.onended = () => ctx.close();
        } catch (e) {}
    }

    function addEffects(root) {
        if (document.getElementById("ot-effects-style")) return;

        const style = document.createElement("style");
        style.id = "ot-effects-style";
        style.textContent = `
            .ot-chaos {
                position: relative !important;
                isolation: isolate;
                overflow: hidden !important;
            }

            .ot-visual {
                position: absolute;
                inset: 0;
                z-index: 50;
                pointer-events: none;
                overflow: hidden;
                background: transparent;
            }

            .ot-visual::before {
                content: "";
                position: absolute;
                inset: 0;
                background: repeating-linear-gradient(
                    transparent 0px,
                    transparent 3px,
                    rgba(255,255,255,.10) 4px
                );
                opacity: .35;
                animation: ot-scan .12s linear infinite;
            }

            .ot-visual::after {
                content: "";
                position: absolute;
                inset: 0;
                background: repeating-radial-gradient(
                    circle,
                    rgba(255,255,255,.13) 0 1px,
                    transparent 1px 3px
                );
                opacity: .12;
                animation: ot-noise .15s steps(2) infinite;
            }

            .ot-terminal {
                position: absolute;
                left: 4%;
                right: 4%;
                bottom: 5%;
                max-height: 38%;
                overflow: hidden;
                padding: 12px;
                color: #55ff91;
                background: rgba(0,0,0,.88);
                border: 1px solid #24ff70;
                box-shadow: 0 0 18px rgba(0,255,90,.35);
                font: 11px/1.5 monospace;
                text-align: left;
                text-shadow: 0 0 7px #00ff55;
            }

            .ot-chaos.ot-glitch {
                animation: ot-shake .12s steps(2) infinite;
                filter: contrast(1.3) saturate(1.6);
            }

            .ot-chaos.ot-red {
                box-shadow: inset 0 0 80px rgba(255,0,0,.8);
                animation: ot-flash .22s steps(2) infinite;
            }

            .ot-chaos.ot-extreme {
                animation: ot-extreme .09s steps(2) infinite;
                filter: contrast(1.8) saturate(2);
            }

            @keyframes ot-scan {
                from { transform: translateY(0); }
                to { transform: translateY(4px); }
            }

            @keyframes ot-noise {
                0% { transform: translate(0,0); }
                25% { transform: translate(3px,-2px); }
                50% { transform: translate(-2px,2px); }
                75% { transform: translate(2px,3px); }
                100% { transform: translate(-3px,-2px); }
            }

            @keyframes ot-shake {
                0% { transform: translate(0); }
                25% { transform: translate(2px,-1px); }
                50% { transform: translate(-2px,1px); }
                75% { transform: translate(1px,2px); }
                100% { transform: translate(-1px,-2px); }
            }

            @keyframes ot-flash {
                0%,100% { background-color: transparent; }
                50% { background-color: rgba(255,0,0,.15); }
            }

            @keyframes ot-extreme {
                0% { transform: translate(0); }
                20% { transform: translate(4px,-3px) skewX(2deg); }
                40% { transform: translate(-4px,2px) skewX(-2deg); }
                60% { transform: translate(3px,3px); }
                80% { transform: translate(-3px,-2px) skewX(1deg); }
                100% { transform: translate(0); }
            }

            @media (prefers-reduced-motion: reduce) {
                .ot-chaos, .ot-chaos * {
                    animation-duration: .5s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function startIncident(done) {
        let seconds = 10;
        let elapsed = 0;

        const el = document.getElementById("countdown");
        const root =
            document.querySelector(".incident.active") ||
            document.querySelector(".incident");

        if (!el || !root) {
            done();
            return;
        }

        addEffects(root);

        root.classList.add("ot-chaos");

        const visual = document.createElement("div");
        visual.className = "ot-visual";
        visual.innerHTML = '<div class="ot-terminal"></div>';
        root.appendChild(visual);

        const terminal = visual.querySelector(".ot-terminal");

        const messages = [
            "[SYSTEM] Connessione stabilita...",
            "[SCAN] Analisi rete in corso...",
            "[WARNING] Attività anomala rilevata",
            "[ACCESS] Verifica autorizzazioni...",
            "[ERROR] Protocollo di sicurezza...",
            "[SYSTEM] Caricamento processo...",
            "[ALERT] ACCESSO NON AUTORIZZATO",
            "[WARNING] Sistema compromesso...",
            "[ERROR] Errore critico...",
            "[SYSTEM] Connessione instabile..."
        ];

        let messageIndex = 0;

        function addLine() {
            const line = document.createElement("div");
            line.textContent = messages[messageIndex % messages.length];
            terminal.appendChild(line);
            messageIndex++;

            while (terminal.children.length > 7) {
                terminal.removeChild(terminal.firstChild);
            }
        }

        addLine();
        beep(180, .3, .05);

        const terminalTimer = setInterval(addLine, 350);

        const countdownTimer = setInterval(() => {
            seconds--;
            elapsed++;

            el.textContent = "00:" + String(seconds).padStart(2, "0");

            if (seconds === 7) {
                root.classList.add("ot-glitch");
                beep(420, .15, .05);
            }

            if (seconds === 4) {
                root.classList.add("ot-red");
                beep(650, .18, .06);
            }

            if (seconds === 2) {
                root.classList.add("ot-extreme");
                beep(850, .2, .07);
            }

            if (seconds > 0 && seconds <= 3) {
                beep(950, .09, .06);
            }

            if (seconds <= 0) {
                clearInterval(countdownTimer);
                clearInterval(terminalTimer);

                root.classList.remove(
                    "ot-chaos",
                    "ot-glitch",
                    "ot-red",
                    "ot-extreme"
                );

                visual.remove();

                done();
            }
        }, 1000);
    }

    window.OTEffects = { startIncident };
})();
