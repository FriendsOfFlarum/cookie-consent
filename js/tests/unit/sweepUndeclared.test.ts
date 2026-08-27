import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import sweepUndeclared from '../../src/forum/sweepUndeclared';

/**
 * With the catch-all enabled, declining erases cookies that no extension
 * declared. This is deliberately aggressive: an extension that has not adopted
 * the extender loses its cookies. The allow-list is the escape hatch for a
 * cookie that is genuinely necessary but undeclared.
 */
describe('sweepUndeclared', () => {
  let erased: string[];
  const erase = (name: string) => {
    erased.push(name);
  };

  beforeEach(() => {
    erased = [];
  });

  const declared = ['flarum_session', 'cc_cookie'];

  it('erases a cookie nothing declared', () => {
    sweepUndeclared({ jar: '_fbp=x', declared, allowed: [], paths: ['/'], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('leaves declared cookies alone', () => {
    sweepUndeclared({ jar: 'flarum_session=x; cc_cookie=y', declared, allowed: [], paths: ['/'], erase });

    expect(erased).toEqual([]);
  });

  it('never erases the consent cookie, even if declarations are empty', () => {
    // Erasing it would make the banner forget the visitor just answered.
    sweepUndeclared({ jar: 'cc_cookie=y', declared: [], allowed: [], paths: ['/'], erase });

    expect(erased).toEqual([]);
  });

  it('honours the admin allow-list for undeclared but necessary cookies', () => {
    sweepUndeclared({ jar: 'locale=en; _fbp=x', declared, allowed: ['locale'], paths: ['/'], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('supports patterns in the allow-list', () => {
    sweepUndeclared({ jar: 'app_theme=dark; _fbp=x', declared, allowed: ['/^app_/'], paths: ['/'], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('attempts each candidate path, since document.cookie hides the real one', () => {
    // Clockwork and similar omit `Path`, so the browser scopes the cookie to
    // the request URI's directory. Erasing only at `/` silently misses those.
    const attempts: Array<[string, string]> = [];

    sweepUndeclared({
      jar: 'x-clockwork=abc',
      declared,
      allowed: [],
      paths: ['/', '/api', '/api/audit'],
      erase: (name, path) => attempts.push([name, path]),
    });

    expect(attempts).toEqual([
      ['x-clockwork', '/'],
      ['x-clockwork', '/api'],
      ['x-clockwork', '/api/audit'],
    ]);
  });

  it('does nothing when there is nothing undeclared', () => {
    sweepUndeclared({ jar: 'flarum_session=x', declared, allowed: [], paths: ['/'], erase });

    expect(erased).toEqual([]);
  });
});
