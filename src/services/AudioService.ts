import Tts from 'react-native-tts';

class AudioService {
  private static instance: AudioService;

  private constructor() {
    this.initializeTTS();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private initializeTTS(): void {
    Tts.setDefaultLanguage('zh-CN');
    Tts.setDefaultRate(0.5); // Slower rate for elderly users
    Tts.setDefaultPitch(1.0);
  }

  // Text-to-Speech functions for literacy module
  async speakText(text: string): Promise<void> {
    try {
      await Tts.speak(text);
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }

  async speakPinyin(pinyin: string): Promise<void> {
    try {
      // Speak pinyin with emphasis
      await Tts.speak(`拼音：${pinyin}`);
    } catch (error) {
      console.error('TTS Pinyin Error:', error);
    }
  }

  async speakMeaning(meaning: string): Promise<void> {
    try {
      await Tts.speak(`意思是：${meaning}`);
    } catch (error) {
      console.error('TTS Meaning Error:', error);
    }
  }

  stopSpeaking(): void {
    Tts.stop();
  }

  // Voice instructions for elderly users
  async speakInstruction(instruction: string): Promise<void> {
    try {
      await Tts.speak(instruction);
    } catch (error) {
      console.error('TTS Instruction Error:', error);
    }
  }
}

export default AudioService;
