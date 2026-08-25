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
  /** Every cookie the category declares, erased or not — shown to visitors. */
  declaredCookies?: string[];
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

/**
 * Describe a cookie's purpose. Cookie names are not always known ahead of
 * time — a forum may rename core's via `cookie.name`, and extensions declare
 * their own — so fall back to a generic description rather than showing a raw
 * translation key.
 */
function describeCookie(trans: Translator, name: string): string {
  const key = `${T}.cookies.${name}`;
  const described = trans(key);

  return described === key ? trans(`${T}.cookies.unknown`) : described;
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
            // Always offered, as visitors expect from a cookie banner. Even
            // with nothing declinable the modal explains what is stored and
            // why, which is the transparency the banner exists to provide.
            showPreferencesBtn: trans(`${T}.banner.preferences`),
          },
          preferencesModal: {
            title: trans(`${T}.preferences.title`),
            acceptAllBtn: trans(`${T}.banner.accept`),
            acceptNecessaryBtn: trans(`${T}.banner.decline`),
            savePreferencesBtn: trans(`${T}.preferences.save`),
            sections: [
              { description: trans(`${T}.preferences.description`) },
              // Each category names its own strings, so an extension that
              // declares one ships the matching translations with it.
              ...Object.entries(serialized).map(([key, category]) => ({
                title: trans(`${T}.categories.${key}.title`),
                description: trans(`${T}.categories.${key}.description`),
                linkedCategory: key,
                // Naming the actual cookies is the transparency the modal is
                // for; a category that declares none gets no empty table.
                ...(category.declaredCookies?.length
                  ? {
                      cookieTable: {
                        headers: {
                          name: trans(`${T}.preferences.cookie_table.name`),
                          description: trans(`${T}.preferences.cookie_table.description`),
                        },
                        body: category.declaredCookies.map((name) => ({
                          name,
                          description: describeCookie(trans, name),
                        })),
                      },
                    }
                  : {}),
              })),
            ],
          },
        },
      },
    },
  };
}
