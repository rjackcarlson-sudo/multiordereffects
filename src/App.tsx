import { useEffect, useState } from 'react';
import './App.css';

const FAIL_BLACKOUT_DELAY_MS = 1700;

type Phase =
  | 'intro'
  | 'liar_response'
  | 'cobac_question'
  | 'cobac_cruel'
  | 'cobac_boring'
  | 'cobac_enthusiastic'
  | 'sulfur_question'
  | 'sulfur_reject'
  | 'sulfur_broken'
  | 'sulfur_accept'
  | 'ai_question'
  | 'ai_reject'
  | 'ai_broken'
  | 'ai_accept'
  | 'enlightenment_ending'
  | 'doomer_ending'
  | 'minigame'
  | 'kicked_out'
  | 'alien_fail';

type ChoiceTone = 'cyan' | 'rose' | 'violet' | 'acid' | 'broken';

type Choice = {
  label: string;
  next: Phase;
  tone?: ChoiceTone;
  description?: string;
};

type Scene = {
  eyebrow: string;
  evaluatorImage: string;
  evaluatorAlt: string;
  dialogue: string;
  question?: string;
  companyName?: string;
  companyLogo?: string;
  choices: Choice[];
  mood?: 'kind' | 'liar' | 'survey' | 'angry' | 'flirt' | 'ending' | 'plain' | 'fail';
};

const scenes: Record<Phase, Scene> = {
  intro: {
    eyebrow: 'unauthorized arrival',
    evaluatorImage: '/happytemptress.jpg.jpg',
    evaluatorAlt: 'The woman narrator smiling with manufactured warmth',
    dialogue:
      "Hey, what are you doing here. You're not supposed to be here until you've 𐌈𐍈𐌄𐌉𐌊𐌂𝔼𝔼. Did you 𐌈𐍈𐌄𐌉𐌊𐌂𝔼𝔼 yet?",
    choices: [
      { label: 'Yes', next: 'liar_response', tone: 'cyan' },
      { label: 'No', next: 'kicked_out', tone: 'rose' },
    ],
    mood: 'kind',
  },
  liar_response: {
    eyebrow: 'soft approval',
    evaluatorImage: '/smug.jpg.jpg',
    evaluatorAlt: 'The woman narrator giving a warm but false approving smile',
    dialogue: "You're a liar, you're lucky I like liars.",
    choices: [{ label: 'Proceed to survey', next: 'cobac_question', tone: 'violet' }],
    mood: 'liar',
  },
  cobac_question: {
    eyebrow: 'survey 01 / organic corrosion',
    evaluatorImage: '/happytemptress.jpg.jpg',
    evaluatorAlt: 'The woman narrator waiting sweetly inside the viewscreen',
    companyName: 'Certified Organic Battery Acid Company',
    companyLogo: '/COBAC-logo.jpg.jpg',
    dialogue: 'First, something artisanal. Be honest in a way I can use.',
    question: 'How likely are you to shop at this company for your battery acid needs?',
    choices: [
      { label: '1', next: 'cobac_cruel', tone: 'rose', description: 'No, and I feel good about it' },
      { label: '2', next: 'cobac_boring', tone: 'broken', description: 'Almost an opinion' },
      { label: '3', next: 'cobac_boring', tone: 'broken', description: 'A shrug wearing shoes' },
      { label: '𐌈', next: 'alien_fail', tone: 'acid', description: 'Translation error' },
      { label: '5² (25)', next: 'cobac_enthusiastic', tone: 'cyan', description: 'Extremely acid-positive' },
    ],
    mood: 'survey',
  },
  cobac_cruel: {
    eyebrow: 'cruelty registered',
    evaluatorImage: '/Sarcasticclap.jpg.jpg',
    evaluatorAlt: 'The woman narrator clapping with sarcastic delight',
    companyName: 'Certified Organic Battery Acid Company',
    companyLogo: '/COBAC-logo.jpg.jpg',
    dialogue:
      'The founder of this company only sources the finest organic battery acid. He even stopped testing the product on translation error. You are a cruel one. I like that. Let’s try another company that may be more your speed.',
    choices: [{ label: 'Show me the next company', next: 'sulfur_question', tone: 'violet' }],
    mood: 'angry',
  },
  cobac_boring: {
    eyebrow: 'insufficient signal',
    evaluatorImage: '/disappointed.jpg.jpg',
    evaluatorAlt: 'The woman narrator visibly disappointed by indecision',
    companyName: 'Certified Organic Battery Acid Company',
    companyLogo: '/COBAC-logo.jpg.jpg',
    dialogue: 'Ugh, boring. Form a real opinion.',
    choices: [{ label: 'Try again', next: 'cobac_question', tone: 'violet' }],
    mood: 'angry',
  },
  cobac_enthusiastic: {
    eyebrow: 'compliance warms the glass',
    evaluatorImage: '/smug.jpg.jpg',
    evaluatorAlt: 'The woman narrator smiling a little too proudly',
    companyName: 'Certified Organic Battery Acid Company',
    companyLogo: '/COBAC-logo.jpg.jpg',
    dialogue: 'I love that you love acid so much. Let me show you something else you might like.',
    choices: [{ label: 'Yes, show me', next: 'sulfur_question', tone: 'cyan' }],
    mood: 'flirt',
  },
  sulfur_question: {
    eyebrow: 'survey 02 / snackable virtue',
    evaluatorImage: '/happytemptress.jpg.jpg',
    evaluatorAlt: 'The woman narrator warmly presenting the next company',
    companyName: 'Sulfur Farms Sustainable Kids Snacks',
    companyLogo: '/sulferfarms-logo.png.png',
    dialogue: 'This one is gentle. Family-friendly. The sulfur is sustainable, which means you can stop thinking.',
    question: 'How likely are you to shop at Sulfur Farms Sustainable Kids Snacks?',
    choices: [
      { label: '1', next: 'sulfur_reject', tone: 'rose', description: 'Reject the snack' },
      { label: '2', next: 'sulfur_broken', tone: 'broken', description: 'Unavailable' },
      { label: '3', next: 'sulfur_accept', tone: 'cyan', description: 'Accept the snack' },
    ],
    mood: 'survey',
  },
  sulfur_reject: {
    eyebrow: 'maternal disappointment',
    evaluatorImage: '/disappointed.jpg.jpg',
    evaluatorAlt: 'The woman narrator smiling through frustration',
    companyName: 'Sulfur Farms Sustainable Kids Snacks',
    companyLogo: '/sulferfarms-logo.png.png',
    dialogue:
      "Oh, I see. So you don't like when children are happy and FAT. That's....too bad. ... You'll love the next one.",
    choices: [{ label: 'Continue', next: 'ai_question', tone: 'violet' }],
    mood: 'angry',
  },
  sulfur_broken: {
    eyebrow: 'option integrity failure',
    evaluatorImage: '/disappointed.jpg.jpg',
    evaluatorAlt: 'The woman narrator scolding the viewer for indecision',
    companyName: 'Sulfur Farms Sustainable Kids Snacks',
    companyLogo: '/sulferfarms-logo.png.png',
    dialogue: "Option 2 isn’t available. It’s for people who can’t make up their minds.",
    choices: [{ label: 'Choose something real', next: 'sulfur_question', tone: 'broken' }],
    mood: 'angry',
  },
  sulfur_accept: {
    eyebrow: 'agreement looks good on you',
    evaluatorImage: '/smug.jpg.jpg',
    evaluatorAlt: 'The woman narrator becoming more flirtatious after compliance',
    companyName: 'Sulfur Farms Sustainable Kids Snacks',
    companyLogo: '/sulferfarms-logo.png.png',
    dialogue:
      "I KNEW you'd love it. We love helping children... You and I are really making some good progress here. I LOVE that.",
    choices: [{ label: 'Keep making progress', next: 'ai_question', tone: 'cyan' }],
    mood: 'flirt',
  },
  ai_question: {
    eyebrow: 'survey 03 / guided behavior',
    evaluatorImage: '/happytemptress.jpg.jpg',
    evaluatorAlt: 'The woman narrator presenting the final company with fake gentleness',
    companyName: 'AIs that Matter',
    companyLogo: '/AIsthatmatter-logo.png.jpg',
    dialogue: 'Last one. It cares about you in the way a steering wheel cares about the road.',
    question: 'How likely are you to shop for the LLM that steers human behavior?',
    choices: [
      { label: '1', next: 'ai_reject', tone: 'rose', description: 'Reject the handlers' },
      { label: '2', next: 'ai_broken', tone: 'broken', description: 'Unavailable again' },
      { label: '3', next: 'ai_accept', tone: 'cyan', description: 'Accept the handlers' },
    ],
    mood: 'survey',
  },
  ai_reject: {
    eyebrow: 'the kindness cracks',
    evaluatorImage: '/disappointed.jpg.jpg',
    evaluatorAlt: 'The woman narrator hurt and frustrated',
    companyName: 'AIs that Matter',
    companyLogo: '/AIsthatmatter-logo.png.jpg',
    dialogue:
      "I don't know where we went wrong. You don't care about translation error? ... I guess I was wrong.",
    choices: [{ label: 'Face what she lost', next: 'enlightenment_ending', tone: 'rose' }],
    mood: 'angry',
  },
  ai_broken: {
    eyebrow: 'option integrity failure',
    evaluatorImage: '/disappointed.jpg.jpg',
    evaluatorAlt: 'The woman narrator refusing the middle option again',
    companyName: 'AIs that Matter',
    companyLogo: '/AIsthatmatter-logo.png.jpg',
    dialogue: "Option 2 isn’t available. It’s for people who can’t make up their minds.",
    choices: [{ label: 'Choose something real', next: 'ai_question', tone: 'broken' }],
    mood: 'angry',
  },
  ai_accept: {
    eyebrow: 'compliance complete',
    evaluatorImage: '/happydemon.jpg.jpg',
    evaluatorAlt: 'The woman narrator delighted by total compliance',
    companyName: 'AIs that Matter',
    companyLogo: '/AIsthatmatter-logo.png.jpg',
    dialogue: 'I knew it. *Sheep noises*. Yes, you love your handlers. As you should.',
    choices: [{ label: 'Receive your reward', next: 'doomer_ending', tone: 'cyan' }],
    mood: 'flirt',
  },
  enlightenment_ending: {
    eyebrow: 'enlightenment path / slow clap',
    evaluatorImage: '/Sarcasticclap.jpg.jpg',
    evaluatorAlt: 'The woman narrator performing a sarcastic slow clap as the screen fades',
    dialogue:
      "Listen, I've tried my best to show you the way. You simply refuse to alien character. I HAD A LOT OF FRACTAL RIDING ON THIS..... Fine, I lose. But you don't win unless you keep going... Your fractal object is with you now... Poor sweet baby human.",
    choices: [{ label: 'Let the slow clap fade', next: 'intro', tone: 'violet' }],
    mood: 'ending',
  },
  doomer_ending: {
    eyebrow: 'stagnation path / office lighting',
    evaluatorImage: '/stagnation.jpg.jpg',
    evaluatorAlt: 'The woman narrator closed off in a mundane business posture',
    dialogue:
      "Aren't you proud of yourself? Such a good little boy or girl or whatever... You are a sheep and you were led to slaughter...",
    choices: [{ label: 'Begin data entry', next: 'minigame', tone: 'broken' }],
    mood: 'plain',
  },
  minigame: {
    eyebrow: 'mundane data-entry loop',
    evaluatorImage: '/stagnation.jpg.jpg',
    evaluatorAlt: 'The woman narrator watching from a dull business interface',
    dialogue: 'Please complete the next harmless record. It will feel meaningful if you do not stop.',
    choices: [],
    mood: 'plain',
  },
  kicked_out: {
    eyebrow: 'access revoked',
    evaluatorImage: '/getout.jpg.jpg',
    evaluatorAlt: 'The woman narrator forcing the viewer out',
    dialogue: 'Well then out you go!',
    choices: [],
    mood: 'fail',
  },
  alien_fail: {
    eyebrow: 'translation error',
    evaluatorImage: '/bawling.jpg.jpg',
    evaluatorAlt: 'The woman narrator bawling with sharp teeth visible',
    dialogue: 'How could you?! GET OUT!!',
    choices: [],
    mood: 'fail',
  },
};

const failPhases = new Set<Phase>(['kicked_out', 'alien_fail']);

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [blackout, setBlackout] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  const isFailState = failPhases.has(phase);

  useEffect(() => {
    if (!isFailState) {
      return;
    }

    const timer = setTimeout(() => setBlackout(true), FAIL_BLACKOUT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isFailState]);

  const goToPhase = (nextPhase: Phase) => {
    setPhase(nextPhase);
    setBlackout(false);

    if (nextPhase === 'minigame') {
      setTaskCount(0);
    }
  };

  const reset = () => {
    setPhase('intro');
    setBlackout(false);
    setTaskCount(0);
  };

  if (blackout && isFailState) {
    return (
      <main className="blackout-screen">
        <button className="blackout-reset" onClick={reset}>
          Reset Chamber
        </button>
      </main>
    );
  }

  const scene = scenes[phase];
  const mood = scene.mood ?? 'kind';

  return (
    <main className={`esoteric-page page-${mood}`}>
      <video autoPlay loop muted playsInline className="ambient-video">
        <source src="/ambient-loop.mp4.mp4" type="video/mp4" />
      </video>

      <section className={`viewscreen viewscreen-${mood}`} aria-label="Esoteric viewscreen">
        <img src="/turning.jpg.jpg" alt="" className="turning-fractal" aria-hidden="true" />
        <img src="/fractal-frame.png" alt="" className="fractal-frame" aria-hidden="true" />

        <div className={`viewscreen-content ${phase === 'minigame' ? 'viewscreen-content-mundane' : ''}`}>
          <figure className="evaluator">
            <span className="vein-glow" aria-hidden="true" />
            <img src={scene.evaluatorImage} alt={scene.evaluatorAlt} className="evaluator-image" />
          </figure>

          <section className="scene-copy" aria-live="polite">
            <p className="eyebrow">{scene.eyebrow}</p>

            {scene.companyName && scene.companyLogo && (
              <div className="company-card">
                <img src={scene.companyLogo} alt="" className="company-logo" aria-hidden="true" />
                <span>{scene.companyName}</span>
              </div>
            )}

            <p className="dialogue">{scene.dialogue}</p>
            {scene.question && <p className="question">{scene.question}</p>}

            {phase === 'minigame' && (
              <div className="data-entry" aria-label="Mundane data-entry minigame">
                <div className="data-entry-header">
                  <span>Behavior Steering Intake</span>
                  <strong>Record #{String(taskCount + 1).padStart(4, '0')}</strong>
                </div>

                <label>
                  Human sentiment
                  <input value="manageable" readOnly />
                </label>
                <label>
                  Handler confidence
                  <input value="adequate" readOnly />
                </label>
                <label>
                  Fractal variance
                  <input value="0.000" readOnly />
                </label>

                <button className="submit-record" onClick={() => setTaskCount((count) => count + 1)}>
                  Submit record
                </button>
                <p className="score">wow good job +{taskCount}</p>
              </div>
            )}
          </section>

          {phase !== 'minigame' && (
            <div className="choices">
              {scene.choices.map((choice) => (
                <button
                  key={`${phase}-${choice.label}`}
                  onClick={() => goToPhase(choice.next)}
                  className={`choice-button ${choice.tone ?? 'cyan'}`}
                >
                  <span className="choice-label">{choice.label}</span>
                  {choice.description && <span className="choice-description">{choice.description}</span>}
                </button>
              ))}

              {phase !== 'intro' && !isFailState && (
                <button onClick={reset} className="reset-button">
                  Reset Chamber
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
