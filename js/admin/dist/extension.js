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
                        return 'CookieConsentSettingsModal Modal--medium';
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
                                'h2',
                                null,
                                'Configuration Options'
                            ),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.consentText')
                            ),
                            m('textarea', { required: true, className: 'FormControl', bidi: this.setting('cookie-consent.consentText') }),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.buttonText')
                            ),
                            m('input', { type: 'text', required: true, className: 'FormControl', bidi: this.setting('cookie-consent.buttonText') }),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.learnMoreLinkUrl')
                            ),
                            m('input', { type: 'text', className: 'FormControl',
                                bidi: this.setting('cookie-consent.learnMoreLinkUrl') }),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.learnMoreLinkText')
                            ),
                            m('input', { type: 'text', required: true, className: 'FormControl',
                                bidi: this.setting('cookie-consent.learnMoreLinkText') }),
                            m('hr', null),
                            m(
                                'h2',
                                null,
                                'Theme Options'
                            ),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.ccTheme')
                            ),
                            m('input', { type: 'text', required: true, className: 'FormControl',
                                placeholder: app.translator.trans('cookie-consent.admin.settings.ccThemePlaceholderText'),
                                defaultValue: 'classic',
                                bidi: this.setting('cookie-consent.ccTheme') }),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.backgroundColor')
                            ),
                            m('input', { type: 'text', required: true, className: 'FormControl',
                                defaultValue: '#000000',
                                bidi: this.setting('cookie-consent.backgroundColor') }),
                            m(
                                'label',
                                null,
                                app.translator.trans('cookie-consent.admin.settings.buttonBackgroundColor')
                            ),
                            m('input', { type: 'text', required: true, className: 'FormControl',
                                defaultValue: '#FF0000',
                                bidi: this.setting('cookie-consent.buttonBackgroundColor') })
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

System.register('zaptech/cookie-consent/main', ['flarum/app', 'flarum/extend', 'zaptech/cookie-consent/components/CookieConsentSettingsModal', 'flarum/components/Page'], function (_export, _context) {
  "use strict";

  var app, extend, CookieConsentSettingsModal, Page;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
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
        });
      });
    }
  };
});