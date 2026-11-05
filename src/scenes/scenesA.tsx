import type { CSSProperties, ReactNode } from 'react';
import {
  BASE,
  C,
  Cursor,
  Kicker,
  MemeOverlay,
  Pill,
  Stage,
  clamp,
  ease,
  rnd,
  seg,
  typed,
  typedDone,
  useClock,
  useSince,
  useStage,
} from './kit';

export type SceneProps = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const fade = (p: number, y = 20): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * y}px)`,
});

/* ───────────── Fictional signup form (shared by the form scenes) ───────────── */
const FIELDS = [
  { l: 'Full name', v: 'Ada Nwosu' },
  { l: 'Phone number', v: '+234 803 000 0000' },
  { l: 'Email address', v: 'ada@example.test', },
  { l: 'Date of birth', v: '12 / 03 / 1996', tag: 'WHY?' },
  { l: 'BVN', v: '2•••••••••••', tag: 'WHY?' },
  { l: 'NIN', v: '7•••••••••••', tag: 'WHY?' },
  { l: 'Home location', v: 'Lagos, Nigeria', tag: 'WHY?', wide: true },
];
const fieldPos = (i: number) => {
  const col = i < 6 ? i % 2 : 0;
  const row = i < 6 ? Math.floor(i / 2) : 3;

  return { x: 40 + col * 298, y: 150 + row * 78, w: FIELDS[i].wide ? 560 : 262 };
};
const CHECKS = ['Send me updates', 'I accept the terms', 'Share my data with partners'];
const checkX = [40, 218, 400];

function SignupForm({
  shown,
  vals,
  checks,
  tags,
  outline,
  pulse,
  active,
}: {
  shown?: number;
  vals: string[];
  checks: boolean[];
  tags?: boolean[];
  outline?: boolean;
  pulse?: boolean;
  active?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fff',
        borderRadius: 18,
        border: `3px solid ${C.ink}`,
        overflow: 'hidden',
        boxShadow: '0 30px 60px -30px rgba(0,0,0,.45)',
      }}
    >
      <div style={{ height: 48, background: '#ecebe8', borderBottom: `2px solid ${C.ink}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <i key={c} style={{ width: 13, height: 13, borderRadius: 9, background: c }} />
        ))}
        <div style={{ marginLeft: 18, flex: 1, maxWidth: 420, background: '#fff', borderRadius: 999, padding: '5px 16px', fontSize: 15, color: '#555' }}>
          🔒 naijapay.app/newsletter
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 72, fontSize: 32, fontWeight: 700 }}>
        Join our newsletter ✉️
      </div>
      <div style={{ position: 'absolute', left: 40, top: 112, fontSize: 16, color: '#666' }}>
        Product updates, once a week. It only takes a minute.
      </div>
      {FIELDS.map((f, i) => {
        const p = fieldPos(i);
        const flagged = outline && i >= 3;

        return (
          <div key={f.l} style={{ position: 'absolute', left: p.x, top: p.y, width: p.w }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#444', height: 18 }}>{f.l}</div>
            <div
              style={{
                height: 46,
                borderRadius: 10,
                border: `2px solid ${flagged ? C.red : active === i ? C.blue : '#c9c8c4'}`,
                boxShadow: flagged ? `0 0 0 5px rgba(255,84,112,.25)` : active === i ? '0 0 0 4px rgba(66,133,244,.2)' : 'none',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 19,
                fontFamily: i >= 4 ? 'var(--font-mono)' : undefined,
                background: flagged ? '#fff5f6' : '#fff',
              }}
            >
              {vals[i] ?? ''}
              {active === i && <span className="sc-blink" style={{ marginLeft: 2 }}>|</span>}
            </div>
            {tags?.[i] && f.tag && (
              <div style={{ position: 'absolute', right: 8, top: 4, background: C.red, color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 999, padding: '2px 9px' }}>
                {f.tag}
              </div>
            )}
          </div>
        );
      })}
      {CHECKS.map((c, i) => (
        <div key={c} style={{ position: 'absolute', left: checkX[i], top: 468, display: 'flex', gap: 8, alignItems: 'center', fontSize: 15 }}>
          <span style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${C.ink}`, background: checks[i] ? C.green : '#fff', color: '#fff', fontSize: 14, lineHeight: '16px', textAlign: 'center' }}>
            {checks[i] ? '✓' : ''}
          </span>
          {c}
        </div>
      ))}
      <div
        className={pulse ? 'sc-pulse' : undefined}
        style={{ position: 'absolute', left: 40, top: 510, width: 220, height: 46, borderRadius: 12, background: C.blue, color: '#fff', fontWeight: 700, fontSize: 20, display: 'grid', placeItems: 'center', letterSpacing: '0.08em' }}
      >
        SUBMIT
      </div>
      <div style={{ position: 'absolute', right: 40, top: 80, width: 300, height: 120, borderRadius: 14, background: C.sun, border: `2px solid ${C.ink}`, padding: 16, fontSize: 15, opacity: shown ? 0 : 1 }}>
        <b style={{ fontSize: 18 }}>Weekly dev tips</b>
        <br />
        APIs, shipping & the occasional meme.
      </div>
    </div>
  );
}

/* ───────────── Real-website form animation ───────────── */
export function WebForm({ props }: { props: SceneProps }) {
  const t = useClock(15000);
  const stage = useStage(2);
  const since = useSince(stage >= 1, 7000);
  const vals = FIELDS.map((f, i) => typed(f.v, t, 700 + i * 1500 + 450, 17));
  const tags = FIELDS.map((_, i) => t > 700 + i * 1500 + 1200);
  const active = FIELDS.findIndex((_, i) => t > 700 + i * 1500 + 300 && t < 700 + i * 1500 + 1450);
  const checks = [t > 11500, t > 12100, t > 12700];
  // cursor waypoints [tArrive, x, y]
  const wp: [number, number, number][] = [[0, 900, 560]];

  FIELDS.forEach((_, i) => {
    const p = fieldPos(i);

    wp.push([700 + i * 1500 + 300, p.x + 40, p.y + 40]);
  });
  checkX.forEach((x, i) => wp.push([11450 + i * 600, x + 10, 478]));
  wp.push([13300, 120, 536]);

  let cx = wp[0][1];
  let cy = wp[0][2];

  for (let k = 1; k < wp.length; k++) {
    const p = ease(seg(t, wp[k][0] - 420, wp[k][0]));

    if (t >= wp[k][0] - 420) {
      cx = wp[k - 1][1] + (wp[k][1] - wp[k - 1][1]) * p;
      cy = wp[k - 1][2] + (wp[k][2] - wp[k - 1][2]) * p;
    }
  }

  const msgs = [
    ['Product', 'Let’s collect it just in case.', C.yellow],
    ['Security', 'Where are we storing it?', C.sky],
    ['Product', 'We’ll figure that out.', C.yellow],
    ['Database', '', C.pink],
  ] as const;

  return (
    <>
    <Stage w={1000} h={690}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 590 }}>
        <SignupForm shown={stage} vals={vals} checks={checks} tags={tags} active={active < 0 ? undefined : active} pulse={t > 13500} />
        <Cursor x={cx} y={cy} click={Math.abs((t % 1500) - 300) < 120} />
        {/* Slack thread */}
        <div
          style={{
            position: 'absolute', right: 20, top: 70, width: 330, borderRadius: 16, background: '#fff', border: `3px solid ${C.ink}`, padding: 14,
            boxShadow: '0 20px 40px -20px rgba(0,0,0,.5)',
            ...fade(clamp(since / 400), 30), zIndex: 20,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}># product-planning</div>
          {msgs.map(([who, text, col], i) => {
            const p = seg(since, 500 + i * 1300, 900 + i * 1300);

            return (
              <div key={i} style={{ display: 'flex', gap: 10, margin: '10px 0', ...fade(p, 12) }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: col, border: `2px solid ${C.ink}`, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>{who[0]}</div>
                <div style={{ fontSize: 15 }}>
                  <b>{who}</b>
                  <div>{text || <span style={{ letterSpacing: 4 }} className="sc-blink">•••</span>}</div>
                </div>
              </div>
            );
          })}
        </div>
        {t > 13800 && (
          <div style={{ position: 'absolute', right: 40, bottom: 36, transform: 'rotate(-5deg)', border: `5px solid ${C.red}`, color: C.red, fontWeight: 800, fontSize: 30, padding: '8px 18px', borderRadius: 12, background: 'rgba(255,255,255,.9)', ...fade(seg(t, 13800, 14300), 0) }}>
            WHY DO YOU NEED ALL THIS?
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 604, textAlign: 'center', fontSize: 22, fontStyle: 'italic', color: '#33343c' }}>
        {props.caption ?? 'When the product manager asks for BVN, NIN, DOB and location for a simple newsletter.'}
      </div>
    </Stage>
    <MemeOverlay show={stage >= 2} src="chloe" caption="When the product manager asks for BVN, NIN, DOB and location for a simple newsletter." />
    </>
  );
}

/* ───────────── Opening: the AI money machine ───────────── */
const PROMPT =
  'Heyyyy, AI. I have a small business idea. Build me a mobile app that generates money. Not virtual money. Actual money. Users sign up, connect their bank accounts, and get cash straight into their real accounts. Beautiful app. Landing page. A registration form that collects customer info. Connect the backend. Premium dashboard. Launch-ready. Let’s cook.';
const BUILDS = ['Code editor', 'Backend architecture', 'Landing page', 'Mobile app', 'Registration form', 'AI dashboard', 'Payment ₦250,000'];

function Mini({ k, p }: { k: number; p: number }) {
  const bar = (w: number, h = 8, c: string = C.purple, o = 1) => (
    <div style={{ height: h, width: `${w * 100}%`, background: c, borderRadius: 4, opacity: o, marginBottom: 6 }} />
  );

  if (k === 0)
    return <div>{[0.9, 0.6, 0.75, 0.4, 0.8, 0.55].map((w, i) => bar(w * clamp(p * 6 - i * 0.6), 7, i % 2 ? C.cyan : C.purple))}</div>;
  if (k === 1)
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 70 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 14, border: `3px solid ${C.cyan}`, background: p > i / 4 ? C.cyan : 'transparent', transform: `translateY(${i % 2 ? 14 : -14}px)` }} />
        ))}
      </div>
    );
  if (k === 2)
    return (
      <div>
        {bar(1, 10, '#333')}
        {bar(0.7, 14, C.white)}
        {bar(0.5, 7, '#777')}
        <div style={{ width: 54, height: 16, borderRadius: 9, background: C.purple, marginTop: 8 }} />
      </div>
    );
  if (k === 3)
    return (
      <div style={{ width: 58, height: 82, margin: '-4px auto 0', borderRadius: 12, border: `3px solid ${C.white}`, padding: 6, transform: `rotateY(${(1 - p) * 90}deg)` }}>
        <div style={{ fontSize: 9, color: C.cyan }}>BALANCE</div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>₦250k</div>
        {bar(0.9, 5, C.purple)}
      </div>
    );
  if (k === 4)
    return (
      <div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 14, borderRadius: 5, border: `2px solid ${C.white}`, marginBottom: 6, opacity: p > i / 3 ? 1 : 0.2 }} />)}
        <div style={{ height: 16, width: '55%', borderRadius: 6, background: C.cyan }} />
      </div>
    );
  if (k === 5)
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 70 }}>
        {[0.4, 0.7, 0.5, 0.9, 0.65].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100 * p}%`, background: i % 2 ? C.cyan : C.purple, borderRadius: 4 }} />)}
      </div>
    );

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, color: C.cyan }}>✓</div>
      <div style={{ fontWeight: 800, fontSize: 20 }}>₦250,000</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>SIMULATED · DEMO ONLY</div>
    </div>
  );
}

export function MoneyMachine() {
  const t = useClock(26000);
  const stage = useStage(1);
  const since = useSince(stage >= 1, 6000);
  const promptTxt = typed(PROMPT, t, 800, 46);
  const replyP = typedDone(PROMPT, t, 800, 46);
  const reply = typed('On it. Building your application…', t, 800 + (PROMPT.length / 46) * 1000 + 300, 30);
  const base = 9500;
  const cardPos = (i: number) => ({ x: 410 + (i % 3) * 232, y: 40 + Math.floor(i / 3) * 190 });
  const lines = ['We have a product.', 'We have a business.', 'We have a launch.'];

  return (
    <div className="sc-dark sc-scanlines" style={{ position: 'absolute', inset: 0 }}>
      <Stage w={1120} h={600}>
        <div style={{ position: 'absolute', left: 0, top: 40, width: 380, height: 520, borderRadius: 22, background: 'rgba(23,25,35,.9)', border: `1px solid ${C.purple}55`, boxShadow: `0 0 60px -10px ${C.purple}66`, padding: 20, ...fade(seg(t, 200, 700), 0) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: C.purple, fontWeight: 700, fontSize: 18 }}>
            <span style={{ fontSize: 22 }}>✦</span> AI Studio
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.45, color: C.white, minHeight: 250 }}>
            {promptTxt}
            {!replyP && <span className="sc-blink" style={{ color: C.cyan }}>▍</span>}
          </div>
          {reply && (
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 14, background: '#22242f', color: C.cyan, fontSize: 17 }}>
              {reply}
            </div>
          )}
        </div>
        {BUILDS.map((b, i) => {
          const p = ease(seg(t, base + i * 2000, base + i * 2000 + 700));
          const pos = cardPos(i);
          const dx = (rnd(i, 3) - 0.5) * 600;
          const dy = (rnd(i, 7) - 0.5) * 500;

          return (
            <div
              key={b}
              style={{
                position: 'absolute', left: pos.x, top: pos.y, width: 214, height: 170, borderRadius: 18,
                background: i === 6 ? `linear-gradient(135deg,#0c3d33,#14202a)` : 'rgba(23,25,35,.92)',
                border: `1px solid ${i === 6 ? C.cyan : '#ffffff22'}`, padding: 14,
                opacity: p, transform: `translate(${(1 - p) * dx}px,${(1 - p) * dy}px) scale(${0.85 + p * 0.15})`,
                boxShadow: i === 6 ? `0 0 40px ${C.cyan}77` : 'none',
              }}
            >
              <div style={{ fontSize: 13, letterSpacing: '0.12em', color: '#9aa0b4', marginBottom: 12, textTransform: 'uppercase' }}>{b}</div>
              <Mini k={i} p={seg(t, base + i * 2000 + 300, base + i * 2000 + 1700)} />
            </div>
          );
        })}
        {t > 23500 && (
          <div style={{ position: 'absolute', right: 6, top: 6, background: '#fff', color: C.ink, borderRadius: 14, padding: '10px 16px', fontSize: 15, fontWeight: 600, boxShadow: '0 12px 30px rgba(0,0,0,.5)', ...fade(seg(t, 23500, 24000), -20) }}>
            🔔 Transfer successful · ₦250,000.00
          </div>
        )}
      </Stage>
      {stage >= 1 && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,13,.9)', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            {lines.map((l, i) => (
              <div key={l} style={{ fontSize: 'clamp(30px,5.4vw,84px)', fontWeight: 700, ...fade(seg(since, i * 900, i * 900 + 500), 24) }}>{l}</div>
            ))}
            <div style={{ marginTop: 28, fontSize: 'clamp(22px,3vw,44px)', color: C.cyan, ...fade(seg(since, 3200, 3800), 14) }}>
              But I have one tiny question…
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── Opening: the plot twist ───────────── */
const TWIST = [
  'WAS CONSENT OBTAINED, OR WHAT’S YOUR LAWFUL BASIS?',
  'WHY DO YOU NEED THEIR BVN?',
  'WHERE IS YOUR PRIVACY POLICY?',
  'WHO CAN ACCESS THEIR DATA?',
  'WHAT IS THE AI ALLOWED TO DO?',
];

export function PlotTwist() {
  const stage = useStage(6);
  const t = useClock(2500);
  const since = useSince(stage >= 1, 1200);
  const zoom = 1 + 0.18 * ease(seg(t, 0, 2000));

  return (
    <div className="sc-dark" style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, filter: stage >= 1 ? 'blur(6px) brightness(.45)' : 'none', transition: 'filter .5s', opacity: stage >= 6 ? 0 : 1 }}>
        <Stage w={1000} h={600}>
          <SignupForm vals={FIELDS.map((f) => f.v)} checks={[true, true, true]} outline={t > 900} />
        </Stage>
      </div>
      {stage >= 1 && stage <= 5 && (
        <div key={stage} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '0 6%' }}>
          <div style={{ fontSize: 'clamp(34px,6.2vw,104px)', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.02em', color: stage === 1 ? C.red : C.white, textShadow: `0 0 40px ${C.red}66`, ...fade(clamp(since / 350), 30), transform: `scale(${0.9 + 0.1 * clamp(since / 350)})` }}>
            {TWIST[stage - 1]}
          </div>
        </div>
      )}
      {stage >= 6 && (
        <div style={{ position: 'absolute', inset: 0, background: C.night, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 'clamp(30px,5.4vw,88px)', fontWeight: 700, ...fade(clamp(since / 500)) }}>YOU BUILT THE PRODUCT.</div>
            <div style={{ fontSize: 'clamp(30px,5.4vw,88px)', fontWeight: 800, color: C.cyan, ...fade(seg(since, 700, 1200)) }}>DID YOU BUILD THE TRUST?</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── Slide 1: FORM → PRIVACY ───────────── */
export function TitleGlitch({ props }: { props: SceneProps }) {
  const t = useClock(8000);
  const word = 'FORM';
  const next = 'PRIVACY';
  const n = Math.min(word.length, Math.floor(Math.max(0, t - 900) / 300));
  const dis = ease(seg(t, 3500, 4700));
  const asm = (i: number) => ease(seg(t, 4700 + i * 110, 5500 + i * 110));
  const glitch = t > 2400 && t < 3500;
  const gradient: CSSProperties = { backgroundImage: `linear-gradient(90deg,${C.purple},${C.cyan})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };

  return (
    <div className="sc-dark" style={{ position: 'absolute', inset: 0 }}>
      <Stage w={1100} h={600}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontSize: 38, letterSpacing: '0.5em', color: '#9aa0b4', fontWeight: 600 }}>
          BEYOND THE
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontSize: 210, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, display: 'flex', justifyContent: 'center' }}>
          {t < 4700 && (
            <div className={glitch ? 'sc-glitch' : undefined} style={{ display: 'flex' }}>
              {word.split('').slice(0, n).map((ch, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `translate(${dis * (rnd(i, 1) - 0.5) * 700}px,${dis * (rnd(i, 2) - 0.5) * 400}px) rotate(${dis * (rnd(i, 3) - 0.5) * 200}deg)`, opacity: 1 - dis, color: glitch ? C.red : C.white }}>{ch}</span>
              ))}
              {t > 4700 ? null : <span className="sc-blink" style={{ color: C.cyan, fontWeight: 300 }}>▍</span>}
            </div>
          )}
          {t >= 4700 && (
            <div style={{ display: 'flex' }}>
              {next.split('').map((ch, i) => (
                <span key={i} style={{ display: 'inline-block', ...gradient, opacity: asm(i), transform: `translate(${(1 - asm(i)) * (rnd(i, 5) - 0.5) * 500}px,${(1 - asm(i)) * (rnd(i, 9) - 0.5) * 300}px) scale(${0.6 + 0.4 * asm(i)})` }}>{ch}</span>
              ))}
            </div>
          )}
        </div>
        {Array.from({ length: 70 }).map((_, i) => {
          const out = seg(t, 3500, 4700);
          const inn = seg(t, 4700, 5800);
          const x = 550 + (rnd(i, 4) - 0.5) * 520 + (rnd(i, 6) - 0.5) * 600 * ease(out) * (1 - ease(inn));
          const y = 300 + (rnd(i, 8) - 0.5) * 120 + (rnd(i, 2) - 0.5) * 500 * ease(out) * (1 - ease(inn));
          const o = out > 0 && inn < 1 ? 0.9 : 0;

          return <i key={i} style={{ position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 4, background: i % 2 ? C.cyan : C.purple, opacity: o }} />;
        })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontSize: 25, letterSpacing: '0.22em', color: C.white, ...fade(seg(t, 6000, 6700), 14) }}>
          {props.subtitle ?? 'WHY DATA PRIVACY IS THE MISSING LAYER IN NIGERIA’S TECH STACK'}
        </div>
      </Stage>
    </div>
  );
}

/* ───────────── Slide 3: Nigeria runs on forms ───────────── */
const TILES = [
  ['🏧', 'POS transaction', 'CARD · AMOUNT'],
  ['🏦', 'Fintech onboarding', 'BVN · SELFIE'],
  ['🎓', 'Admission portal', 'NAME · RESULTS'],
  ['🏥', 'Hospital registration', 'HEALTH · NOK'],
  ['🛒', 'Online store checkout', 'ADDRESS · CARD'],
  ['💼', 'Job application', 'CV · DOB'],
  ['🛵', 'Delivery app', 'LOCATION · PHONE'],
  ['🪪', 'Digital identity', 'NIN · FACE'],
];
const TCOL = [C.sun, C.sky, C.mint, C.pink];

export function Montage({ props }: { props: SceneProps }) {
  const t = useClock(4200);
  const stage = useStage(1);
  const since = useSince(stage >= 1, 1000);

  return (
    <Stage w={1100} h={640}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
        <Kicker>{props.kicker}</Kicker>
        <div style={{ fontSize: 50, fontWeight: 700, marginTop: 6 }}>{props.title}</div>
      </div>
      {TILES.map(([ic, name, chips], i) => {
        const x = 20 + (i % 4) * 268;
        const y = 120 + Math.floor(i / 4) * 200;
        const p = seg(t, 200 + i * 230, 900 + i * 230);
        const back = 1 + 1.7 * Math.pow(p - 1, 3) + 0.7 * Math.pow(p - 1, 2); // easeOutBack
        const q = 1 - back;

        return (
          <div key={name} style={{ position: 'absolute', left: x, top: y, width: 250, height: 180, borderRadius: 22, background: TCOL[i % 4], border: `3px solid ${C.ink}`, padding: 16, opacity: clamp(p * 2), transform: `translate(${q * (rnd(i, 3) - 0.5) * 700}px,${q * (rnd(i, 5) - 0.5) * 500}px) scale(${0.7 + 0.3 * back})` }}>
            <div style={{ fontSize: 44 }}>{ic}</div>
            <div style={{ fontWeight: 700, fontSize: 21, marginTop: 4 }}>{name}</div>
            <div className="sc-float" style={{ marginTop: 10, display: 'inline-block', fontSize: 13, fontWeight: 700, background: '#fff', border: `2px solid ${C.ink}`, borderRadius: 8, padding: '3px 9px', opacity: seg(t, 1100 + i * 230, 1500 + i * 230), animationDelay: `${i * 0.2}s` }}>
              {chips}
            </div>
          </div>
        );
      })}
      {stage >= 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontSize: 46, fontWeight: 800, ...fade(clamp(since / 400)) }}>
          <span style={{ background: `linear-gradient(transparent 56%,${C.yellow} 56% 92%,transparent 92%)`, padding: '0 10px' }}>
            {props.punch ?? 'EVERY FORM CREATES A RESPONSIBILITY.'}
          </span>
        </div>
      )}
    </Stage>
  );
}

/* ───────────── Flow rows (data journey / agent / RAG) ───────────── */
type Row = { label?: string; nodes: string[]; start?: number; packet?: boolean; hot?: number; dupAt?: number; branch?: boolean; muted?: boolean };

function FlowRow({ row, t, y, w = 1060 }: { row: Row; t: number; y: number; w?: number }) {
  const n = row.nodes.length;
  const step = (w - 150) / (n - 1);
  const x = (i: number) => 75 + i * step;
  const s0 = row.start ?? 0;
  const dur = 950;
  const pos = clamp((t - s0 - 500) / dur, 0, n - 1);
  const lit = (i: number) => row.muted || t > s0 + 500 + i * dur - 120;
  const dup = row.dupAt !== undefined && pos >= row.dupAt;
  const hotOn = row.hot !== undefined && t > s0 + 500 + row.hot * dur;

  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: w, height: 120, opacity: row.muted ? 0.55 : 1 }}>
      {row.label && <div style={{ position: 'absolute', left: 0, top: -30, fontSize: 17, letterSpacing: '0.2em', fontWeight: 700, color: row.muted ? '#777' : C.blue }}>{row.label}</div>}
      <div style={{ position: 'absolute', left: x(0), top: 56, width: x(n - 1) - x(0), height: 4, background: '#d5d3cf', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: x(0), top: 56, width: row.muted ? x(n - 1) - x(0) : step * pos, height: 4, background: C.blue, borderRadius: 3, boxShadow: `0 0 12px ${C.blue}` }} />
      {row.nodes.map((nm, i) => {
        const on = lit(i);
        const hot = hotOn && i === row.hot;

        return (
          <div key={nm + i} style={{ position: 'absolute', left: x(i), top: 58, transform: `translate(-50%,-50%) scale(${hot ? 1.35 : on ? 1 : 0.9})`, transition: 'transform .45s cubic-bezier(.16,1,.3,1)', background: hot ? C.purple : on ? '#fff' : '#ece9e3', color: hot ? '#fff' : C.ink, border: `3px solid ${C.ink}`, borderRadius: 16, padding: '12px 14px', fontWeight: 700, fontSize: n > 6 ? 16 : 19, textAlign: 'center', minWidth: 90, boxShadow: on && !row.muted ? `0 0 22px ${hot ? C.purple : C.blue}77` : 'none' }}>
            {nm}
          </div>
        );
      })}
      {row.packet && t > s0 + 500 && (
        <>
          <div style={{ position: 'absolute', left: x(0) + step * pos, top: 58, width: 24, height: 24, borderRadius: 14, transform: 'translate(-50%,-50%)', background: C.yellow, border: `3px solid ${C.ink}`, boxShadow: `0 0 20px ${C.yellow}` }} />
          {dup && [1, 2].map((k) => (
            <div key={k} style={{ position: 'absolute', left: x(0) + step * Math.max(row.dupAt ?? 0, pos - k * 0.35), top: 58 + (k % 2 ? -34 : 34), width: 16, height: 16, borderRadius: 10, transform: 'translate(-50%,-50%)', background: C.red, border: `2px solid ${C.ink}` }} />
          ))}
        </>
      )}
      {row.branch && pos >= n - 1 && [-1, 0, 1].map((d) => (
        <div key={d} style={{ position: 'absolute', left: x(n - 1) + 60, top: 58 + d * 52, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 60, height: 4, background: C.red, transform: `rotate(${d * 22}deg)`, transformOrigin: 'left', borderRadius: 3 }} />
          <div style={{ fontWeight: 800, color: C.red, fontSize: 26 }}>?</div>
        </div>
      ))}
    </div>
  );
}

export function Flow({ props }: { props: SceneProps }) {
  const rows: Row[] = props.rows ?? [];
  const t = useClock(14000);
  const stage = useStage(props.punch ? 1 : 0);
  const since = useSince(stage >= 1, 1000);
  const gap = rows.length > 1 ? 190 : 0;
  const top = rows.length > 1 ? 190 : 270;

  return (
    <Stage w={1100} h={620}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
        <Kicker>{props.kicker}</Kicker>
        <div style={{ fontSize: 50, fontWeight: 700, marginTop: 6 }}>{props.title}</div>
      </div>
      {rows.map((r, i) => <FlowRow key={i} row={r} t={t} y={top + i * gap} />)}
      {stage >= 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontSize: 44, fontWeight: 800, ...fade(clamp(since / 400)) }}>
          <span style={{ background: `linear-gradient(transparent 56%,${C.yellow} 56% 92%,transparent 92%)`, padding: '0 10px' }}>{props.punch}</span>
        </div>
      )}
    </Stage>
  );
}

/* ───────────── Slide 5: developer starter pack terminal ───────────── */
export function TerminalScene({ props }: { props: SceneProps }) {
  const stage = useStage(2);
  const t = useClock(9000);
  const lines: [string, number, string?][] = [
    ['$ cat .env.production', 300],
    ['DATABASE_URL=', 1300],
    ['API_KEY=', 1800],
    ['JWT_SECRET=', 2300],
    ['OPENAI_API_KEY=', 2800],
    ['AWS_SECRET=', 3300],
    ['$ npm run build', 4400],
    ['✓ BUILD SUCCESSFUL', 5800, C.green],
  ];
  const caps = ['', 'Works on my machine.', 'Unfortunately, production also has machines.'];

  return (
    <Stage w={1000} h={640}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center' }}>
        <Kicker>{props.kicker}</Kicker>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 6 }}>{props.title}</div>
      </div>
      <div style={{ position: 'absolute', left: 80, top: 110, width: 840, height: 330, borderRadius: 16, background: C.night, border: `3px solid ${C.ink}`, overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)' }}>
        <div style={{ height: 36, background: '#23252f', display: 'flex', gap: 8, alignItems: 'center', padding: '0 14px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: 8, background: c }} />)}
          <span style={{ marginLeft: 12, color: '#9aa0b4', fontSize: 14, fontFamily: 'var(--font-mono)' }}>zsh · fintech api</span>
        </div>
        <div style={{ padding: '14px 22px', fontFamily: 'var(--font-mono)', fontSize: 22, lineHeight: 1.45 }}>
          {lines.map(([txt, st, col], i) => (
            <div key={i} style={{ color: col ?? (txt.startsWith('$') ? C.cyan : C.white), fontWeight: col ? 700 : 400, minHeight: 32 }}>
              {typed(txt, t, st, 30)}
            </div>
          ))}
        </div>
      </div>
      <div key={stage} style={{ position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontSize: stage === 2 ? 40 : 56, fontWeight: 800, ...fade(1, 0) }}>
        {caps[stage]}
      </div>
    </Stage>
  );
}

export const Hl = ({ children }: { children: ReactNode }) => (
  <span style={{ background: `linear-gradient(transparent 56%,${C.yellow} 56% 92%,transparent 92%)`, padding: '0 10px' }}>{children}</span>
);
export { BASE, Pill };
