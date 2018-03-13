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
        <input required className="FormControl" type="text" bidi={this.setting('cookie-consent.text')}></input>
      </div>
    ];
}}