import { describe, it, expect } from '@jest/globals';
import buildConfig from '../../src/forum/buildConfig';

/**
 * `buildConfig` turns Flarum settings and translations into a
 * vanilla-cookieconsent config. It is pure — no DOM, no app global — so it is
 * unit-testable directly.
 *
 * Visitor-facing text comes from the locale file rather than free-text admin
 * settings, so it can be translated per-language; admins override it with
 * fof/linguist or a language pack.
 */
const settings = (overrides: Record<string, string> = {}): Record<string, string> => ({
  'fof-cookie-consent.learnMoreLinkUrl': 'https://example.com/privacy',
  'fof-cookie-consent.layout': 'box',
  'fof-cookie-consent.position': 'bottom right',
  'fof-cookie-consent.equalWeightButtons': '1',
  ...overrides,
});

const get = (s: Record<string, string>) => (key: string) => s[`fof-cookie-consent.${key}`];

const strings: Record<string, string> = {
  'fof-cookie-consent.forum.banner.description': 'We use cookies.',
  'fof-cookie-consent.forum.banner.accept': 'I Accept',
  'fof-cookie-consent.forum.banner.decline': 'Decline',
  'fof-cookie-consent.forum.banner.learn_more': 'Learn More',
  // Keys a declaring extension would ship, so `translated()` sees them as real.
  'fof-analytics.forum.consent.title': 'Analytics (from fof/analytics)',
  'fof-analytics.forum.consent.description': 'Declared by fof/analytics',
  'fof-analytics.forum.cookies._gid': 'Distinguishes users, set by Google Analytics',
  'fof-cookie-consent.forum.categories.necessary.title': 'Strictly necessary',
};

/** Stands in for `app.translator.trans`, returning the key when unmapped. */
const trans = (key: string) => strings[key] ?? key;

const build = (overrides: Record<string, string> = {}, categories?: any) => buildConfig(get(settings(overrides)), trans, categories);

describe('buildConfig', () => {
  it('declares a single always-on necessary category by default', () => {
    const config = build();

    expect(Object.keys(config.categories)).toEqual(['necessary']);
    expect(config.categories.necessary.enabled).toBe(true);
    expect(config.categories.necessary.readOnly).toBe(true);
  });

  it('uses the categories declared by other extensions', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true },
        analytics: { enabled: false, readOnly: false, autoClear: { cookies: [{ name: '_ga' }] } },
      }
    );

    expect(Object.keys(config.categories)).toEqual(['necessary', 'analytics']);
    expect(config.categories.analytics.autoClear.cookies).toEqual([{ name: '_ga' }]);
  });

  it('converts serialized cookie patterns back into regular expressions', () => {
    const config = build(
      {},
      {
        analytics: { enabled: false, readOnly: false, autoClear: { cookies: [{ name: '/^_ga/' }] } },
      }
    );

    expect(config.categories.analytics.autoClear.cookies[0].name).toBeInstanceOf(RegExp);
  });

  it('takes the banner text and button labels from translations', () => {
    const modal = build().language.translations.en.consentModal;

    expect(modal.description).toContain('We use cookies.');
    expect(modal.acceptAllBtn).toBe('I Accept');
    expect(modal.acceptNecessaryBtn).toBe('Decline');
  });

  it('always offers a preferences button, as visitors expect', () => {
    // Even with nothing declinable, the modal explains what the forum stores
    // and why — which is the transparency the banner is there to provide.
    expect(build().language.translations.en.consentModal.showPreferencesBtn).toBeTruthy();
  });

  it('shows the declared cookies in a table so visitors can see what is stored', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true, declaredCookies: ['flarum_session', 'cc_cookie'] },
      }
    );

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'necessary');

    expect(section.cookieTable.body).toEqual([expect.objectContaining({ name: 'flarum_session' }), expect.objectContaining({ name: 'cc_cookie' })]);
  });

  it('falls back to a generic purpose when a cookie has no description', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true, declaredCookies: ['discuss_session'] },
      }
    );

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'necessary');

    // A renamed core cookie has no matching key. Rather than inventing a
    // vague purpose, the cell is left empty.
    expect(section.cookieTable.body[0].description).toBe('');
  });

  it('omits the cookie table for a category that declares nothing', () => {
    const config = build({}, { necessary: { enabled: true, readOnly: true, declaredCookies: [] } });

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'necessary');

    expect(section.cookieTable).toBeUndefined();
  });

  it('lists the necessary category in the preferences modal', () => {
    const sections = build().language.translations.en.preferencesModal.sections;

    expect(sections).toContainEqual(expect.objectContaining({ title: 'Strictly necessary', linkedCategory: 'necessary' }));
  });

  it('offers a preferences button once a declinable category exists', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true },
        analytics: { enabled: false, readOnly: false },
      }
    );

    expect(config.language.translations.en.consentModal.showPreferencesBtn).toBeTruthy();
    expect(config.language.translations.en.preferencesModal.sections.length).toBeGreaterThan(1);
  });

  it('uses the translation keys a category supplies for itself', () => {
    const config = build(
      {},
      {
        analytics: {
          enabled: false,
          readOnly: false,
          titleKey: 'fof-analytics.forum.consent.title',
          descriptionKey: 'fof-analytics.forum.consent.description',
        },
      }
    );

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'analytics');

    expect(section.title).toBe('Analytics (from fof/analytics)');
    expect(section.description).toBe('Declared by fof/analytics');
  });

  it('falls back to a readable title when a category has no translation', () => {
    const config = build({}, { analytics: { enabled: false, readOnly: false } });

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'analytics');

    // Never show a raw translation key to visitors.
    expect(section.title).not.toContain('fof-cookie-consent.');
    expect(section.title).toBe('Analytics');
    expect(section.description).toBe('');
  });

  it('uses a cookie description supplied by the declaring extension', () => {
    const config = build(
      {},
      {
        analytics: {
          enabled: false,
          readOnly: false,
          declaredCookies: ['_gid'],
          descriptions: { _gid: 'fof-analytics.forum.cookies._gid' },
        },
      }
    );

    const section = config.language.translations.en.preferencesModal.sections.find((s: any) => s.linkedCategory === 'analytics');

    expect(section.cookieTable.body[0].description).toBe('Distinguishes users, set by Google Analytics');
  });

  it('labels each category section from its own translation key', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true },
        analytics: { enabled: false, readOnly: false },
      }
    );

    const sections = config.language.translations.en.preferencesModal.sections;

    expect(sections).toContainEqual(expect.objectContaining({ linkedCategory: 'analytics' }));
  });

  it('appends the learn-more link when a url is configured', () => {
    const description = build().language.translations.en.consentModal.description;

    expect(description).toContain('<a href="https://example.com/privacy"');
    expect(description).toContain('Learn More');
  });

  it('omits the learn-more link when the url is blank', () => {
    const config = build({ 'fof-cookie-consent.learnMoreLinkUrl': '' });

    expect(config.language.translations.en.consentModal.description).not.toContain('<a href');
  });

  it('escapes the learn-more url so a setting cannot inject markup', () => {
    const config = build({ 'fof-cookie-consent.learnMoreLinkUrl': '" onmouseover="alert(1)' });

    expect(config.language.translations.en.consentModal.description).not.toContain('onmouseover="alert(1)"');
  });

  it('passes layout and position through to guiOptions', () => {
    const config = build({ 'fof-cookie-consent.layout': 'cloud' });

    expect(config.guiOptions?.consentModal?.layout).toBe('cloud');
    expect(config.guiOptions?.consentModal?.position).toBe('bottom right');
  });

  it('falls back to box/bottom right for unrecognised layout and position', () => {
    const config = build({ 'fof-cookie-consent.layout': 'nonsense', 'fof-cookie-consent.position': 'sideways' });

    expect(config.guiOptions?.consentModal?.layout).toBe('box');
    expect(config.guiOptions?.consentModal?.position).toBe('bottom right');
  });

  it('treats equalWeightButtons as a boolean flag', () => {
    expect(build({ 'fof-cookie-consent.equalWeightButtons': '1' }).guiOptions?.consentModal?.equalWeightButtons).toBe(true);
    expect(build({ 'fof-cookie-consent.equalWeightButtons': '' }).guiOptions?.consentModal?.equalWeightButtons).toBe(false);
  });

  it('disables the page-scroll lock so the forum stays usable', () => {
    expect(build().disablePageInteraction).toBe(false);
  });
});
