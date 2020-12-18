import app from 'flarum/app';
import CookieConsentSettingsModal from './components/CookieConsentSettingsModal';

app.initializers.add('fof-cookie-consent', () => {
    app.extensionSettings['fof-cookie-consent'] = () => app.modal.show(CookieConsentSettingsModal);
});
