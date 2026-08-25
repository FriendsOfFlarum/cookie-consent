import type { CookieConsentConfig, ConsentModalLayout, ConsentModalPosition } from 'vanilla-cookieconsent';

type SettingReader = (key: string) => string | undefined;

const LAYOUTS: ConsentModalLayout[] = ['box', 'box wide', 'box inline', 'cloud', 'cloud inline', 'bar', 'bar inline'];

const POSITIONS: ConsentModalPosition[] = [
  'top',
  'bottom',
  'middle',
  'top left',
  'top center',
  'top right',
  'middle left',
  'middle center',
  'middle right',
  'bottom left',
  'bottom center',
  'bottom right',
];

const DEFAULT_LAYOUT: ConsentModalLayout = 'box';
const DEFAULT_POSITION: ConsentModalPosition = 'bottom right';

/**
 * Settings are admin-authored plain text, but the library renders `description`
 * as HTML. Escape everything we interpolate so a setting cannot inject markup.
 */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Build the consent modal description: the admin's message, plus an optional
 * link to their privacy policy. Both halves are escaped.
 */
function buildDescription(text: string, linkText: string, linkUrl: string): string {
  const description = `<p>${escapeHtml(text)}</p>`;

  if (!linkUrl || !linkText) return description;

  return `${description}<p><a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkText)}</a></p>`;
}

/**
 * Translate this extension's flat settings into a vanilla-cookieconsent config.
 *
 * Kept free of `app` and the DOM so it can be unit-tested directly; the caller
 * supplies a reader for `fof-cookie-consent.*` settings.
 *
 * Only a single, always-on `necessary` category is declared. This extension
 * shows a cookie notice with accept/decline rather than managing granular
 * consent, so there is nothing for a preferences modal to toggle.
 */
export default function buildConfig(get: SettingReader): CookieConsentConfig {
  const layout = get('layout') as ConsentModalLayout;
  const position = get('position') as ConsentModalPosition;

  return {
    // The banner is a notice, not a blocker — never trap the reader.
    disablePageInteraction: false,

    guiOptions: {
      consentModal: {
        layout: LAYOUTS.includes(layout) ? layout : DEFAULT_LAYOUT,
        position: POSITIONS.includes(position) ? position : DEFAULT_POSITION,
        equalWeightButtons: Boolean(get('equalWeightButtons')),
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
    },

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            description: buildDescription(get('consentText') || '', get('learnMoreLinkText') || '', get('learnMoreLinkUrl') || ''),
            acceptAllBtn: get('buttonText') || '',
            acceptNecessaryBtn: get('declineButtonText') || '',
          },
          // No togglable categories, so the preferences modal is never shown.
          preferencesModal: { sections: [] },
        },
      },
    },
  };
}
