
export enum Emotion {
  SAD = 'Sad',
  HAPPY = 'Happy',
  ANGRY = 'Angry',
  NEUTRAL = 'Neutral',
  DEEP = 'Deep'
}

export enum VoiceType {
  MALE_DEEP = 'Male – Deep Narrator',
  MALE_YOUNG = 'Male – Young',
  FEMALE_SOFT = 'Female – Soft',
  FEMALE_OLD = 'Female – Old'
}

export interface TTSRequestConfig {
  text: string;
  emotion: Emotion;
  voiceType: VoiceType;
  addPauses: boolean;
}

export interface TTSSettings {
  speakingRate: number;
  pitch: number;
}
