
import { GoogleGenAI, Modality } from "@google/genai";
import { TTSRequestConfig } from '../types';
import { Emotion, VoiceType } from '../types';

// Helper to wrap raw PCM data in a WAV header so browsers can play/download it
function createWavFile(pcmBase64: string, sampleRate: number = 24000): string {
  const binaryString = atob(pcmBase64);
  const pcmLength = binaryString.length;
  const buffer = new ArrayBuffer(44 + pcmLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  /* RIFF identifier */
  writeString(0, 'RIFF');
  /* file length */
  view.setUint32(4, 32 + pcmLength, true);
  /* RIFF type */
  writeString(8, 'WAVE');
  /* format chunk identifier */
  writeString(12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (1 = PCM) */
  view.setUint16(20, 1, true);
  /* channel count (1 = Mono) */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sampleRate * blockAlign) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (channels * bytesPerSample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(36, 'data');
  /* data chunk length */
  view.setUint32(40, pcmLength, true);

  /* write PCM data */
  for (let i = 0; i < pcmLength; i++) {
    view.setUint8(44 + i, binaryString.charCodeAt(i));
  }

  // Convert the whole buffer to a base64 string
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const synthesizeSpeech = async (config: TTSRequestConfig): Promise<string> => {
  const { text, emotion, voiceType, addPauses } = config;
  
  // Initialize Gemini AI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Map Voice Types to Gemini prebuilt voices
  const voiceMap: Record<VoiceType, string> = {
    [VoiceType.MALE_DEEP]: 'Fenrir',
    [VoiceType.MALE_YOUNG]: 'Zephyr',
    [VoiceType.FEMALE_SOFT]: 'Kore',
    [VoiceType.FEMALE_OLD]: 'Puck',
  };

  // Map emotions to descriptive cinematic prompts
  const emotionPrompts: Record<Emotion, string> = {
    [Emotion.SAD]: "with a heavy, sorrowful, and crying tone. Very emotional and slow.",
    [Emotion.HAPPY]: "with a bright, joyful, and enthusiastic energy. Uplifting.",
    [Emotion.ANGRY]: "with a sharp, intense, and aggressive tone. Strong emphasis.",
    [Emotion.NEUTRAL]: "in a clear, professional, and steady narrative voice.",
    [Emotion.DEEP]: "with a low, gravelly, epic cinematic narrator voice. Dramatic and slow.",
  };

  const pauseInstruction = addPauses ? "Insert dramatic pauses after every comma and period for a cinematic effect." : "";
  
  const prompt = `Narrate the following Sinhala text ${emotionPrompts[emotion]} ${pauseInstruction}
  
Text to narrate:
"${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceMap[voiceType] },
          },
        },
      },
    });

    const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Pcm) {
      throw new Error("No audio content received from the AI.");
    }

    // Wrap the raw PCM in a WAV header for compatibility
    return createWavFile(base64Pcm, 24000);
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Failed to generate cinematic audio.");
  }
};
