import app from 'flarum/forum/app';
import 'cookieconsent';

app.initializers.add('fof-cookie-consent', () => {
  app.beforeMount(() => {
    const getAttribute = (key: string) => app.forum.attribute<string>(`fof-cookie-consent.${key}`);

    const settings: CookieConsentOptions = {
      theme: getAttribute('ccTheme'),
      content: {
        message: getAttribute('consentText'),
        dismiss: getAttribute('buttonText'),
        link: getAttribute('learnMoreLinkText'),
        href: getAttribute('learnMoreLinkUrl'),
      },
    };

    if (getAttribute('ccTheme') !== 'no_css') {
      settings.palette = {
        popup: {
          background: getAttribute('backgroundColor') || undefined,
          text: getAttribute('textColor') || undefined,
        },
        button: {
          background: getAttribute('buttonBackgroundColor') || undefined,
          text: getAttribute('buttonTextColor') || undefined,
        },
      };
    }

    try {
      cookieconsent.initialise(settings);
    } catch (err) {
      console.error('An error occurred initializing the Cookie Consent library:', err);
    }

    delete window.cookieconsent;
  });
});
