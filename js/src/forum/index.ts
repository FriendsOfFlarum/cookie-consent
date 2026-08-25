import app from 'flarum/forum/app';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import buildConfig from './buildConfig';

app.initializers.add('fof-cookie-consent', () => {
  app.beforeMount(() => {
    CookieConsent.run(
      buildConfig((key: string) => app.forum.attribute<string>(`fof-cookie-consent.${key}`), app.forum.attribute('fof-cookie-consent.categories'))
    );
  });
});
