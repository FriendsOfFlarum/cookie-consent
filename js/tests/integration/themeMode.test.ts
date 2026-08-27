import { jest, describe, it, expect, beforeEach } from '@jest/globals';

/**
 * The library ships a complete dark theme behind a `cc--darkmode` class. Flarum
 * resolves its own light/dark choice onto `data-theme` on <html>, so the two
 * are wired together rather than the palette being reimplemented by hand.
 */
const run = jest.fn(() => Promise.resolve());

jest.unstable_mockModule('vanilla-cookieconsent', () => ({ run, __esModule: true }));

async function bootWithTheme(theme: string | null) {
  const { default: bootstrapForum } = await import('@flarum/jest-config/src/bootstrap/forum');

  if (theme === null) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  bootstrapForum({
    resources: [
      { type: 'forums', id: '1', attributes: { canEditUserCredentials: true } },
      {
        type: 'users',
        id: '1',
        attributes: { id: 1, username: 'admin', displayName: 'Admin', email: 'a@b.c' },
      },
    ],
  });

  await import('../../src/forum/index');

  app.boot();
}

describe('theme mode', () => {
  beforeEach(() => {
    run.mockClear();
    jest.resetModules();
    document.documentElement.className = '';
  });

  it('applies the library dark theme when Flarum is dark', async () => {
    await bootWithTheme('dark');

    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(true);
  });

  it('applies it for high-contrast dark too', async () => {
    await bootWithTheme('dark-hc');

    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(true);
  });

  it('leaves the light theme alone', async () => {
    await bootWithTheme('light');

    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(false);
  });

  it('follows the system preference when no theme is set', async () => {
    // jsdom reports no match for prefers-color-scheme, i.e. light.
    await bootWithTheme(null);

    expect(document.documentElement.classList.contains('cc--darkmode')).toBe(false);
  });
});
