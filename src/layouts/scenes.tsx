import type { LayoutDef } from './shared';
import * as A from '../scenes/scenesA';
import * as B from '../scenes/scenesB';
import * as D from '../scenes/scenesC';

type R = (p: { props: A.SceneProps }) => React.ReactNode;

const KINDS: Record<string, R> = {
  moneyMachine: () => <A.MoneyMachine />,
  plotTwist: () => <A.PlotTwist />,
  titleGlitch: A.TitleGlitch,
  webForm: A.WebForm,
  montage: A.Montage,
  flow: A.Flow,
  terminal: A.TerminalScene,
  spectrum: B.Spectrum,
  split: B.Split,
  checkbox: () => <B.CheckboxScene />,
  hub: B.Hub,
  pdfInject: B.PdfInject,
  pasteLeak: B.PasteLeak,
  map: B.NigeriaMap,
  ladder: B.Ladder,
  masterKey: B.MasterKey,
  stack: B.StackScene,
  privacyArch: B.PrivacyArch,
  attackDemo: B.AttackDemo,
  fiveQ: B.FiveQ,
  checklist: B.Checklist,
  govDash: B.GovDash,
  blackout: B.Blackout,
  aboutMe: D.AboutMe,
  questions: D.Questions,
  thankYou: D.ThankYou,
};

export const sceneLayouts: LayoutDef[] = [
  {
    type: 'scene',
    label: 'Cinematic scene',
    defaults: { kind: 'flow', kicker: 'Scene', title: 'Animated scene' },
    Render: ({ slide }) => {
      const K = KINDS[slide.props?.kind];

      return K ? (
        <K props={slide.props} />
      ) : (
        <div className="slide center">Unknown scene “{String(slide.props?.kind)}”</div>
      );
    },
  },
];
