import app from 'flarum/forum/app';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import buildConfig, { SerializedCategory } from './buildConfig';
import sweepUndeclared from './sweepUndeclared';
import { candidatePaths } from './undeclaredCookies';
import syncThemeMode from './syncThemeMode';

/** Split a textarea setting into a list, ignoring blank lines. */
function lines(value: string | undefined): string[] {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

app.initializers.add('fof-cookie-consent', () => {
  app.beforeMount(() => {
    const setting = (key: string) => app.forum.attribute<string>(`fof-cookie-consent.${key}`);
    const categories: Record<string, SerializedCategory> = app.forum.attribute('fof-cookie-consent.categories');

    syncThemeMode();

    // Catch-all: extensions that never adopted the consent extender set
    // cookies the category system cannot see. When enabled, those are erased
    // once the visitor has answered.
    const sweep = setting('sweepUndeclared')
      ? () =>
          sweepUndeclared({
            jar: document.cookie,
            declared: Object.values(categories).flatMap((category) => category.declaredCookies ?? []),
            allowed: lines(setting('allowedCookies')),
            // A cookie set without an explicit `Path` is scoped to the request
            // URI's directory, which document.cookie does not reveal — so the
            // delete is attempted across the whole path hierarchy.
            paths: candidatePaths(window.location.pathname),
            erase: (name, path) => CookieConsent.eraseCookies(name, path),
          })
      : undefined;

    CookieConsent.run(
      buildConfig(
        setting,
        // Visitor-facing text lives in the locale file so it can be translated;
        // admins override it with fof/linguist or a language pack.
        (key: string) => app.translator.trans(key, {}, true) as string,
        categories,
        sweep
      )
    );
  });
});
