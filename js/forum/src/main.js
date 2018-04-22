import app from 'flarum/app';
import {extend} from 'flarum/extend';
import Page from 'flarum/components/Page';

app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function () {
        let ccTheme = app.forum.attribute("cookie-consent.ccTheme");
        let backgroundColor = app.forum.attribute("cookie-consent.backgroundColor");
        let consentText = app.forum.attribute("cookie-consent.consentText");
        let buttonText = app.forum.attribute("cookie-consent.buttonText");
        let buttonBackgroundColor = app.forum.attribute("cookie-consent.buttonBackgroundColor");
        let learnMoreLinkText = app.forum.attribute("cookie-consent.learnMoreLinkText");
        let learnMoreLinkUrl = app.forum.attribute("cookie-consent.learnMoreLinkUrl");

        $('head').prepend('<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css"/>' +
            '<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>' +
            '<script>window.addEventListener("load", function(){window.cookieconsent.initialise({"palette":{"popup":{"background": "' + backgroundColor + '"}, "button":{"background": "' + buttonBackgroundColor + '"}}, "theme": "'+ ccTheme +'", "content":{"message": "' + consentText + '", "dismiss": "' + buttonText + '", "link": "' + learnMoreLinkText + '", "href": "' + learnMoreLinkUrl + '"}})});</script>');
    });
});