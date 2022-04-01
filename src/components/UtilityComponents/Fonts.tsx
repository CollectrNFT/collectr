import { Global } from "@emotion/react";
export const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-BoldItalic.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-BoldItalic.woff') format('woff');
        font-weight: bold;
        font-style: italic;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-MediumItalic.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-MediumItalic.woff') format('woff');
        font-weight: 500;
        font-style: italic;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-Regular.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-Italic.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-Italic.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-LightItalic.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-LightItalic.woff') format('woff');
        font-weight: 300;
        font-style: italic;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-Medium.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-Medium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-Light.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
    }
    
    @font-face {
        font-family: 'Neue Montreal';
        src: url('/fonts/NueueMontreal/NeueMontreal-Bold.woff2') format('woff2'),
            url('/fonts/NueueMontreal/NeueMontreal-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }
      `}
  />
);
