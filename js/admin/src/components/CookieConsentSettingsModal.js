import SettingsModal from 'flarum/components/SettingsModal';

export default class CookieConsentSettingsModal extends SettingsModal {
  className() {
    return 'CookieConsentSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('cookie-consent.admin.settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('cookie-consent.admin.settings.apphex')}</label>
        <input type="color" required className="FormControl" type="color" bidi={this.setting('cookie-consent.ctext')}></input>
      </div>
    ];
}}