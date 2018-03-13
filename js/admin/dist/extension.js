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
            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('cookie-consent.admin.settings.text')
              ),
              m('input', { required: true, className: 'FormControl', type: 'text', bidi: this.setting('cookie-consent.ctext') })
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
        extend(Page.prototype, 'init', function () {
          document.querySelector("head").innerHTML += '<style>#app{background:' + adminpagehex + '}</style>';
        });
      });
    }
  };
});