import type { CSSProperties, ReactNode } from 'react';
import { BASE, C, Cursor, Stage, clamp, ease, seg, useClock, useStage } from './kit';
import { Hl, type SceneProps } from './scenesA';

const fade = (p: number, y = 22): CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * y}px)` });

/** DevFest-style bracket bubble: curved "( )" edges, no top/bottom border. */
function Bubble({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${C.ink}`,
        borderRight: `3px solid ${C.ink}`,
        borderRadius: '70px / 50%',
        padding: '12px 38px',
        fontSize: 18,
        lineHeight: 1.3,
        textAlign: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const Tab = ({ children, bg, style }: { children: ReactNode; bg: string; style?: CSSProperties }) => (
  <div style={{ background: bg, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '8px 26px', fontWeight: 700, fontSize: 22, display: 'inline-block', ...style }}>{children}</div>
);

/* ── About the speaker (template “What is DevFest?” page) ── */
export function AboutMe({ props }: { props: SceneProps }) {
  const t = useClock(4200);
  const p = (i: number) => seg(t, 250 + i * 380, 800 + i * 380);
  const drop = ease(seg(t, 200, 1200));

  return (
    <Stage w={1100} h={640} pad="84px 2% 62px">
      <div style={{ position: 'absolute', left: 10, top: 14, width: 650 }}>
        <div style={fade(p(0))}>
          <Tab bg="#fff" style={{ fontSize: 24, padding: '8px 40px' }}>About me</Tab>
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.05, margin: '12px 0 2px', letterSpacing: '-0.02em', ...fade(p(1)) }}>
          Ireoluwatomiwa Omotayo
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 14, ...fade(p(1)) }}>
          <Hl>Information Security Analyst</Hl> · GTCO Holdings (GTBank)
        </div>
        <Bubble style={{ ...fade(p(2)), marginBottom: 10 }}>
          Experience across <b>financial services, EdTech, cybersecurity, blockchain and software development</b>. Expertise in information security, governance, <b>data privacy</b>, risk management, <b>AI</b> and digital transformation.
        </Bubble>
        <Bubble style={{ ...fade(p(3)), marginBottom: 10 }}>
          <b>Certified Data Protection Officer</b> · ISO Lead Implementer &amp; Lead Auditor · ISO 27001, 42001, 27032, 27701 and related frameworks, plus certifications in cybersecurity, networking, application security and API security.
        </Bubble>
        <Bubble style={{ ...fade(p(4)), marginBottom: 10 }}>
          Focused on organisational resilience through enterprise security, effective controls, privacy practices, regulatory compliance and risk management, building <b>secure, responsible, privacy-conscious</b> digital ecosystems.
        </Bubble>
        <div style={fade(p(5))}>
          <Tab bg={C.mint} style={{ fontSize: 17 }}>🎨 Beyond work: painting, where analytical rigour meets creativity</Tab>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 710, top: 22, width: 380, transform: `translateY(${(1 - drop) * -420}px) rotate(${2.5 - (1 - drop) * 8}deg)`, opacity: clamp(drop * 2) }}>
        <div style={{ background: '#fff', border: `3px solid ${C.ink}`, borderRadius: 26, padding: '16px 16px 0', boxShadow: '0 30px 50px -28px rgba(0,0,0,.55)' }}>
          <div style={{ position: 'absolute', left: 38, top: -16, transform: 'rotate(-4deg)', background: C.sun, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '3px 18px', fontWeight: 800, fontSize: 18 }}>Speaker</div>
          <img src={`${BASE}speaker.jpg`} alt="Ireoluwatomiwa Omotayo" style={{ width: '100%', height: 440, objectFit: 'cover', objectPosition: '50% 12%', borderRadius: 14, display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 4px 14px' }}>
            <img src={`${BASE}devfest-wordmark.png`} alt="DevFest" style={{ height: 34 }} />
            <img src={`${BASE}gdg-mark.png`} alt="" style={{ height: 34 }} />
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ── Questions (template “In your words…” card) ── */
export function Questions({ props }: { props: SceneProps }) {
  const t = useClock(4200);
  const stage = useStage(1);
  const word = 'Questions?';
  const pop = ease(seg(t, 2400, 3000));
  const cx = 900 - ease(seg(t, 2800, 3500)) * 250;
  const cy = 600 - ease(seg(t, 2800, 3500)) * 140;

  return (
    <Stage w={1100} h={640} pad="78px 2% 62px">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 10, textAlign: 'center', ...fade(seg(t, 0, 500)) }}>
        <Tab bg={C.pink}>{props.kicker ?? 'Over to you'}</Tab>
      </div>
      <img src={`${BASE}quote.png`} alt="" style={{ position: 'absolute', left: 90, top: 120, width: 150, transform: `scale(${pop}) rotate(${(1 - pop) * -25}deg)`, opacity: pop }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontSize: 170, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, display: 'flex', justifyContent: 'center' }}>
        {word.split('').map((ch, i) => {
          const q = ease(seg(t, 300 + i * 110, 900 + i * 110));

          return <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - q) * -160}px) rotate(${(1 - q) * (i % 2 ? 12 : -12)}deg)`, opacity: q }}>{ch}</span>;
        })}
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, top: 345, ...fade(seg(t, 1500, 2100)) }}>
        <Bubble style={{ fontSize: 34, fontWeight: 600 }}>{props.text ?? 'Ask me anything.'}</Bubble>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 500, display: 'flex', justifyContent: 'center', gap: 14, ...fade(seg(t, 1900, 2500)) }}>
        {['Consent & the NDPA', 'AI agent permissions', 'Getting into security'].map((x, i) => (
          <Tab key={x} bg={[C.sky, C.mint, '#fff'][i]} style={{ fontSize: 19 }}>{x}</Tab>
        ))}
      </div>
      <Cursor x={cx} y={cy} click={stage >= 1} />
    </Stage>
  );
}

/* ── Thank you (template “Let the DevFest begin!” page) ── */
export function ThankYou({ props }: { props: SceneProps }) {
  const t = useClock(4200);
  const p = (i: number) => seg(t, 200 + i * 380, 800 + i * 380);
  const cx = 1040 - ease(seg(t, 2400, 3200)) * 60;
  const cy = 700 - ease(seg(t, 2400, 3200)) * 235;

  return (
    <Stage w={1100} h={640} pad="78px 2% 62px">
      <div style={{ position: 'absolute', left: 20, top: 90, width: 560 }}>
        <Bubble style={{ padding: '30px 50px', ...fade(p(0)) }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>Thank<br />you!</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 14 }}>{props.line ?? 'The form is not the privacy. Privacy is something we engineer.'}</div>
        </Bubble>
        <div style={{ marginTop: 22, textAlign: 'center', ...fade(p(2)) }}>
          <Tab bg="#fff" style={{ fontSize: 17, borderRadius: 18, lineHeight: 1.3 }}>
            <b>Ireoluwatomiwa Omotayo</b><br />Information Security Analyst · GTCO Holdings
          </Tab>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 660, top: 40, width: 360, ...fade(p(1)) }}>
        <div style={{ background: '#fff', border: `3px solid ${C.ink}`, borderRadius: 26, padding: 18, boxShadow: '0 24px 40px -26px rgba(0,0,0,.5)' }}>
          <img src={`${BASE}qr-devfest.png`} alt="DevFest QR code" style={{ width: '100%', display: 'block' }} />
        </div>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <Tab bg="#fff" style={{ color: C.blue, textDecoration: 'underline' }}>goo.gle/DevFest</Tab>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', ...fade(p(3)) }}>
        <Tab bg="#fff" style={{ fontSize: 20 }}>Follow #DevFest for updates, recaps, and news!</Tab>
      </div>
      <Cursor x={cx} y={cy} click={t > 3300 && t < 3700} />
    </Stage>
  );
}
