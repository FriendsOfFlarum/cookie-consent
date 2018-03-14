import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import Page from 'flarum/components/Page';


app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function() {
        //document.querySelector("head").innerHTML += '<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />';
        //document.querySelector("head").innerHTML += '<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>';
        //document.querySelector("head").innerHTML += '    <script>';
        //document.querySelector("head").innerHTML += 'window.addEventListener("load", function(){';
        //document.querySelector("head").innerHTML += 'window.cookieconsent.initialise({';
        //document.querySelector("head").innerHTML += '  "palette": {';
        //document.querySelector("head").innerHTML += '    "popup": {';
        //document.querySelector("head").innerHTML += '      "background": "#000"';
        //document.querySelector("head").innerHTML += '    },';
        //document.querySelector("head").innerHTML += '    "button": {';
        //document.querySelector("head").innerHTML += '      "background": "#f1d600"';
        //document.querySelector("head").innerHTML += '    }';
        //document.querySelector("head").innerHTML += '  },';
        //document.querySelector("head").innerHTML += '  "content": {';
        //document.querySelector("head").innerHTML += '    "message": "This website",';
        //document.querySelector("head").innerHTML += '    "dismiss": "got",';
        //document.querySelector("head").innerHTML += '    "link": "me"';
        //document.querySelector("head").innerHTML += '  }';
        //document.querySelector("head").innerHTML += '})});';
        //document.querySelector("head").innerHTML += '</script>';
        text = app.forum.attribute("cookie-consent.ctext");
    });
});