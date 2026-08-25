/**
 * Minimal typings for the `cookieconsent` library, which ships none of its own.
 *
 * The library assigns itself to `window.cookieconsent`, so it is reachable as a
 * bare global. Only the surface this extension uses is declared here.
 */
interface CookieConsentPalette {
  popup?: {
    background?: string;
    text?: string;
  };
  button?: {
    background?: string;
    text?: string;
  };
}

interface CookieConsentOptions {
  theme?: string;
  content?: {
    message?: string;
    dismiss?: string;
    link?: string;
    href?: string;
  };
  palette?: CookieConsentPalette;
}

interface CookieConsent {
  initialise(options: CookieConsentOptions): void;
}

declare const cookieconsent: CookieConsent;

interface Window {
  cookieconsent?: CookieConsent;
}
