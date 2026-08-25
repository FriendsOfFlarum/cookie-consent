import buildConfig from '../../src/forum/buildConfig';

/**
 * `buildConfig` turns flat Flarum settings into a vanilla-cookieconsent
 * config. It is pure — no DOM, no app global — so it is unit-testable.
 */

const settings = (overrides: Record<string, string> = {}): Record<string, string> => ({
  'fof-cookie-consent.consentText': 'We use cookies.',
  'fof-cookie-consent.buttonText': 'I Accept',
  'fof-cookie-consent.declineButtonText': 'Decline',
  'fof-cookie-consent.learnMoreLinkText': 'Learn More',
  'fof-cookie-consent.learnMoreLinkUrl': 'https://example.com/privacy',
  'fof-cookie-consent.layout': 'box',
  'fof-cookie-consent.position': 'bottom right',
  'fof-cookie-consent.equalWeightButtons': '1',
  ...overrides,
});

const get = (s: Record<string, string>) => (key: string) => s[`fof-cookie-consent.${key}`];

describe('buildConfig', () => {
  it('declares a single always-on necessary category', () => {
    const config = buildConfig(get(settings()));

    expect(Object.keys(config.categories)).toEqual(['necessary']);
    expect(config.categories.necessary.enabled).toBe(true);
    expect(config.categories.necessary.readOnly).toBe(true);
  });

  it('maps the consent text and both button labels', () => {
    const config = buildConfig(get(settings()));
    const modal = config.language.translations.en.consentModal;

    expect(modal.description).toContain('We use cookies.');
    expect(modal.acceptAllBtn).toBe('I Accept');
    expect(modal.acceptNecessaryBtn).toBe('Decline');
  });

  it('does not offer a preferences button', () => {
    const config = buildConfig(get(settings()));

    expect(config.language.translations.en.consentModal.showPreferencesBtn).toBeUndefined();
  });

  it('appends the learn-more link to the description when both text and url are set', () => {
    const config = buildConfig(get(settings()));

    expect(config.language.translations.en.consentModal.description).toContain('<a href="https://example.com/privacy"');
    expect(config.language.translations.en.consentModal.description).toContain('Learn More');
  });

  it('omits the learn-more link when the url is blank', () => {
    const config = buildConfig(get(settings({ 'fof-cookie-consent.learnMoreLinkUrl': '' })));

    expect(config.language.translations.en.consentModal.description).not.toContain('<a href');
  });

  it('escapes consent text so settings cannot inject markup', () => {
    const config = buildConfig(get(settings({ 'fof-cookie-consent.consentText': '<img src=x onerror=alert(1)>' })));

    expect(config.language.translations.en.consentModal.description).not.toContain('<img');
    expect(config.language.translations.en.consentModal.description).toContain('&lt;img');
  });

  it('escapes the learn-more url and text', () => {
    const config = buildConfig(
      get(
        settings({
          'fof-cookie-consent.learnMoreLinkUrl': '" onmouseover="alert(1)',
          'fof-cookie-consent.learnMoreLinkText': '<b>x</b>',
        })
      )
    );
    const description = config.language.translations.en.consentModal.description;

    expect(description).not.toContain('onmouseover="alert(1)"');
    expect(description).not.toContain('<b>');
  });

  it('passes layout and position through to guiOptions', () => {
    const config = buildConfig(get(settings({ 'fof-cookie-consent.layout': 'cloud' })));

    expect(config.guiOptions?.consentModal?.layout).toBe('cloud');
    expect(config.guiOptions?.consentModal?.position).toBe('bottom right');
  });

  it('falls back to box/bottom right for unrecognised layout and position', () => {
    const config = buildConfig(get(settings({ 'fof-cookie-consent.layout': 'nonsense', 'fof-cookie-consent.position': 'sideways' })));

    expect(config.guiOptions?.consentModal?.layout).toBe('box');
    expect(config.guiOptions?.consentModal?.position).toBe('bottom right');
  });

  it('treats equalWeightButtons as a boolean flag', () => {
    expect(buildConfig(get(settings({ 'fof-cookie-consent.equalWeightButtons': '1' }))).guiOptions?.consentModal?.equalWeightButtons).toBe(true);

    expect(buildConfig(get(settings({ 'fof-cookie-consent.equalWeightButtons': '' }))).guiOptions?.consentModal?.equalWeightButtons).toBe(false);
  });

  it('disables the page-scroll lock so the forum stays usable', () => {
    expect(buildConfig(get(settings())).disablePageInteraction).toBe(false);
  });
});
