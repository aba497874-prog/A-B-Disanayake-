
import React, { useState } from 'react';
import { Emotion, VoiceType } from '../types';
import { DEFAULT_TEXT } from '../constants';
import { synthesizeSpeech } from '../services/ttsService';

const VoiceStudio: React.FC = () => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [emotion, setEmotion] = useState<Emotion>(Emotion.DEEP);
  const [voiceType, setVoiceType] = useState<VoiceType>(VoiceType.MALE_DEEP);
  const [addPauses, setAddPauses] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);
    setStatus('AI is narrating your script...');

    try {
      const base64Wav = await synthesizeSpeech({
        text,
        emotion,
        voiceType,
        addPauses
      });

      // Convert base64 WAV to Blob URL
      const byteCharacters = atob(base64Wav);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      setStatus('Success! Your cinematic narration is ready.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please ensure your environment is set up correctly.");
      setStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `cinematic-sinhala-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-3 tracking-tight">
          🎙️ Cinematic Voice Generator
        </h1>
        <p className="text-slate-400 text-lg">
          Generate epic, emotional Sinhala voiceovers using Gemini 2.5
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-semibold mb-2 ml-1">
            Text to Convert (Sinhala)
          </label>
          <textarea
            className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-2xl p-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="පෙළ ඇතුළත් කරන්න..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2 ml-1">
              Emotion / Tone
            </label>
            <select
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value as Emotion)}
            >
              {Object.values(Emotion).map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2 ml-1">
              Voice Type
            </label>
            <select
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value as VoiceType)}
            >
              {Object.values(VoiceType).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 mb-8 ml-1">
          <input
            type="checkbox"
            id="pause-effect"
            className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
            checked={addPauses}
            onChange={(e) => setAddPauses(e.target.checked)}
          />
          <label htmlFor="pause-effect" className="text-slate-300 text-sm cursor-pointer select-none">
            Enhance with cinematic timing & pauses
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !text.trim()}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] ${
            isGenerating || !text.trim()
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-purple'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Narrating...</span>
            </div>
          ) : (
            'Generate Cinematic Audio'
          )}
        </button>

        {/* Status Messaging */}
        {status && !error && (
          <p className="mt-4 text-center text-indigo-400 text-sm font-medium animate-pulse">
            {status}
          </p>
        )}

        {/* Error Messaging */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm text-center">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Output Section */}
        {audioUrl && (
          <div className="mt-10 pt-8 border-t border-slate-700 animate-fadeIn">
            <h3 className="text-xl font-poppins font-semibold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🔊</span> Mastered Voiceover
            </h3>
            
            <div className="bg-slate-900/80 rounded-2xl p-4 mb-6">
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Studio Master (WAV)
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-500 text-xs text-center mt-8 px-6">
        Using high-fidelity Gemini 2.5 multimodal audio generation. 
        Engineered for professional Sinhala narration.
      </p>
    </div>
  );
};

export default VoiceStudio;
