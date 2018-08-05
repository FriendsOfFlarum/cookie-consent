import app from 'flarum/app';
import CookieConsentSettingsModal from './components/CookieConsentSettingsModal';

app.initializers.add('zaptech-cookie-consent', () => {
  app.extensionSettings['zaptech-cookie-consent'] = () => app.modal.show(new CookieConsentSettingsModal());
  });