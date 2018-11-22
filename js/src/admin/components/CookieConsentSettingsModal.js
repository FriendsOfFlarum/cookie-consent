import SettingsModal from 'flarum/components/SettingsModal';
import Select from 'flarum/components/Select';

const themes = ['blocky', 'edgeless', 'classic'];

export default class CookieConsentSettingsModal extends SettingsModal {
    className() {
        return 'CookieConsentSettingsModal Modal--medium';
    }

    title() {
        return app.translator.trans('reflar-cookie-consent.admin.settings.title');
    }

    form() {
        return [
            <div className="Form-group">
                <h2>Configuration Options</h2>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.consentText')}</label>
                    <textarea required className="FormControl" bidi={this.setting('reflar-cookie-consent.consentText')} />
                </div>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.buttonText')}</label>
                    <input type="text" required className="FormControl" bidi={this.setting('reflar-cookie-consent.buttonText')} />
                </div>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.learnMoreLinkUrl')}</label>
                    <input type="text" className="FormControl" bidi={this.setting('reflar-cookie-consent.learnMoreLinkUrl')} />
                </div>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.learnMoreLinkText')}</label>
                    <input type="text" required className="FormControl" bidi={this.setting('reflar-cookie-consent.learnMoreLinkText')} />
                </div>
                <hr />
                <h2>Theme Options</h2>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.ccTheme')}</label>
                    {Select.component({
                        options: {
                            blocky: app.translator.trans('reflar-cookie-consent.admin.settings.themes.blocky'),
                            edgeless: app.translator.trans('reflar-cookie-consent.admin.settings.themes.edgeless'),
                            classic: app.translator.trans('reflar-cookie-consent.admin.settings.themes.classic'),
                            custom: app.translator.trans('reflar-cookie-consent.admin.settings.themes.custom'),
                        },
                        value: this.setting('reflar-cookie-consent.ccTheme')(),
                        onchange: this.setting('reflar-cookie-consent.ccTheme'),
                    })}
                </div>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.backgroundColor')}</label>
                    <input type="text" className="FormControl" bidi={this.setting('reflar-cookie-consent.backgroundColor')} />
                </div>
                <div className="Form-group">
                    <label>{app.translator.trans('reflar-cookie-consent.admin.settings.buttonBackgroundColor')}</label>
                    <input type="text" className="FormControl" bidi={this.setting('reflar-cookie-consent.buttonBackgroundColor')} />
                </div>
            </div>,
        ];
    }
}
