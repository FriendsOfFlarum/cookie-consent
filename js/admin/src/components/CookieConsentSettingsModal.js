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
        <label>{app.translator.trans('cookie-consent.admin.settings.text')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.ctext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.policylink')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.plink')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.buttontext')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.btext')}></input>
      </div>
    ];
}}