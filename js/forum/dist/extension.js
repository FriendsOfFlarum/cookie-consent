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
                    var ctext, btext, blink;
                    ctext = app.forum.attribute("cookie-consent.ctext");
                    btext = app.forum.attribute("cookie-consent.btext");
                    blink = app.forum.attribute("cookie-consent.blink");
                    $('head').prepend('<div id="cookieconsent"></div>');
                    $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/><script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script><script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "#a62424", "text": "#000000"}, "button":{"background": "#735151", "text": "#4d2d2d"}}, "theme": "classic", "content":{"message": "' + ctext + '", "dismiss": "Alright?", "link": "' + btext + '", "href": "' + blink + '"}})});</script>');
                    var toppadding = Number($('#cookieconsent').height()) + 52;
                    ;
                });
            });
        }
    };
});