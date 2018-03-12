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
            return [m('div', { className: 'Form-group' })];
          }
        }]);
        return CookieConsentSettingsModal;
      }(SettingsModal);

      _export('default', CookieConsentSettingsModal);
    }
  };
});