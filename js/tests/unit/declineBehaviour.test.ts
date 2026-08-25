import { describe, it, expect } from '@jest/globals';
import buildConfig from '../../src/forum/buildConfig';

/**
 * The point of the Decline button: a declined category must both erase the
 * cookies it declared and hold its scripts inert. These assertions pin the
 * config that makes vanilla-cookieconsent do that.
 */
const settings: Record<string, string> = {
  'fof-cookie-consent.consentText': 'We use cookies.',
  'fof-cookie-consent.buttonText': 'Accept',
  'fof-cookie-consent.declineButtonText': 'Decline',
  'fof-cookie-consent.layout': 'box',
  'fof-cookie-consent.position': 'bottom right',
  'fof-cookie-consent.equalWeightButtons': '1',
};

const get = (key: string) => settings[`fof-cookie-consent.${key}`];

const withAnalytics = {
  necessary: { enabled: true, readOnly: true },
  analytics: {
    enabled: false,
    readOnly: false,
    autoClear: { cookies: [{ name: '_gid' }, { name: '/^_ga/' }] },
  },
};

describe('declining', () => {
  it('leaves an optional category disabled until it is accepted', () => {
    const { categories } = buildConfig(get, withAnalytics);

    expect(categories.analytics.enabled).toBe(false);
    expect(categories.analytics.readOnly).toBe(false);
  });

  it('erases the declared cookies of a declined category', () => {
    const { categories } = buildConfig(get, withAnalytics);
    const cookies = categories.analytics.autoClear!.cookies;

    expect(cookies).toContainEqual({ name: '_gid' });
    expect(cookies.some((c: any) => c.name instanceof RegExp && c.name.test('_ga_XYZ'))).toBe(true);
  });

  it('never erases cookies in the necessary category', () => {
    const { categories } = buildConfig(get, withAnalytics);

    expect(categories.necessary.autoClear).toBeUndefined();
    expect(categories.necessary.readOnly).toBe(true);
  });

  it('leaves script tag management enabled so gated scripts stay inert', () => {
    const config = buildConfig(get, withAnalytics);

    // The library manages `data-category` script tags unless told otherwise;
    // switching it off would silently un-gate every declared script.
    expect(config.manageScriptTags).not.toBe(false);
  });

  it('does not auto-enable optional categories before consent', () => {
    const config = buildConfig(get, withAnalytics);

    // `opt-out` mode would run scripts before the visitor answers.
    expect(config.mode).not.toBe('opt-out');
  });
});
