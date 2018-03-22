import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import CookieConsentSettingsModal from 'zaptech/cookie-consent/components/CookieConsentSettingsModal';
import Page from 'flarum/components/Page';

app.initializers.add('zaptech-cookie-consent', () => {
  app.extensionSettings['zaptech-cookie-consent'] = () => app.modal.show(new CookieConsentSettingsModal());
      extend(Page.prototype, 'init', function() {
        $('head').prepend('<div id="cookieconsent"></div>');        
        $('head').append('<style>.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider:before{position:absolute;content:"";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}input:checked+.slider{background-color:#2196F3}input:focus+.slider{box-shadow:0 0 1px #2196F3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}</style>');
        const toppadding = Number($('#cookieconsent').height()) + 52;
      });
  });