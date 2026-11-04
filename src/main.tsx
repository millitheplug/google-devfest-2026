import React from 'react';
import ReactDOM from 'react-dom/client';
import StudioApp from './studio/StudioApp';
import seed from '../deck.json';
import './styles/tokens.css';
import './styles/chrome-tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/scenes.css';

document.title = `${seed.deck.title} · ${seed.slides.length} slides`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StudioApp />
  </React.StrictMode>
);
