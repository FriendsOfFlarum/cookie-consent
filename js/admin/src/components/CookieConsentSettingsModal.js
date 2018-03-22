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
        <label>{app.translator.trans('cookie-consent.admin.settings.ctext')}</label>
        <input type="color" required className="FormControl" type="color" bidi={this.setting('cookie-consent.ctext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.btext')}</label>
        <input type="color" required className="FormControl" type="color" bidi={this.setting('cookie-consent.btext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.blink')}</label>
        <input type="color" required className="FormControl" type="color" bidi={this.setting('cookie-consent.blink')}></input>
      </div>
    ];
}}