import { useEffect, useState } from 'react';

type Phase = 
  | 'intro' 
  | 'first_gate' 
  | 'survey_offer' 
  | 'company1' 
  | 'company2' 
  | 'company3' 
  | 'ending_enlightenment' 
  | 'ending_stagnation' 
  | 'kicked_out';

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [fractalsHot, setFractalsHot] = useState(false);

  // React to choices with frame intensity
  useEffect(() => {
    if (phase !== 'intro') {
      const timer = setTimeout(() => setFractalsHot(true), 300);
      return () => clearTimeout(timer);
    }
    setFractalsHot(false);
  }, [phase]);

  const reset = () => {
    setPhase('intro');
    setFractalsHot(false);
  };

  const kickOut = () => setPhase('kicked_out');

  // Image mapping
  const getEvaluatorImage = () => {
    if (phase === 'kicked_out') return '/getout.jpg';
    if (phase === 'ending_stagnation') return '/stagnation.jpg';
    if (phase === 'ending_enlightenment') return '/sarcasticclap.jpg';
    return '/introductions.jpg'; // default
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Looping Ambient Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/ambient-loop.mp4" type="video/mp4" />
      </video>

      {/* The Fractal Viewer */}
      <div className="relative z-10 w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30">
        
        {/* Fractal Frame */}
        <img 
          src="/fractal-frame.png" 
          alt="Fractal Frame" 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${fractalsHot ? 'brightness-110 saturate-125' : ''}`}
        />

        {/* Main Content Area */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
          
          {/* The Evaluator */}
          <div className="mb-10">
            <img 
              src={getEvaluatorImage()} 
              alt="The Evaluator" 
              className="max-h-[380px] rounded-2xl shadow-2xl border border-purple-500/20"
            />
          </div>

          {/* Dialogue */}
          <div className="max-w-3xl text-xl leading-relaxed mb-12 min-h-[140px]">
            {phase === 'intro' && 
              "Hey, what are you doing here. You're not supposed to be here until you've 𐌈𐍈𐌄𐌉𐌊𐌂𐌄𐌉𐌄. Did you 𐌈𐍈𐌄𐌉𐌊𐌂𐌄𐌉𐌄 yet?"}
            
            {phase === 'kicked_out' && 
              "Well then out you go!"}
            
            {/* Add more phases here as we expand */}
          </div>

          {/* Buttons */}
          <div className="flex gap-6 flex-wrap justify-center">
            {phase === 'intro' && (
              <>
                <button onClick={() => setPhase('survey_offer')} className="px-12 py-4 border-2 border-cyan-400 hover:bg-cyan-950 rounded-full text-lg transition">Yes</button>
                <button onClick={kickOut} className="px-12 py-4 border-2 border-rose-400 hover:bg-rose-950 rounded-full text-lg transition">No</button>
              </>
            )}

            <button onClick={reset} className="px-6 py-3 text-sm border border-purple-400/50 hover:bg-purple-950 rounded">Reset Chamber</button>
          </div>
        </div>
      </div>
    </main>
  );
}