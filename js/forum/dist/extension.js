'use strict';

System.register('zaptech/cookie-consent/main', ['flarum/app', 'flarum/extend', 'flarum/components/Page'], function (_export, _context) {
    "use strict";

    var app, extend, Page;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }],
        execute: function () {

            app.initializers.add('zaptech-cookie-consent', function () {
                extend(Page.prototype, 'init', function () {
                    var ccTheme = app.forum.attribute("cookie-consent.ccTheme");
                    var backgroundColor = app.forum.attribute("cookie-consent.backgroundColor");
                    var consentText = app.forum.attribute("cookie-consent.consentText");
                    var buttonText = app.forum.attribute("cookie-consent.buttonText");
                    var buttonBackgroundColor = app.forum.attribute("cookie-consent.buttonBackgroundColor");
                    var learnMoreLinkText = app.forum.attribute("cookie-consent.learnMoreLinkText");
                    var learnMoreLinkUrl = app.forum.attribute("cookie-consent.learnMoreLinkUrl");

                    $('head').prepend('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/>' + '<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>' + '<script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "' + backgroundColor + '"}, "button":{"background": "' + buttonBackgroundColor + '"}}, "theme": "' + ccTheme + '", "content":{"message": "' + consentText + '", "dismiss": "' + buttonText + '", "link": "' + learnMoreLinkText + '", "href": "' + learnMoreLinkUrl + '"}})});</script>');
                });
            });
        }
    };
});