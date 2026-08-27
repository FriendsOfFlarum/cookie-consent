import { describe, it, expect, beforeEach } from '@jest/globals';
// The UMD bundle is a CommonJS object; `import *` does not interop cleanly
// under Jest's ESM, so require the namespace directly.
import { createRequire } from 'module';

const CC = createRequire(import.meta.url)('vanilla-cookieconsent') as typeof import('vanilla-cookieconsent');
import buildConfig from '../../src/forum/buildConfig';

/**
 * Exercises the real library: declining must keep the strictly necessary
 * cookies (the visitor stays signed in) while rejecting everything optional.
 */
const get = (key: string) => (({ layout: 'box', position: 'bottom right', equalWeightButtons: '1' }) as Record<string, string>)[key];

const trans = (key: string) => key;

const categories = {
  necessary: {
    enabled: true,
    readOnly: true,
    declaredCookies: ['flarum_session', 'flarum_remember', 'cc_cookie'],
  },
  analytics: {
    enabled: false,
    readOnly: false,
    autoClear: { cookies: [{ name: '_ga' }] },
    declaredCookies: ['_ga'],
  },
};

describe('declining keeps necessary cookies', () => {
  beforeEach(async () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = `${c.trim().split('=')[0]}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    document.querySelector('#cc-main')?.remove();
    (window as any)._ccRun = false;
  });

  it('accepts necessary and rejects optional when the visitor declines', async () => {
    await CC.run(buildConfig(get, trans, categories as any));

    // What the Decline button does: accept nothing beyond the read-only ones.
    CC.acceptCategory([]);

    expect(CC.acceptedCategory('necessary')).toBe(true);
    expect(CC.acceptedCategory('analytics')).toBe(false);

    const prefs = CC.getUserPreferences();
    expect(prefs.acceptedCategories).toContain('necessary');
    expect(prefs.rejectedCategories).toContain('analytics');
    expect(prefs.acceptType).toBe('necessary');
  });

  it('does not erase the session cookie on decline', async () => {
    document.cookie = 'flarum_session=abc123;path=/';
    document.cookie = '_ga=GA1.2.999;path=/';

    await CC.run(buildConfig(get, trans, categories as any));
    CC.acceptCategory([]);

    // The visitor stays signed in...
    expect(document.cookie).toContain('flarum_session=abc123');
    // ...while the analytics cookie it declared is cleared.
    expect(document.cookie).not.toContain('_ga=GA1.2.999');
  });
});
