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
                    document.querySelector("head").innerHTML += '<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />';
                    document.querySelector("head").innerHTML += '<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>';
                    document.querySelector("head").innerHTML += '    <script>';
                    document.querySelector("head").innerHTML += 'window.addEventListener("load", function(){';
                    document.querySelector("head").innerHTML += 'window.cookieconsent.initialise({';
                    document.querySelector("head").innerHTML += '  "palette": {';
                    document.querySelector("head").innerHTML += '    "popup": {';
                    document.querySelector("head").innerHTML += '      "background": "#000"';
                    document.querySelector("head").innerHTML += '    },';
                    document.querySelector("head").innerHTML += '    "button": {';
                    document.querySelector("head").innerHTML += '      "background": "#f1d600"';
                    document.querySelector("head").innerHTML += '    }';
                    document.querySelector("head").innerHTML += '  },';
                    document.querySelector("head").innerHTML += '  "content": {';
                    document.querySelector("head").innerHTML += '    "message": "This website",';
                    document.querySelector("head").innerHTML += '    "dismiss": "got",';
                    document.querySelector("head").innerHTML += '    "link": "me"';
                    document.querySelector("head").innerHTML += '  }';
                    document.querySelector("head").innerHTML += '})});';
                    document.querySelector("head").innerHTML += '</script>';
                });
            });
        }
    };
});