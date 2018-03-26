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
            var _m, _m2, _m3, _m4, _m5, _m6;

            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'div',
                { className: 'MainForm' },
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
                  app.translator.trans('cookie-consent.admin.settings.lrntext')
                ),
                m('input', (_m4 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m4, 'type', 'text'), babelHelpers.defineProperty(_m4, 'bidi', this.setting('cookie-consent.lrntext')), _m4)),
                m(
                  'label',
                  null,
                  app.translator.trans('cookie-consent.admin.settings.bcolor')
                ),
                m('input', (_m5 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m5, 'type', 'text'), babelHelpers.defineProperty(_m5, 'bidi', this.setting('cookie-consent.bcolor')), _m5)),
                m(
                  'label',
                  null,
                  app.translator.trans('cookie-consent.admin.settings.bcolor2')
                ),
                m('input', (_m6 = { type: 'text', required: true, className: 'FormControl' }, babelHelpers.defineProperty(_m6, 'type', 'text'), babelHelpers.defineProperty(_m6, 'bidi', this.setting('cookie-consent.bcolor2')), _m6))
              ),
              m(
                'div',
                { className: 'ToggleSwitch' },
                m(
                  'label',
                  { 'class': 'switch' },
                  m('input', { type: 'checkbox', bidi: this.setting('cookie-consent.bcolor3') }),
                  m('span', { 'class': 'slider round' })
                )
              )
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
          $('head').prepend('<div id="cookieconsent"></div>');
          $('head').append('<style>.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider:before{position:absolute;content:"";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}input:checked+.slider{background-color:#2196F3}input:focus+.slider{box-shadow:0 0 1px #2196F3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}</style>');
          var toppadding = Number($('#cookieconsent').height()) + 52;
          console.log(app.forum.attribute("cookie-consent.bcolor3"));
        });
      });
    }
  };
});