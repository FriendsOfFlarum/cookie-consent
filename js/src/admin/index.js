import app from 'flarum/app';
import CookieConsentSettingsPage from './components/CookieConsentSettingsPage';

app.initializers.add('fof-cookie-consent', () => {
    app.extensionData.for('fof-cookie-consent').registerPage(CookieConsentSettingsPage);
});
