import type { CookieConsentConfig, ConsentModalLayout, ConsentModalPosition } from 'vanilla-cookieconsent';

type SettingReader = (key: string) => string | undefined;

/** Stands in for `app.translator.trans`. */
type Translator = (key: string) => string;

const T = 'fof-cookie-consent.forum';

/** A category as serialized by the backend's CategoryRegistry. */
type SerializedCategory = {
  enabled: boolean;
  readOnly: boolean;
  autoClear?: { cookies: { name: string }[]; reloadPage?: boolean };
};

const NECESSARY: Record<string, SerializedCategory> = {
  necessary: { enabled: true, readOnly: true },
};

/**
 * Cookie names arrive as strings. A name wrapped in slashes denotes a pattern
 * and is converted back into the RegExp the library expects, so a category can
 * clear a whole family of cookies (`_ga`, `_gat`, `_gid`).
 */
function toCookieMatcher(name: string): { name: string | RegExp } {
  const pattern = name.match(/^\/(.*)\/$/);

  return { name: pattern ? new RegExp(pattern[1]) : name };
}

function toCategories(serialized: Record<string, SerializedCategory>) {
  return Object.fromEntries(
    Object.entries(serialized).map(([key, category]) => [
      key,
      {
        enabled: category.enabled,
        readOnly: category.readOnly,
        ...(category.autoClear
          ? {
              autoClear: {
                cookies: category.autoClear.cookies.map((c) => toCookieMatcher(c.name)),
                ...(category.autoClear.reloadPage ? { reloadPage: true } : {}),
              },
            }
          : {}),
      },
    ])
  );
}

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

/** Plain text for contexts that are not rendered as HTML. */
function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
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
export default function buildConfig(
  get: SettingReader,
  trans: Translator,
  serialized: Record<string, SerializedCategory> = NECESSARY
): CookieConsentConfig {
  const declinable = Object.entries(serialized).filter(([, c]) => !c.readOnly);
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

    categories: toCategories(serialized),

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            description: buildDescription(trans(`${T}.banner.description`), trans(`${T}.banner.learn_more`), get('learnMoreLinkUrl') || ''),
            acceptAllBtn: trans(`${T}.banner.accept`),
            acceptNecessaryBtn: trans(`${T}.banner.decline`),
            // Only worth offering when there is something to choose between.
            ...(declinable.length > 0 ? { showPreferencesBtn: trans(`${T}.banner.preferences`) } : {}),
          },
          preferencesModal: {
            title: trans(`${T}.preferences.title`),
            acceptAllBtn: trans(`${T}.banner.accept`),
            acceptNecessaryBtn: trans(`${T}.banner.decline`),
            savePreferencesBtn: trans(`${T}.preferences.save`),
            sections: [
              { description: stripTags(trans(`${T}.banner.description`)) },
              // Each category names its own strings, so an extension that
              // declares one ships the matching translations with it.
              ...Object.keys(serialized).map((key) => ({
                title: trans(`${T}.categories.${key}.title`),
                description: trans(`${T}.categories.${key}.description`),
                linkedCategory: key,
              })),
            ],
          },
        },
      },
    },
  };
}
