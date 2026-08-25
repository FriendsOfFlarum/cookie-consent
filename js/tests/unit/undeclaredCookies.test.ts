import { describe, it, expect } from '@jest/globals';
import { findUndeclared } from '../../src/forum/undeclaredCookies';

/**
 * Cookies set by extensions that never adopted the consent extender are
 * invisible to the category system. They are found by diffing what the browser
 * actually holds against everything declared.
 */
describe('findUndeclared', () => {
  const declared = ['flarum_session', 'cc_cookie', '/^_ga/'];

  it('returns cookies nothing has declared', () => {
    expect(findUndeclared('flarum_session=a; _fbp=b; cc_cookie=c', declared)).toEqual(['_fbp']);
  });

  it('treats a slash-wrapped entry as a pattern', () => {
    expect(findUndeclared('_ga=1; _ga_ABC=2; _other=3', declared)).toEqual(['_other']);
  });

  it('returns nothing when everything is declared', () => {
    expect(findUndeclared('flarum_session=a; cc_cookie=b', declared)).toEqual([]);
  });

  it('handles an empty cookie jar', () => {
    expect(findUndeclared('', declared)).toEqual([]);
  });

  it('ignores whitespace around names', () => {
    expect(findUndeclared('  _fbp = b ;  cc_cookie=c', declared)).toEqual(['_fbp']);
  });

  it('does not treat a value containing = as part of the name', () => {
    expect(findUndeclared('_fbp=a=b=c', declared)).toEqual(['_fbp']);
  });

  it('deduplicates repeated names', () => {
    expect(findUndeclared('_fbp=a; _fbp=b', declared)).toEqual(['_fbp']);
  });

  it('ignores a malformed pattern rather than throwing', () => {
    expect(findUndeclared('_fbp=a', ['/[unclosed/'])).toEqual(['_fbp']);
  });
});
