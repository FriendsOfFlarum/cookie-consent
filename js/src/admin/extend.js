import Extend from 'flarum/common/extenders';
import CookieConsentSettingsPage from './components/CookieConsentSettingsPage';

export default [new Extend.Admin().page(CookieConsentSettingsPage)];
