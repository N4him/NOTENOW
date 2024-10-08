// utils/speechRecognition.js
export class SpeechRecognitionService {
  constructor(onResult, onEnd) {
    this.recognition = null;
    this.isRecording = false;
    this.onResultCallback = onResult;
    this.onEndCallback = onEnd;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'es-ES'; // Cambia el idioma según sea necesario

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.onResultCallback(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        this.onResultCallback(interimTranscript);
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.onEndCallback();
      };
    } else {
      console.warn('API de reconocimiento de voz no soportada en este navegador.');
    }
  }

  start() {
    if (this.recognition && !this.isRecording) {
      this.recognition.start();
      this.isRecording = true;
    }
  }

  stop() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }
}
