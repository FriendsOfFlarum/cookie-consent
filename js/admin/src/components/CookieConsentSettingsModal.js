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
        <div className="MainForm">
          <label>{app.translator.trans('cookie-consent.admin.settings.ctext')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.ctext')}></input>
          <label>{app.translator.trans('cookie-consent.admin.settings.btext')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.btext')}></input>
          <label>{app.translator.trans('cookie-consent.admin.settings.blink')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.blink')}></input>
          <label>{app.translator.trans('cookie-consent.admin.settings.lrntext')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.lrntext')}></input>
          <label>{app.translator.trans('cookie-consent.admin.settings.bcolor')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.bcolor')}></input>
          <label>{app.translator.trans('cookie-consent.admin.settings.bcolor2')}</label>
          <input type="text" required className="FormControl" type="text" bidi={this.setting('cookie-consent.bcolor2')}></input>
        </div>
        <div className="ToggleSwitch">
          <label class="switch">
            <input type="checkbox" bidi={this.setting('cookie-consent.bcolor3')}></input>
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    ];
}}