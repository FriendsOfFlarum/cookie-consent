import SettingsModal from 'flarum/components/SettingsModal';

export default class CookieConsentSettingsModal extends SettingsModal {
    className() {
        return 'CookieConsentSettingsModal Modal--medium';
    }

    title() {
        return app.translator.trans('cookie-consent.admin.settings.title');
    }

    form() {
        return [
            <div className="Form-group">
                <h2>Configuration Options</h2>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.consentText')}
                </label>
                <textarea required className="FormControl" bidi={this.setting('cookie-consent.consentText')}/>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.buttonText')}
                </label>
                <input type="text" required className="FormControl" bidi={this.setting('cookie-consent.buttonText')}/>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.learnMoreLinkUrl')}
                </label>
                <input type="text" className="FormControl"
                       bidi={this.setting('cookie-consent.learnMoreLinkUrl')}/>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.learnMoreLinkText')}
                </label>
                <input type="text" required className="FormControl"
                       bidi={this.setting('cookie-consent.learnMoreLinkText')}/>
                <hr/>
                <h2>Theme Options</h2>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.ccTheme')}
                </label>
                <input type="text" required className="FormControl"
                       placeholder={app.translator.trans('cookie-consent.admin.settings.ccThemePlaceholderText')}
                       defaultValue="classic"
                       bidi={this.setting('cookie-consent.ccTheme')}/>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.backgroundColor')}
                </label>
                <input type="text" required className="FormControl"
                       defaultValue="#000000"
                       bidi={this.setting('cookie-consent.backgroundColor')}/>
                <label>
                    {app.translator.trans('cookie-consent.admin.settings.buttonBackgroundColor')}
                </label>
                <input type="text" required className="FormControl"
                       defaultValue="#FF0000"
                       bidi={this.setting('cookie-consent.buttonBackgroundColor')}/>
            </div>
        ];
    }
}
