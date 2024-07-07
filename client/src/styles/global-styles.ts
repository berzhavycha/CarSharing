import { createGlobalStyle } from 'styled-components';
import '@fontsource/plus-jakarta-sans';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Colors */
    --main-bg-color: #F6F7F9;
    --light-blue: #6b90ff;
    --main-blue: #3563e9;
    --dark-blue: #2b4fad;
    --gray-blue: #6b7280;
    --gray: #90A3BF;
    --dark: #1a202c;
    --light-dark: #596780;
    --light-gray: #eaebed;

    /* Status Colors */
    --green-status-text: #28a745;
    --yellow-status-text: #ffc107;
    --red-status-text: #ff4343;
    --default-red: #dc3545;

    --green-status-bg: #d4edda;
    --yellow-status-bg: #fff3cd;
    --red-status-bg: #f8d7da;
    --default-bg: #f8d7da;

    --green-status-border: #c3e6cb;
    --yellow-status-border: #ffeeba;
    --red-status-border: #f5c6cb;
    --default-border: #f5c6cb;

    --top-up-text: #28a745;
    --rental-payment-text: #ffc107;
    --refund-text: #17a2b8;
    --penalty-text: #ff4343;

    --top-up-bg: #d4edda;
    --rental-payment-bg: #fff3cd;
    --refund-bg: #d1ecf1;
    --penalty-bg: #f8d7da;
    --default-bg: #f8d7da;

    --top-up-border: #c3e6cb;
    --rental-payment-border: #ffeeba;
    --refund-border: #bee5eb;
    --penalty-border: #f5c6cb;
    --default-border: #f5c6cb;

    /* Borders */
    --default-border: 1px solid rgba(195, 212, 233, 0.5);
    --input-border: 1px solid #e0e0e0;

    /* Shadows */
    --default-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    /* Transitions */
    --default-transition: all .2s ease;

    /* Font */
    --font-family: "Plus Jakarta Sans", sans-serif;
  }

  body {
    background-color: var(--main-bg-color);
    font-family: var(--font-family);
  }
`;

