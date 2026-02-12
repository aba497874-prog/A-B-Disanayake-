
import { Emotion, VoiceType, TTSSettings } from './types';

export const DEFAULT_TEXT = "ඉතිහාසයට පෙර කාලයක… මේ දූපතේ වනයන් තුළ මනුෂ්‍යයෙකුට වඩා පරණ බියක් ජීවත් වුණා…";

// Note: These settings are now handled via AI prompting for more natural results 
// but we keep the structure for potential future fine-tuning.
export const EMOTION_MAPPING: Record<Emotion, TTSSettings> = {
  [Emotion.SAD]: { speakingRate: 0.8, pitch: -4.0 },
  [Emotion.HAPPY]: { speakingRate: 1.1, pitch: 2.0 },
  [Emotion.ANGRY]: { speakingRate: 1.2, pitch: 4.0 },
  [Emotion.NEUTRAL]: { speakingRate: 1.0, pitch: 0.0 },
  [Emotion.DEEP]: { speakingRate: 0.75, pitch: -6.0 },
};
