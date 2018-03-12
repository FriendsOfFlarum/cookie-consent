import SettingsModal from 'flarum/components/SettingsModal';

export default class CookieConsentSettingsModal extends SettingsModal {
  className() {
    return 'CookieConsentSettingsModal Modal--small';
  }

  title() {
    "Cookie Consent Plugin";
  }

  form() {
    return [
      <div className="Form-group">
        
      </div>
    ];
}}