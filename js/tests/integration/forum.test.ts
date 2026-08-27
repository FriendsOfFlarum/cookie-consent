import { jest, describe, it, expect, beforeEach } from '@jest/globals';

/**
 * The extension calls `CookieConsent.run()` at boot. Under native ESM
 * `jest.mock` cannot hoist, so the module is registered with
 * `unstable_mockModule` and everything is imported dynamically afterwards.
 */
const run = jest.fn(() => Promise.resolve());

jest.unstable_mockModule('vanilla-cookieconsent', () => ({
  run,
  __esModule: true,
}));

const ATTRIBUTES: Record<string, string> = {
  'fof-cookie-consent.learnMoreLinkUrl': 'https://example.com/privacy',
  'fof-cookie-consent.layout': 'box',
  'fof-cookie-consent.position': 'bottom right',
  'fof-cookie-consent.equalWeightButtons': '1',
};

/**
 * `resetModules()` re-creates core's `app` singleton, so the bootstrap helper
 * and the extension must both be imported *after* the reset — a module-level
 * import would otherwise hold a stale `app`.
 */
async function bootExtension(attributes: Record<string, string> = ATTRIBUTES) {
  const { default: bootstrapForum } = await import('@flarum/jest-config/src/bootstrap/forum');

  bootstrapForum({
    resources: [
      { type: 'forums', id: '1', attributes: { canEditUserCredentials: true, ...attributes } },
      {
        type: 'users',
        id: '1',
        attributes: { id: 1, username: 'admin', displayName: 'Admin', email: 'admin@machine.local' },
      },
    ],
  });

  // Import the extension before booting: `boot()` runs initializers and then
  // fires the `beforeMount` callbacks, so registering after it would be too late.
  await import('../../src/forum/index');

  app.boot();
}

describe('forum initializer', () => {
  beforeEach(() => {
    run.mockClear();
    jest.resetModules();
  });

  it('registers an initializer under the extension id', async () => {
    await bootExtension();

    expect(app.initializers.has('fof-cookie-consent')).toBe(true);
  });

  it('runs the consent banner with settings drawn from forum attributes', async () => {
    await bootExtension();

    expect(run).toHaveBeenCalledTimes(1);

    const config = run.mock.calls[0][0] as any;

    // Text comes from the locale file, not from settings.
    expect(config.language.translations.en.consentModal.acceptAllBtn).toBeTruthy();
    expect(config.language.translations.en.consentModal.acceptNecessaryBtn).toBeTruthy();
    expect(config.categories.necessary.readOnly).toBe(true);
  });

  it('still renders the banner when optional settings are missing', async () => {
    await bootExtension({});

    expect(run).toHaveBeenCalledTimes(1);
  });
});
