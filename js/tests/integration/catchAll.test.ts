import { describe, it, expect, beforeEach } from '@jest/globals';
import { createRequire } from 'module';
import buildConfig from '../../src/forum/buildConfig';
import sweepUndeclared from '../../src/forum/sweepUndeclared';
import { candidatePaths } from '../../src/forum/undeclaredCookies';

const CC = createRequire(import.meta.url)('vanilla-cookieconsent') as typeof import('vanilla-cookieconsent');

/**
 * Exercises the catch-all against the real library: an undeclared cookie is
 * actually erased from the browser, and a spared one is not.
 */
const get = (key: string) => (({ layout: 'box', position: 'bottom right' }) as Record<string, string>)[key];

const trans = (key: string) => key;

const categories = {
  necessary: {
    enabled: true,
    readOnly: true,
    declaredCookies: ['flarum_session', 'locale', 'cc_cookie'],
  },
};

describe('catch-all sweep', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = `${c.trim().split('=')[0]}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    document.querySelector('#cc-main')?.remove();
    (window as any)._ccRun = false;
  });

  const sweep = (allowed: string[] = []) =>
    sweepUndeclared({
      jar: document.cookie,
      declared: Object.values(categories).flatMap((c) => c.declaredCookies ?? []),
      allowed,
      paths: candidatePaths(window.location.pathname),
      erase: (name, path) => CC.eraseCookies(name, path),
    });

  it('erases an undeclared tracker but keeps declared cookies', async () => {
    document.cookie = 'locale=en;path=/';
    document.cookie = '_fbp=fb.1.999;path=/';

    await CC.run(buildConfig(get, trans, categories as any));
    sweep();

    expect(document.cookie).not.toContain('_fbp');
    expect(document.cookie).toContain('locale=en');
  });

  it('spares a cookie on the admin allow list', async () => {
    document.cookie = 'app_theme=dark;path=/';

    await CC.run(buildConfig(get, trans, categories as any));
    sweep(['app_theme']);

    expect(document.cookie).toContain('app_theme=dark');
  });

  it('erases a cookie scoped to a sub-path, not just the root', async () => {
    // Clockwork omits `Path`, so the browser scopes the cookie to the request
    // URI's directory. Erasing only at `/` would silently miss it.
    // jsdom only accepts a cookie whose path matches the document URL.
    history.replaceState({}, '', '/api/audit');

    document.cookie = 'x-clockwork=abc;path=/api/audit';
    expect(document.cookie).toContain('x-clockwork');

    await CC.run(buildConfig(get, trans, categories as any));
    sweep();

    expect(document.cookie).not.toContain('x-clockwork');
  });

  it('never erases the consent record itself', async () => {
    await CC.run(buildConfig(get, trans, categories as any));
    CC.acceptCategory([]);

    sweep();

    // Without this the banner would forget the answer and reappear.
    expect(document.cookie).toContain('cc_cookie');
  });
});
