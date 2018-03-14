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
                    console.log("running");
                });
            });
        }
    };
});