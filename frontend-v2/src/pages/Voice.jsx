import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useScanStore } from '../store';
import { useGeolocation } from '../hooks';
import { voiceInput } from '../api';

export default function Voice() {
  const navigate = useNavigate();
  const { user, language } = useUserStore();
  const { setScan } = useScanStore();
  const { latitude, longitude, loading: locationLoading } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      audioChunks.current = [];
      
      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await handleRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      setError(language === 'en' ? 'Microphone access denied' : 'माइक्रोफ़ोन एक्सेस अस्वीकृत');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleRecordingComplete = async (audioBlob) => {
    if (locationLoading) {
      setError(language === 'en' ? 'Waiting for location...' : 'स्थान की प्रतीक्षा कर रहे हैं...');
      return;
    }

    if (!latitude || !longitude) {
      setError(language === 'en' ? 'Location required' : 'स्थान आवश्यक है');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await voiceInput(audioBlob, user.id, latitude, longitude, language);
      setScan(result, result.global_docs || [], result.personal_docs || []);
      navigate('/result');
    } catch (err) {
      console.error('Voice error:', err);
      setError(err.response?.data?.detail || (language === 'en' ? 'Voice processing failed' : 'आवाज़ प्रसंस्करण विफल रहा'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-forest font-semibold flex items-center gap-2 hover:gap-4 transition-all"
        >
          ← {language === 'en' ? 'Back' : 'वापस'}
        </button>

        <h1 className="text-3xl font-bold text-forest mb-6">
          🎤 {language === 'en' ? 'Voice Query' : 'आवाज़ प्रश्न'}
        </h1>

        {loading ? (
          <div className="card text-center py-16">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-xl font-semibold text-forest">
              {language === 'en' ? 'Processing voice...' : 'आवाज़ प्रसंस्करण...'}
            </p>
            <p className="text-olive-dark mt-2">
              {language === 'en' 
                ? 'Whisper transcribing, searching knowledge base...' 
                : 'Whisper ट्रांसक्राइबिंग, ज्ञान आधार खोज रहा है...'}
            </p>
          </div>
        ) : (
          <>
            <div className="card text-center py-16">
              <div className={`text-8xl mb-6 ${isRecording ? 'animate-pulse' : ''}`}>
                {isRecording ? '🔴' : '🎤'}
              </div>
              <h2 className="text-2xl font-bold text-forest mb-4">
                {isRecording 
                  ? (language === 'en' ? 'Recording...' : 'रिकॉर्डिंग...')
                  : (language === 'en' ? 'Ask Your Question' : 'अपना प्रश्न पूछें')}
              </h2>
              <p className="text-olive-dark mb-6">
                {isRecording 
                  ? (language === 'en' ? 'Speak now. Click stop when done.' : 'अब बोलें। समाप्त होने पर स्टॉप क्लिक करें।')
                  : (language === 'en' ? 'Example: "How do I dispose plastic bottles?"' : 'उदाहरण: "प्लास्टिक की बोतलों का निपटान कैसे करें?"')}
              </p>
              {!isRecording ? (
                <button onClick={startRecording} className="btn-primary text-xl px-8 py-4">
                  🎤 {language === 'en' ? 'Start Recording' : 'रिकॉर्डिंग शुरू करें'}
                </button>
              ) : (
                <button onClick={stopRecording} className="btn-hazard text-xl px-8 py-4">
                  ⏹️ {language === 'en' ? 'Stop Recording' : 'रिकॉर्डिंग बंद करें'}
                </button>
              )}
            </div>

            {error && (
              <div className="mt-6 bg-hazard text-white p-4 rounded-lg text-center font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-6 card bg-forest-light text-white">
              <h3 className="font-bold mb-2">
                {language === 'en' ? 'How it works' : 'यह कैसे काम करता है'}
              </h3>
              <ul className="space-y-1 text-sm">
                <li>✓ {language === 'en' ? 'Whisper AI transcribes your voice' : 'Whisper AI आपकी आवाज़ को ट्रांसक्राइब करता है'}</li>
                <li>✓ {language === 'en' ? 'Text converted to vector embedding' : 'टेक्स्ट को वेक्टर एम्बेडिंग में बदला जाता है'}</li>
                <li>✓ {language === 'en' ? 'Searches global + personal RAG database' : 'वैश्विक + व्यक्तिगत RAG डेटाबेस खोजता है'}</li>
                <li>✓ {language === 'en' ? 'LLM generates contextual answer' : 'LLM संदर्भात्मक उत्तर उत्पन्न करता है'}</li>
                <li>✓ {language === 'en' ? 'Translated to your language' : 'आपकी भाषा में अनुवादित'}</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
