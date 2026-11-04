import type { CSSProperties } from 'react';
import type { SlideData } from '../data/types';

const B = `${import.meta.env.BASE_URL}brand/`;

/** Small line-art accent that suits the slide's layout (from the DevFest template). */
const DECO: Record<string, { img: string; style: CSSProperties }> = {
  code: {
    img: 'code.png',
    style: { right: '5%', top: '15%', width: 'clamp(70px,8vw,150px)' },
  },
  chat: {
    img: 'cursor.png',
    style: { right: '6%', bottom: '13%', width: 'clamp(60px,7vw,130px)' },
  },
  manifesto: {
    img: 'braces.png',
    style: { right: '6%', bottom: '14%', width: 'clamp(70px,8vw,150px)' },
  },
  persona: {
    img: 'globe.png',
    style: { right: '5%', top: '15%', width: 'clamp(60px,7vw,130px)' },
  },
  bigNumber: {
    img: 'asterisk.png',
    style: { right: '7%', top: '16%', width: 'clamp(60px,7vw,130px)' },
  },
};

/** DevFest brand chrome: pattern strip, GDG + DevFest logos, layout accent. */
export default function BrandLayer({ slide }: { slide: SlideData }) {
  const deco = DECO[slide.layout];

  return (
    <div
      className={'brand-layer' + (slide.props?.dark ? ' brand-dark' : '')}
      aria-hidden
    >
      <div
        className="brand-strip"
        style={{ backgroundImage: `url(${B}strip.png)` }}
      />
      {deco && (
        <img
          className="brand-deco"
          src={`${B}${deco.img}`}
          alt=""
          style={deco.style}
        />
      )}
      <img className="brand-gdg" src={`${B}gdg-lockup.png`} alt="" />
      <img className="brand-devfest" src={`${B}devfest-wordmark.png`} alt="" />
    </div>
  );
}
