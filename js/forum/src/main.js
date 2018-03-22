import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import Page from 'flarum/components/Page';


app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function() {
        var ctext, btext, blink, atext;
        ctext = app.forum.attribute("cookie-consent.ctext");
        btext = app.forum.attribute("cookie-consent.btext");
        blink = app.forum.attribute("cookie-consent.blink");
        atext = app.forum.attribute("cookie-consent.atext");
        $('head').prepend('<div id="cookieconsent"></div>');        
        $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/><script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script><script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "#a62424", "text": "#000000"}, "button":{"background": "#735151", "text": "#4d2d2d"}}, "theme": "classic", "content":{"message": "' + ctext + '", "dismiss": "' + atext + '", "link": "' + btext + '", "href": "' + blink + '"}})});</script>');
        const toppadding = Number($('#cookieconsent').height()) + 52;
    ;
    });
});