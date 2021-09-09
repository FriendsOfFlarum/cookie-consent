import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

export default class CookieConsentSettingsModal extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.setting = this.setting.bind(this);
    }

    content() {
        return [
            <div className="container">
                <div className="CookieConsentSettingsPage">
                    <div className="Form">
                        <div className="Form-group">
                            <h2>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_title')}</h2>
                            <div className="Form-group">
                                <label>{app.translator.trans('fof-cookie-consent.admin.settings.consentText')}</label>
                                <textarea required className="FormControl" bidi={this.setting('fof-cookie-consent.consentText')} />
                            </div>
                            {this.buildSettingComponent({
                                type: 'string',
                                setting: 'fof-cookie-consent.buttonText',
                                label: app.translator.trans('fof-cookie-consent.admin.settings.buttonText'),
                            })}
                            <h3>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_button_title')}</h3>
                            <div className="Form-section">
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.learnMoreLinkText',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkText'),
                                })}
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.learnMoreLinkUrl',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkUrl'),
                                })}
                            </div>

                            <h2>{app.translator.trans('fof-cookie-consent.admin.settings.theme_title')}</h2>

                            <div className="Form-group">
                                {this.buildSettingComponent({
                                    type: 'select',
                                    setting: 'fof-cookie-consent.ccTheme',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.ccTheme'),
                                    options: {
                                        blocky: app.translator.trans('fof-cookie-consent.admin.settings.themes.blocky'),
                                        edgeless: app.translator.trans('fof-cookie-consent.admin.settings.themes.edgeless'),
                                        classic: app.translator.trans('fof-cookie-consent.admin.settings.themes.classic'),
                                        custom: app.translator.trans('fof-cookie-consent.admin.settings.themes.custom'),
                                        no_css: app.translator.trans('fof-cookie-consent.admin.settings.themes.no_css'),
                                    },
                                    required: true,
                                })}
                            </div>

                            <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_popup_title')}</h3>

                            <div className="Form-section">
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.backgroundColor',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.backgroundColor'),
                                })}
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.textColor',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.textColor'),
                                })}
                            </div>

                            <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_dismiss_title')}</h3>
                            <div className="Form-section">
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.buttonBackgroundColor',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.buttonBackgroundColor'),
                                })}
                                {this.buildSettingComponent({
                                    type: 'string',
                                    setting: 'fof-cookie-consent.buttonTextColor',
                                    label: app.translator.trans('fof-cookie-consent.admin.settings.buttonTextColor'),
                                })}
                            </div>
                        </div>
                        {this.submitButton()}
                    </div>
                </div>
            </div>,
        ];
    }
}
