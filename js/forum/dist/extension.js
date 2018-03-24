'use strict';

System.register('zaptech/cookie-consent/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid', 'flarum/components/Page'], function (_export, _context) {
    "use strict";

    var app, extend, PermissionGrid, Page;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }],
        execute: function () {

            app.initializers.add('zaptech-cookie-consent', function () {
                extend(Page.prototype, 'init', function () {
                    var ctext, btext, blink, lmtext, bcolor, bcolor1, bcolor2;
                    ctext = app.forum.attribute("cookie-consent.ctext");
                    btext = app.forum.attribute("cookie-consent.btext");
                    blink = app.forum.attribute("cookie-consent.blink");
                    lmtext = app.forum.attribute("cookie-consent.lmtext");
                    bcolor = app.forum.attribute("cookie-consent.bcolor");
                    bcolor1 = app.forum.attribute("cookie-consent.bcolor1");
                    bcolor2 = app.forum.attribute("cookie-consent.bcolor2");
                    $('head').prepend('<div id="cookieconsent"></div>');
                    $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/><script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script><script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "' + bcolor + '", "text": "#000000"}, "button":{"background": "' + bcolor2 + '", "text": "#000000"}}, "theme": "classic", "content":{"message": "' + ctext + '", "dismiss": "' + lmtext + '", "link": "' + btext + '", "href": "' + blink + '"}})});</script>');
                    var toppadding = Number($('#cookieconsent').height()) + 52;
                });
            });
        }
    };
});