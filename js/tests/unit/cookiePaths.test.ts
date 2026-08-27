import { describe, it, expect } from '@jest/globals';
import { candidatePaths } from '../../src/forum/undeclaredCookies';

/**
 * A cookie can only be deleted at the exact path it was set on, and
 * `document.cookie` exposes names but never paths. Deletion is therefore
 * attempted across every path the current URL could have produced.
 */
describe('candidatePaths', () => {
  it('always includes the root', () => {
    expect(candidatePaths('/')).toEqual(['/']);
  });

  it('walks up each segment of the current path', () => {
    expect(candidatePaths('/api/discussions/47')).toEqual(['/', '/api', '/api/discussions', '/api/discussions/47']);
  });

  it('handles a trailing slash without producing an empty segment', () => {
    expect(candidatePaths('/api/audit/')).toEqual(['/', '/api', '/api/audit']);
  });

  it('ignores repeated slashes', () => {
    expect(candidatePaths('//api//audit')).toEqual(['/', '/api', '/api/audit']);
  });

  it('deduplicates', () => {
    expect(new Set(candidatePaths('/api')).size).toBe(candidatePaths('/api').length);
  });
});
