import app from 'flarum/app';
import { extend } from 'flarum/extend';
import CookieConsentSettingsModal from 'zaptech/cookie-consent/components/CookieConsentSettingsModal';
import Page from 'flarum/components/Page';

app.initializers.add('zaptech-cookie-consent', () => {
  app.extensionSettings['zaptech-cookie-consent'] = () => app.modal.show(new CookieConsentSettingsModal());
      extend(Page.prototype, 'init', function() {
        $('head').prepend('<div id="cookieconsent"></div>');
      });
  });