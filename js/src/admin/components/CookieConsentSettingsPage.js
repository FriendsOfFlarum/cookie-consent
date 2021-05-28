import ExtensionPage from 'flarum/admin/components/ExtensionPage';

import { settings } from '@fof-components';

const {
    items: { StringItem, SelectItem },
} = settings;

export default class CookieConsentSettingsModal extends ExtensionPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.setting = this.setting.bind(this);
    }

    content() {
        return [
            <div className="container">
                <div className="CookieConsentSettingsPage">
                    <div className="Form-group">
                        <h2>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_title')}</h2>
                        <div className="Form-group">
                            <label>{app.translator.trans('fof-cookie-consent.admin.settings.consentText')}</label>
                            <textarea required className="FormControl" bidi={this.setting('fof-cookie-consent.consentText')} />
                        </div>
                        <StringItem name="fof-cookie-consent.buttonText" setting={this.setting.bind(this)}>
                            {app.translator.trans('fof-cookie-consent.admin.settings.buttonText')}
                        </StringItem>

                        <h3>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_button_title')}</h3>
                        <div className="Form-section">
                            <StringItem name="fof-cookie-consent.learnMoreLinkText" setting={this.setting.bind(this)} required>
                                {app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkText')}
                            </StringItem>
                            <StringItem name="fof-cookie-consent.learnMoreLinkUrl" setting={this.setting.bind(this)}>
                                {app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkUrl')}
                            </StringItem>
                        </div>

                        <h2>{app.translator.trans('fof-cookie-consent.admin.settings.theme_title')}</h2>

                        <div className="Form-group">
                            <label>{app.translator.trans('fof-cookie-consent.admin.settings.ccTheme')}</label>
                            {SelectItem.component({
                                options: {
                                    blocky: app.translator.trans('fof-cookie-consent.admin.settings.themes.blocky'),
                                    edgeless: app.translator.trans('fof-cookie-consent.admin.settings.themes.edgeless'),
                                    classic: app.translator.trans('fof-cookie-consent.admin.settings.themes.classic'),
                                    custom: app.translator.trans('fof-cookie-consent.admin.settings.themes.custom'),
                                    no_css: app.translator.trans('fof-cookie-consent.admin.settings.themes.no_css'),
                                },
                                value: this.setting('fof-cookie-consent.ccTheme')(),
                                onchange: this.setting('fof-cookie-consent.ccTheme'),
                                setting: this.setting.bind(this),
                                required: true,
                            })}
                        </div>

                        <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_popup_title')}</h3>

                        <div className="Form-section">
                            <StringItem name="fof-cookie-consent.backgroundColor" setting={this.setting.bind(this)}>
                                {app.translator.trans('fof-cookie-consent.admin.settings.backgroundColor')}
                            </StringItem>
                            <StringItem name="fof-cookie-consent.textColor" setting={this.setting.bind(this)}>
                                {app.translator.trans('fof-cookie-consent.admin.settings.textColor')}
                            </StringItem>
                        </div>

                        <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_dismiss_title')}</h3>
                        <div className="Form-section">
                            <StringItem name="fof-cookie-consent.buttonBackgroundColor" setting={this.setting.bind(this)}>
                                {app.translator.trans('fof-cookie-consent.admin.settings.buttonBackgroundColor')}
                            </StringItem>
                            <StringItem name="fof-cookie-consent.buttonTextColor" setting={this.setting.bind(this)}>
                                {app.translator.trans('fof-cookie-consent.admin.settings.buttonTextColor')}
                            </StringItem>
                        </div>
                    </div>
                    {this.submitButton()}
                </div>
            </div>,
        ];
    }
}
