import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

/**
 * The library's stylesheet is imported by the forum entrypoint and injected by
 * webpack's style-loader, so it must end up inside the built bundle. Importing
 * it from node_modules keeps it in lockstep with the installed version — there
 * is no vendored copy to fall out of date.
 */
describe('bundled stylesheet', () => {
  // Jest runs from the `js` directory, so paths are resolved from there
  // (`__dirname` is unavailable under native ESM).
  const bundle = path.resolve(process.cwd(), 'dist/forum.js');

  it('carries the cookieconsent styles', () => {
    const contents = fs.readFileSync(bundle, 'utf8');

    expect(contents).toContain('#cc-main');
    expect(contents).toContain('--cc-bg');
  });

  it('matches the installed library version', () => {
    const installed = fs.readFileSync(path.resolve(process.cwd(), 'node_modules/vanilla-cookieconsent/dist/cookieconsent.css'), 'utf8');
    const contents = fs.readFileSync(bundle, 'utf8');

    // A selector introduced by the installed stylesheet must be present in the
    // bundle; if the library is upgraded without rebuilding, this fails.
    const marker = installed.match(/\.cc--[a-z0-9-]+/)?.[0];

    expect(marker).toBeTruthy();
    expect(contents).toContain(marker!.slice(1));
  });
});
