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
    sweepUndeclared({ jar: '_fbp=x', declared, allowed: [], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('leaves declared cookies alone', () => {
    sweepUndeclared({ jar: 'flarum_session=x; cc_cookie=y', declared, allowed: [], erase });

    expect(erased).toEqual([]);
  });

  it('never erases the consent cookie, even if declarations are empty', () => {
    // Erasing it would make the banner forget the visitor just answered.
    sweepUndeclared({ jar: 'cc_cookie=y', declared: [], allowed: [], erase });

    expect(erased).toEqual([]);
  });

  it('honours the admin allow-list for undeclared but necessary cookies', () => {
    sweepUndeclared({ jar: 'locale=en; _fbp=x', declared, allowed: ['locale'], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('supports patterns in the allow-list', () => {
    sweepUndeclared({ jar: 'app_theme=dark; _fbp=x', declared, allowed: ['/^app_/'], erase });

    expect(erased).toEqual(['_fbp']);
  });

  it('does nothing when there is nothing undeclared', () => {
    sweepUndeclared({ jar: 'flarum_session=x', declared, allowed: [], erase });

    expect(erased).toEqual([]);
  });
});
