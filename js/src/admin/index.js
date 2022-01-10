import app from 'flarum/admin/app';
import CookieConsentSettingsPage from './components/CookieConsentSettingsPage';

app.initializers.add('fof-cookie-consent', () => {
  app.extensionData.for('fof-cookie-consent').registerPage(CookieConsentSettingsPage);
});

export * from './components';
