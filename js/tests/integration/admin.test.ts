import { jest, describe, it, expect, beforeEach } from '@jest/globals';

/**
 * The admin side registers its settings declaratively through
 * `Extend.Admin()`, so the assertions inspect the extender's registrations
 * rather than rendering a page component.
 */
async function loadExtenders() {
  const { default: extenders } = await import('../../src/admin/extend');

  return extenders;
}

/** Collect every `setting()` registration's config object. */
function settingsOf(extender: any): any[] {
  return extender.settings
    .filter((entry: any) => entry.setting)
    .map((entry: any) => entry.setting())
    .filter(Boolean);
}

describe('admin settings', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('registers every setting the forum side reads', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const keys = settingsOf(admin).map((s) => s.setting);

    expect(keys).toEqual(
      expect.arrayContaining([
        'fof-cookie-consent.consentText',
        'fof-cookie-consent.buttonText',
        'fof-cookie-consent.declineButtonText',
        'fof-cookie-consent.learnMoreLinkText',
        'fof-cookie-consent.learnMoreLinkUrl',
        'fof-cookie-consent.layout',
        'fof-cookie-consent.position',
        'fof-cookie-consent.equalWeightButtons',
      ])
    );
  });

  it('offers the decline button text as an editable field', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const decline = settingsOf(admin).find((s) => s.setting === 'fof-cookie-consent.declineButtonText');

    expect(decline).toBeDefined();
    expect(decline.type).toBe('text');
  });

  it('constrains layout and position to the values the library accepts', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const all = settingsOf(admin);

    const layout = all.find((s) => s.setting === 'fof-cookie-consent.layout');
    expect(layout.type).toBe('select');
    expect(Object.keys(layout.options)).toEqual(expect.arrayContaining(['box', 'cloud', 'bar']));

    const position = all.find((s) => s.setting === 'fof-cookie-consent.position');
    expect(position.type).toBe('select');
    expect(Object.keys(position.options)).toEqual(expect.arrayContaining(['bottom right', 'bottom left']));
  });

  it('exposes equal-weight buttons as a boolean toggle', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const equal = settingsOf(admin).find((s) => s.setting === 'fof-cookie-consent.equalWeightButtons');

    expect(equal.type).toBe('boolean');
  });

  it('registers the colour settings the stylesheet consumes', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const all = settingsOf(admin);

    for (const key of ['backgroundColor', 'textColor', 'buttonBackgroundColor', 'buttonTextColor']) {
      const setting = all.find((s) => s.setting === `fof-cookie-consent.${key}`);

      expect(setting).toBeDefined();
      expect(setting.type).toBe('color-preview');
    }
  });

  it('no longer registers the removed cc theme setting', async () => {
    const { default: bootstrapAdmin } = await import('@flarum/jest-config/src/bootstrap/admin');
    bootstrapAdmin();

    const [admin] = await loadExtenders();
    const keys = settingsOf(admin).map((s) => s.setting);

    expect(keys).not.toContain('fof-cookie-consent.ccTheme');
  });
});
