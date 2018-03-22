import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import Page from 'flarum/components/Page';


app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function() {
        var ctext, btext, blink, atext, bcolor, bcolor1, bcolor2;
        ctext = app.forum.attribute("cookie-consent.ctext");
        btext = app.forum.attribute("cookie-consent.btext");
        blink = app.forum.attribute("cookie-consent.blink");
        atext = app.forum.attribute("cookie-consent.atext");
        bcolor = app.forum.attribute("cookie-consent.bcolor");
        bcolor1 = app.forum.attribute("cookie-consent.bcolor1");
        bcolor2 = app.forum.attribute("cookie-consent.bcolor2");
        $('head').prepend('<div id="cookieconsent"></div>');        
        $('#cookieconsent').append('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/><script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script><script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "' + bcolor + '", "text": "' + bcolor1 + '"}, "button":{"background": "' + bcolor2 + '", "text": "' + bcolor1 + '"}}, "theme": "classic", "content":{"message": "' + ctext + '", "dismiss": "' + atext + '", "link": "' + btext + '", "href": "' + blink + '"}})});</script>');
        const toppadding = Number($('#cookieconsent').height()) + 52;
    });
});