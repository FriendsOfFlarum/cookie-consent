'use strict';

System.register('zaptech/cookie-consent/components/CookieConsentSettingsModal', ['flarum/components/SettingsModal'], function (_export, _context) {
  "use strict";

  var SettingsModal, CookieConsentSettingsModal;
  return {
    setters: [function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }],
    execute: function () {
      CookieConsentSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(CookieConsentSettingsModal, _SettingsModal);

        function CookieConsentSettingsModal() {
          babelHelpers.classCallCheck(this, CookieConsentSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (CookieConsentSettingsModal.__proto__ || Object.getPrototypeOf(CookieConsentSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(CookieConsentSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'CookieConsentSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('cookie-consent.admin.settings.title');
          }
        }, {
          key: 'form',
          value: function form() {
            var _m, _m2, _m3, _m4, _m5, _m6, _m7;

            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.ctext')
              ),
              m('input', (_m = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m, 'type', 'text'), babelHelpers.defineProperty(_m, 'bidi', this.setting('cookie-consent.ctext')), _m)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.btext')
              ),
              m('input', (_m2 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m2, 'type', 'text'), babelHelpers.defineProperty(_m2, 'bidi', this.setting('cookie-consent.btext')), _m2)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.blink')
              ),
              m('input', (_m3 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m3, 'type', 'text'), babelHelpers.defineProperty(_m3, 'bidi', this.setting('cookie-consent.blink')), _m3)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.atext')
              ),
              m('input', (_m4 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m4, 'type', 'text'), babelHelpers.defineProperty(_m4, 'bidi', this.setting('cookie-consent.atext')), _m4)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.bcolor')
              ),
              m('input', (_m5 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m5, 'type', 'text'), babelHelpers.defineProperty(_m5, 'bidi', this.setting('cookie-consent.bcolor')), _m5)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.bcolor1')
              ),
              m('input', (_m6 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m6, 'type', 'text'), babelHelpers.defineProperty(_m6, 'bidi', this.setting('cookie-consent.bcolor1')), _m6)),
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.bcolor2')
              ),
              m('input', (_m7 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m7, 'type', 'text'), babelHelpers.defineProperty(_m7, 'bidi', this.setting('cookie-consent.bcolor2')), _m7))
            )];
          }
        }]);
        return CookieConsentSettingsModal;
      }(SettingsModal);

      _export('default', CookieConsentSettingsModal);
    }
  };
});;
'use strict';

System.register('zaptech/cookie-consent/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid', 'zaptech/cookie-consent/components/CookieConsentSettingsModal', 'flarum/components/Page'], function (_export, _context) {
  "use strict";

  var app, extend, PermissionGrid, CookieConsentSettingsModal, Page;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }, function (_zaptechCookieConsentComponentsCookieConsentSettingsModal) {
      CookieConsentSettingsModal = _zaptechCookieConsentComponentsCookieConsentSettingsModal.default;
    }, function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }],
    execute: function () {

      app.initializers.add('zaptech-cookie-consent', function () {
        app.extensionSettings['zaptech-cookie-consent'] = function () {
          return app.modal.show(new CookieConsentSettingsModal());
        };
        extend(Page.prototype, 'init', function () {});
      });
    }
  };
});