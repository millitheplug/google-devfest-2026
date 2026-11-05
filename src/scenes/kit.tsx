import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useDeck } from '../deck/DeckContext';

export const C = {
  ink: '#171923',
  night: '#08090D',
  night2: '#171923',
  purple: '#A78BFA',
  cyan: '#39E6D0',
  white: '#F5F5F7',
  red: '#FF5470',
  green: '#2fbf71',
  yellow: '#ffcf33',
  blue: '#4285f4',
  pink: '#f8c8d8',
  sky: '#bde6f3',
  mint: '#c6f3c4',
  sun: '#fde9a6',
};
export const BASE = `${import.meta.env.BASE_URL}brand/`;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** progress 0..1 of t within [a,b] */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const typed = (s: string, t: number, start: number, cps = 28) =>
  s.slice(0, Math.max(0, Math.floor(((t - start) / 1000) * cps)));
export const typedDone = (s: string, t: number, start: number, cps = 28) =>
  ((t - start) / 1000) * cps >= s.length;
export const ease = (p: number) => 1 - Math.pow(1 - p, 3);
export const rnd = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Click-driven stage (0..max). Registers `max` builds with the deck. */
export function useStage(max: number) {
  const { clicks, isStatic, registerMax } = useDeck();

  useEffect(() => {
    registerMax?.(max);
  }, [max, registerMax]);

  return isStatic ? max : Math.min(clicks, max);
}

/** Free-running clock in ms from mount; jumps to the end state in static mode. */
export function useClock(total: number, delay = 0) {
  const { isStatic } = useDeck();
  const [t, setT] = useState(isStatic ? total : 0);

  useEffect(() => {
    if (isStatic) {
      setT(total);

      return;
    }

    let raf = 0;
    const s = performance.now() + delay;
    const f = (n: number) => {
      setT(clamp(n - s, 0, total));
      if (n - s < total) raf = requestAnimationFrame(f);
    };

    raf = requestAnimationFrame(f);

    return () => cancelAnimationFrame(raf);
  }, [total, delay, isStatic]);

  return t;
}

/** ms since `flag` turned true (0 before; `total` in static mode). */
export function useSince(flag: boolean, total: number) {
  const { isStatic } = useDeck();
  const [t, setT] = useState(isStatic && flag ? total : 0);

  useEffect(() => {
    if (!flag) {
      setT(0);

      return;
    }

    if (isStatic) {
      setT(total);

      return;
    }

    let raf = 0;
    const s = performance.now();
    const f = (n: number) => {
      setT(clamp(n - s, 0, total));
      if (n - s < total) raf = requestAnimationFrame(f);
    };

    raf = requestAnimationFrame(f);

    return () => cancelAnimationFrame(raf);
  }, [flag, total, isStatic]);

  return t;
}

/** Fixed-size canvas scaled to fit the slide (deterministic coordinates). */
export function Stage({
  w,
  h,
  children,
  style,
}: {
  w: number;
  h: number;
  children: ReactNode;
  style?: CSSProperties;
  /** @deprecated safe area is now derived from the slide frame */
  pad?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.5);

  useLayoutEffect(() => {
    const el = box.current;

    if (!el) return;

    const fit = () => setK(Math.min(el.clientWidth / w, el.clientHeight / h));

    fit();

    const ro = new ResizeObserver(fit);

    ro.observe(el);

    return () => ro.disconnect();
  }, [w, h]);

  return (
    <div
      ref={box}
      className="sc-box"
      style={{ position: 'absolute', top: '13.5cqh', bottom: '9.5cqh', left: '2.5cqw', right: '2.5cqw', ...style }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: w,
            height: h,
            transform: `translate(-50%,-50%) scale(${k})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function Kicker({
  children,
  dark,
  style,
}: {
  children: ReactNode;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 17,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: dark ? C.cyan : '#484852',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  bg = '#fff',
  color = C.ink,
  style,
}: {
  children: ReactNode;
  bg?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: bg,
        color,
        border: `2px solid ${C.ink}`,
        borderRadius: 999,
        padding: '8px 22px',
        fontWeight: 600,
        fontSize: 22,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Cursor({
  x,
  y,
  size = 54,
  click,
}: {
  x: number;
  y: number;
  size?: number;
  click?: boolean;
}) {
  return (
    <img
      src={`${BASE}cursor.png`}
      alt=""
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size,
        transform: `translate(${x}px,${y}px) scale(${click ? 0.86 : 1})`,
        transformOrigin: '10% 10%',
        zIndex: 50,
        filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.25))',
        pointerEvents: 'none',
      }}
    />
  );
}

/** ms since the last stage change (resets each click); `total` in static mode. */
export function useStageTime(stage: number, total: number) {
  const { isStatic } = useDeck();
  const [t, setT] = useState(isStatic ? total : 0);

  useEffect(() => {
    if (isStatic) {
      setT(total);

      return;
    }

    let raf = 0;
    const s = performance.now();

    const f = (n: number) => {
      setT(clamp(n - s, 0, total));
      if (n - s < total) raf = requestAnimationFrame(f);
    };

    setT(0);
    raf = requestAnimationFrame(f);

    return () => cancelAnimationFrame(raf);
  }, [stage, total, isStatic]);

  return t;
}

/** Full-slide meme beat: dimmed backdrop + tilted meme card + caption. */
export function MemeOverlay({
  show,
  src,
  caption,
  top,
  children,
}: {
  show: boolean;
  src: string;
  caption: ReactNode;
  top?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(16,17,24,.55)',
        opacity: show ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity .35s',
      }}
    >
      <div
        style={{
          transform: show ? 'rotate(-2deg) scale(1)' : 'rotate(-8deg) scale(.7)',
          transition: 'transform .5s cubic-bezier(.34,1.56,.64,1)',
          background: '#fff',
          border: `3px solid ${C.ink}`,
          borderRadius: 22,
          padding: '1.6cqh 1.6cqh 1.2cqh',
          maxWidth: '62cqw',
          boxShadow: '0 40px 70px -30px rgba(0,0,0,.7)',
        }}
      >
        {top}
        <div style={{ position: 'relative' }}>
          <img src={`${BASE}memes/${src}.jpg`} alt="" style={{ display: 'block', height: '52cqh', maxWidth: '58cqw', objectFit: 'contain', borderRadius: 12 }} />
          {children}
        </div>
        <div style={{ textAlign: 'center', fontSize: '2.6cqh', fontWeight: 700, padding: '1.2cqh 1cqh 0', maxWidth: '58cqw' }}>{caption}</div>
      </div>
    </div>
  );
}
