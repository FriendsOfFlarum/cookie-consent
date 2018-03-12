import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import CustomHeaderSettingsModal from 'zaptech/cookie-consent/components/CookieConsentSettingsModal';

app.initializers.add('zaptech-cookie-consent', () => {
  app.extensionSettings['zaptech-cookie-consent'] = () => app.modal.show(new CustomHeaderSettingsModal());

});
