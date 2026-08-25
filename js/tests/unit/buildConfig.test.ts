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

  it('does not offer a preferences button when nothing is declinable', () => {
    expect(build().language.translations.en.consentModal.showPreferencesBtn).toBeUndefined();
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

  it('labels each category section from its own translation key', () => {
    const config = build(
      {},
      {
        necessary: { enabled: true, readOnly: true },
        analytics: { enabled: false, readOnly: false },
      }
    );

    const sections = config.language.translations.en.preferencesModal.sections;

    expect(sections).toContainEqual(
      expect.objectContaining({
        title: 'fof-cookie-consent.forum.categories.analytics.title',
        linkedCategory: 'analytics',
      })
    );
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
