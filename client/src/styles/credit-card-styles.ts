import { createGlobalStyle } from 'styled-components';
import { device } from './breakpoints';

export const CreditCardStyles = createGlobalStyle`
  .rccs {
    &__card {
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 350px; 

      @media ${device.sm} {
        max-width: 280px; 
        max-height: 200px; 
      }

      @media ${device.xs} {
        max-width: 240px; 
        padding: 0;
        margin: 0;
        max-height: 180px; 
      }
    }

    &__number {
      font-size: 1.2em;
    }

    &__name, &__expiry {
      font-size: 1em;
    }

    &__cvc {
      font-size: 1em;
    }

    &__chip {
      filter: hue-rotate(180deg);
    }
  }
`;
