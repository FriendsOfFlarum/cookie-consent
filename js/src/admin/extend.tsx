import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';

export default [
  new Extend.Admin()
    .customSetting(() => <h2>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_title')}</h2>, 110)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.consentText',
        label: app.translator.trans('fof-cookie-consent.admin.settings.consentText'),
        type: 'textarea',
        required: true,
      }),
      100
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.buttonText',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonText'),
        type: 'text',
      }),
      90
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_button_title')}</h3>, 80)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.learnMoreLinkText',
        label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkText'),
        type: 'text',
      }),
      72
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.learnMoreLinkUrl',
        label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkUrl'),
        type: 'text',
      }),
      71
    )
    .customSetting(() => <h2>{app.translator.trans('fof-cookie-consent.admin.settings.theme_title')}</h2>, 60)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.ccTheme',
        label: app.translator.trans('fof-cookie-consent.admin.settings.ccTheme'),
        type: 'select',
        options: {
          blocky: app.translator.trans('fof-cookie-consent.admin.settings.themes.blocky'),
          edgeless: app.translator.trans('fof-cookie-consent.admin.settings.themes.edgeless'),
          classic: app.translator.trans('fof-cookie-consent.admin.settings.themes.classic'),
          custom: app.translator.trans('fof-cookie-consent.admin.settings.themes.custom'),
          no_css: app.translator.trans('fof-cookie-consent.admin.settings.themes.no_css'),
        },
        required: true,
      }),
      50
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_popup_title')}</h3>, 40)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.backgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.backgroundColor'),
        type: 'color-preview',
      }),
      32
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.textColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.textColor'),
        type: 'color-preview',
      }),
      31
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_dismiss_title')}</h3>, 20)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.buttonBackgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonBackgroundColor'),
        type: 'color-preview',
      }),
      12
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.buttonTextColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonTextColor'),
        type: 'color-preview',
      }),
      11
    ),
];
