// audioController.js
export default class AudioController {
    constructor(serverUrl) {
        this.serverUrl = serverUrl; // WebSocket server URL
        this.audioContext = null;
        this.mediaStream = null;
        this.mediaRecorder = null;
        this.ws = null;
    }

    /** Initialize WebSocket Connection */
    initWebSocket() {
        this.ws = new WebSocket(this.serverUrl);
        
        this.ws.onopen = () => console.log("WebSocket connected!");
        this.ws.onmessage = (event) => this.handleServerResponse(event);
        this.ws.onerror = (error) => console.error("WebSocket error:", error);
        this.ws.onclose = () => console.log("WebSocket closed.");
    }

    /** Capture browser audio using getDisplayMedia */
    async startCapture() {
        try {
            this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
                audio: { echoCancellation: false },
                video: false
            });

            this.audioContext = new AudioContext();
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.processAudio(source);
        } catch (err) {
            console.error("Error capturing audio:", err);
        }
    }

    /** Process and send audio data */
    processAudio(source) {
        const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(this.audioContext.destination);

        processor.onaudioprocess = (event) => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const audioData = event.inputBuffer.getChannelData(0);
                this.ws.send(audioData);
            }
        };
    }

    /** Stop audio capture */
    stopCapture() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            console.log("Audio capture stopped.");
        }
    }

    /** Handle WebSocket response (e.g., received MusicXML) */
    handleServerResponse(event) {
        const data = JSON.parse(event.data);
        console.log("Received from server:", data);

        if (data.type === "musicxml") {
            this.updateSheetMusic(data.musicXML);
        } else if (data.type === "error") {
            console.error("Server error:", data.message);
        }
    }

    /** Utility: Update sheet music UI */
    updateSheetMusic(musicXML) {
        console.log("Updating sheet music...");
        // Call sheetRenderer.js to update UI
        import('./sheetRenderer.js').then(module => {
            module.renderSheetMusic(musicXML);
        });
    }
}
