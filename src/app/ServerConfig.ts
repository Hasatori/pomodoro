import {AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';
const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('2835776676443332')
  }
]);

export function provideConfig() {
  return config;
}
