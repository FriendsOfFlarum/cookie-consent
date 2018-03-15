import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import Page from 'flarum/components/Page';


app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function() {
        var text;
        text = app.forum.attribute("cookie-consent.ctext");
        $('#header').prepend('<div id="cookieconsent"></div>');
        $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" /> <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script> <script>window.addEventListener("load", function(){window.cookieconsent.initialise({ "palette": { "popup": { "background": "#000" }, "button": { "background": "#f1d600" } }, "content": { "message": "This website", "dismiss": "got", "link": "me" }})});</script>');
        const toppadding = Number($('#cookieconsent').height()) + 52;
    ;
    });
});