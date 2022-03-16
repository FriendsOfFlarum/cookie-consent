import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';

export default class CookieConsentSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.setting = this.setting.bind(this);
  }

  content() {
    return [
      <div className="container">
        <div className="CookieConsentSettingsPage">
          <div className="Form">{this.settingsItems().toArray()}</div>
        </div>
      </div>,
    ];
  }

  settingsItems() {
    const items = new ItemList();

    items.add('settings-fields', <div className="Form-group">{this.settingsFields().toArray()}</div>, 100);

    items.add('submit', this.submitButton(), 0);

    return items;
  }

  settingsFields() {
    const items = new ItemList();

    items.add('configuration_title', <h2>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_title')}</h2>, 110);

    items.add(
      'consentText',
      <div className="Form-group">
        <label>{app.translator.trans('fof-cookie-consent.admin.settings.consentText')}</label>
        <textarea required className="FormControl" bidi={this.setting('fof-cookie-consent.consentText')} />
      </div>,
      100
    );

    items.add(
      'buttonText',
      this.buildSettingComponent({
        type: 'string',
        setting: 'fof-cookie-consent.buttonText',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonText'),
      }),
      90
    );

    items.add('configuration_button_title', <h3>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_button_title')}</h3>, 80);

    items.add('learnMoreLink', <div className="Form-section">{this.learnMoreLinkItems().toArray()}</div>, 70);

    items.add('theme_title', <h2>{app.translator.trans('fof-cookie-consent.admin.settings.theme_title')}</h2>, 60);

    items.add(
      'ccTheme',
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
      </div>,
      50
    );

    items.add('theme_popup_title', <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_popup_title')}</h3>, 40);

    items.add('popUpColors', <div className="Form-section">{this.popUpColorsItems().toArray()}</div>, 30);
    items.add('theme_dismiss_title', <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_dismiss_title')}</h3>, 20);

    items.add('dismissColors', <div className="Form-section">{this.dismissColorsItems().toArray()}</div>, 10);

    return items;
  }

  learnMoreLinkItems() {
    const items = new ItemList();

    items.add(
      'text',
      this.buildSettingComponent({
        type: 'string',
        setting: 'fof-cookie-consent.learnMoreLinkText',
        label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkText'),
      }),
      20
    );

    items.add(
      'url',
      this.buildSettingComponent({
        type: 'string',
        setting: 'fof-cookie-consent.learnMoreLinkUrl',
        label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkUrl'),
      }),
      10
    );

    return items;
  }

  popUpColorsItems() {
    const items = new ItemList();

    items.add(
      'background',
      this.buildSettingComponent({
        type: 'color-preview',
        setting: 'fof-cookie-consent.backgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.backgroundColor'),
      }),
      20
    );
    items.add(
      'text',
      this.buildSettingComponent({
        type: 'color-preview',
        setting: 'fof-cookie-consent.textColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.textColor'),
      }),
      10
    );

    return items;
  }

  dismissColorsItems() {
    const items = new ItemList();

    items.add(
      'background',
      this.buildSettingComponent({
        type: 'color-preview',
        setting: 'fof-cookie-consent.buttonBackgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonBackgroundColor'),
      }),
      20
    );
    items.add(
      'text',
      this.buildSettingComponent({
        type: 'color-preview',
        setting: 'fof-cookie-consent.buttonTextColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonTextColor'),
      }),
      10
    );

    return items;
  }
}
