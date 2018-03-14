import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import Page from 'flarum/components/Page';


app.initializers.add('zaptech-cookie-consent', () => {
    extend(Page.prototype, 'init', function() {
        console.log("running")
    });
});