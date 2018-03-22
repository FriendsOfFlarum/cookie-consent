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
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.ctext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.btext')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.btext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.blink')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.blink')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.atext')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.atext')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.bcolor')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.bcolor')}></input>
        <label>{app.translator.trans('cookie-consent.admin.settings.bcolor1')}</label>
        <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.bcolor1')}></input>
        <input type="hidden" required className="FormControl" type="hidden" bidi={this.setting('cookie-consent.bcolor2')}></input>
        <label class="switch">
        <input type="checkbox" checked></input>
        <span class="slider round"></span>
        </label>
      </div>
    ];
}}