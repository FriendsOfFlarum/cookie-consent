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
<<<<<<< HEAD
        <label>{app.translator.trans('cookie-consent.admin.settings.ctext')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.ctext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.btext')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.btext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.blink')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.blink')}></input>
=======
        <label>{app.translator.trans('cookie-consent.admin.settings.text')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.ctext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.policylink')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.plink')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.buttontext')}</label>
        <input type="textarea" required className="FormControl" bidi={this.setting('cookie-consent.btext')}></input>
>>>>>>> 5129b2a76f78293dcfa9e5d6182815da7ee17fe5
      </div>
    ];
}}