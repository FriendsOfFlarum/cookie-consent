import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';

const LAYOUTS = ['box', 'box wide', 'box inline', 'cloud', 'cloud inline', 'bar', 'bar inline'];

const POSITIONS = [
  'top left',
  'top center',
  'top right',
  'middle left',
  'middle center',
  'middle right',
  'bottom left',
  'bottom center',
  'bottom right',
];

/** Build a `{value: label}` map, labelling each option from the locale file. */
function options(values: string[], prefix: string): Record<string, string> {
  return values.reduce((map: Record<string, string>, value) => {
    map[value] = app.translator.trans(`fof-cookie-consent.admin.settings.${prefix}.${value.replace(/ /g, '_')}`) as string;

    return map;
  }, {});
}

export default [
  new Extend.Admin()
    .customSetting(() => <h2>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_title')}</h2>, 110)
    .customSetting(
      () => (
        <div className="Form-group">
          <div className="helpText">{app.translator.trans('fof-cookie-consent.admin.settings.text_help')}</div>
        </div>
      ),
      105
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.configuration_button_title')}</h3>, 80)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.learnMoreLinkUrl',
        label: app.translator.trans('fof-cookie-consent.admin.settings.learnMoreLinkUrl'),
        type: 'text',
      }),
      71
    )
    .customSetting(() => <h2>{app.translator.trans('fof-cookie-consent.admin.settings.appearance_title')}</h2>, 60)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.layout',
        label: app.translator.trans('fof-cookie-consent.admin.settings.layout'),
        help: app.translator.trans('fof-cookie-consent.admin.settings.layout_help'),
        type: 'select',
        options: options(LAYOUTS, 'layouts'),
        default: 'box',
      }),
      50
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.position',
        label: app.translator.trans('fof-cookie-consent.admin.settings.position'),
        type: 'select',
        options: options(POSITIONS, 'positions'),
        default: 'bottom right',
      }),
      40
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.equalWeightButtons',
        label: app.translator.trans('fof-cookie-consent.admin.settings.equalWeightButtons'),
        help: app.translator.trans('fof-cookie-consent.admin.settings.equalWeightButtons_help'),
        type: 'boolean',
      }),
      30
    )
    .customSetting(() => <h2>{app.translator.trans('fof-cookie-consent.admin.settings.catchall_title')}</h2>, 28)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.sweepUndeclared',
        label: app.translator.trans('fof-cookie-consent.admin.settings.sweepUndeclared'),
        help: app.translator.trans('fof-cookie-consent.admin.settings.sweepUndeclared_help'),
        type: 'boolean',
      }),
      27
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.allowedCookies',
        label: app.translator.trans('fof-cookie-consent.admin.settings.allowedCookies'),
        help: app.translator.trans('fof-cookie-consent.admin.settings.allowedCookies_help'),
        type: 'textarea',
      }),
      26
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_popup_title')}</h3>, 25)
    .customSetting(
      () => (
        <div className="Form-group">
          <div className="helpText">{app.translator.trans('fof-cookie-consent.admin.settings.colors_help')}</div>
        </div>
      ),
      24.5
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.backgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.backgroundColor'),
        type: 'color-preview',
      }),
      24
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.textColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.textColor'),
        type: 'color-preview',
      }),
      23
    )
    .customSetting(() => <h3>{app.translator.trans('fof-cookie-consent.admin.settings.theme_dismiss_title')}</h3>, 20)
    .setting(
      () => ({
        setting: 'fof-cookie-consent.buttonBackgroundColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonBackgroundColor'),
        type: 'color-preview',
      }),
      14
    )
    .setting(
      () => ({
        setting: 'fof-cookie-consent.buttonTextColor',
        label: app.translator.trans('fof-cookie-consent.admin.settings.buttonTextColor'),
        type: 'color-preview',
      }),
      13
    ),
];
