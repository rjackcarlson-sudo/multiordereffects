import { useEffect, useState } from 'react';
import './App.css';

type Phase =
  | 'intro'
  | 'liar_response'
  | 'survey_offer'
  | 'company_cobac'
  | 'company_sulferfarms'
  | 'company_aistmatters'
  | 'final_gate'
  | 'ending_enlightenment'
  | 'ending_stagnation'
  | 'kicked_out';

type Choice = {
  label: string;
  next: Phase;
  tone?: 'cyan' | 'rose' | 'violet';
  logo?: string;
};

type Scene = {
  evaluatorImage: string;
  dialogue: string;
  choices: Choice[];
};

const scenes: Record<Exclude<Phase, 'kicked_out'>, Scene> = {
  intro: {
    evaluatorImage: '/happytemptress.jpg.jpg',
    dialogue:
      "Hey, what are you doing here? You're not supposed to be here until you've 𐌈𐍈𐌄𐌉𐌊𐌂𐌄𐌉𐌄. Did you 𐌈𐍈𐌄𐌉𐌊𐌂𐌄𐌉𐌄 yet?",
    choices: [
      { label: 'Yes', next: 'liar_response', tone: 'cyan' },
      { label: 'No', next: 'kicked_out', tone: 'rose' },
    ],
  },
  liar_response: {
    evaluatorImage: '/smug.jpg.jpg',
    dialogue: "You're a liar, you're lucky I like liars.",
    choices: [{ label: 'Continue', next: 'survey_offer', tone: 'violet' }],
  },
  survey_offer: {
    evaluatorImage: '/disappointed.jpg.jpg',
    dialogue:
      'Fine. The viewscreen is awake now. Pick a sponsor before the frame notices you are still mostly ordinary.',
    choices: [
      {
        label: 'COBAC',
        next: 'company_cobac',
        tone: 'cyan',
        logo: '/COBAC-logo.jpg.jpg',
      },
      {
        label: 'Sulfer Farms',
        next: 'company_sulferfarms',
        tone: 'violet',
        logo: '/sulferfarms-logo.png.png',
      },
      {
        label: 'AIs That Matter',
        next: 'company_aistmatters',
        tone: 'cyan',
        logo: '/AIsthatmatter-logo.png.jpg',
      },
    ],
  },
  company_cobac: {
    evaluatorImage: '/Sarcasticclap.jpg.jpg',
    dialogue:
      'COBAC. Bureaucratic, glossy, and absolutely crawling with doors that should not open. Predictable choice. Useful choice.',
    choices: [{ label: 'Let the frame turn', next: 'final_gate', tone: 'violet' }],
  },
  company_sulferfarms: {
    evaluatorImage: '/Sarcasticclap.jpg.jpg',
    dialogue:
      'Sulfer Farms. Nothing says spiritual readiness like a logo that smells like consequences. I almost respect it.',
    choices: [{ label: 'Let the frame turn', next: 'final_gate', tone: 'violet' }],
  },
  company_aistmatters: {
    evaluatorImage: '/Sarcasticclap.jpg.jpg',
    dialogue:
      'AIs That Matter. Darling, half of them matter and the other half are just loud mirrors. You may proceed anyway.',
    choices: [{ label: 'Let the frame turn', next: 'final_gate', tone: 'violet' }],
  },
  final_gate: {
    evaluatorImage: '/turning.jpg.jpg',
    dialogue:
      'Last question. When the glyphs look back, do you smile at them? 𐌌𐌀𐌊𐌄 𐌉𐌕 𐌂𐌏𐌍𐌕𐌉𐌍𐌵𐌄?',
    choices: [
      { label: 'Yes, obviously', next: 'ending_enlightenment', tone: 'cyan' },
      { label: 'No, I look away', next: 'ending_stagnation', tone: 'rose' },
    ],
  },
  ending_enlightenment: {
    evaluatorImage: '/happydemon.jpg.jpg',
    dialogue:
      'Excellent. The chamber accepts your lie, your sponsor, and your suspiciously confident smile. Try not to drip enlightenment on the carpet.',
    choices: [{ label: 'Begin again', next: 'intro', tone: 'violet' }],
  },
  ending_stagnation: {
    evaluatorImage: '/stagnation.jpg.jpg',
    dialogue:
      'That hesitation is how wallpaper becomes a personality. The chamber will let you sit with it.',
    choices: [{ label: 'Try again', next: 'intro', tone: 'violet' }],
  },
};

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [blackout, setBlackout] = useState(false);

  useEffect(() => {
    if (phase !== 'kicked_out') {
      return;
    }

    const timer = setTimeout(() => setBlackout(true), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  const goToPhase = (nextPhase: Phase) => {
    setPhase(nextPhase);
    setBlackout(false);
  };

  const reset = () => {
    setPhase('intro');
    setBlackout(false);
  };

  if (phase === 'kicked_out' && blackout) {
    return (
      <main className="blackout-screen">
        <button className="blackout-reset" onClick={reset}>
          Reset Chamber
        </button>
      </main>
    );
  }

  const scene: Scene =
    phase === 'kicked_out'
      ? {
          evaluatorImage: '/getout.jpg.jpg',
          dialogue: 'Well then out you go!',
          choices: [],
        }
      : scenes[phase];

  return (
    <main className="esoteric-page">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="ambient-video"
      >
        <source src="/ambient-loop.mp4.mp4" type="video/mp4" />
      </video>

      <section
        className={`viewscreen ${phase !== 'intro' ? 'viewscreen-hot' : ''}`}
        aria-label="Esoteric viewscreen"
      >
        <img
          src="/fractal-frame.png"
          alt=""
          className="fractal-frame"
          aria-hidden="true"
        />

        <div className="viewscreen-content">
          <figure className="evaluator">
            <img
              src={scene.evaluatorImage}
              alt="The woman in the viewscreen"
              className="evaluator-image"
            />
          </figure>

          <p className="dialogue">{scene.dialogue}</p>

          <div className="choices">
            {scene.choices.map((choice) => (
              <button
                key={`${phase}-${choice.label}`}
                onClick={() => goToPhase(choice.next)}
                className={`choice-button ${choice.tone ?? 'cyan'}`}
              >
                {choice.logo && (
                  <img src={choice.logo} alt="" className="choice-logo" aria-hidden="true" />
                )}
                <span>{choice.label}</span>
              </button>
            ))}

            {phase !== 'intro' && phase !== 'kicked_out' && (
              <button onClick={reset} className="reset-button">
                Reset Chamber
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}