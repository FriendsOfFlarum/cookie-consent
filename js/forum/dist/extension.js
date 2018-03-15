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
                    var text;
                    text = app.forum.attribute("cookie-consent.ctext");
                    $('#header').prepend('<div id="cookieconsent"></div>');
                    $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" /> <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script> <script>window.addEventListener("load", function(){window.cookieconsent.initialise({ "palette": { "popup": { "background": "#000" }, "button": { "background": "#f1d600" } }, "content": { "message": "This website", "dismiss": "got", "link": "me" }})});</script>');
                    var toppadding = Number($('#cookieconsent').height()) + 52;
                    ;
                });
            });
        }
    };
});