import app from 'flarum/app';
import { extend } from 'flarum/extend';
import 'cookieconsent';

app.initializers.add('reflar-cookie-consent', () => {
    $(document).ready(() => {
        const ccTheme = app.forum.attribute('reflar-cookie-consent.ccTheme');
        const backgroundColor = app.forum.attribute('reflar-cookie-consent.backgroundColor');
        const consentText = app.forum.attribute('reflar-cookie-consent.consentText');
        const buttonText = app.forum.attribute('reflar-cookie-consent.buttonText');
        const buttonBackgroundColor = app.forum.attribute('reflar-cookie-consent.buttonBackgroundColor');
        const learnMoreLinkText = app.forum.attribute('reflar-cookie-consent.learnMoreLinkText');
        const learnMoreLinkUrl = app.forum.attribute('reflar-cookie-consent.learnMoreLinkUrl');

        try {
            cookieconsent.initialise({
                palette: {
                    popup: backgroundColor && {
                        background: backgroundColor,
                    },
                    button: buttonBackgroundColor && {
                        background: buttonBackgroundColor,
                    },
                },
                theme: ccTheme,
                content: {
                    message: consentText,
                    dismiss: buttonText,
                    link: learnMoreLinkText,
                    href: learnMoreLinkUrl,
                },
            });
        } catch (err) {
            if (app.forum.attribute('adminUrl')) {
                console.error('An error occurred initializing the Cookie Consent library. Please make sure you have set all the settings properly.');
                console.error("Please report the following error if you don't think the issue is on your end\n\n", err);
            } else {
                console.error('An error occurred with the cookie consent prompt. Please contact an administrator so they can fix the issue.');
            }
        }

        delete window.cookieconsent;
    });
});
