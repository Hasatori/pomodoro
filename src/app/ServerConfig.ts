import {AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';

const httpProtocol:string='https://';
const wsProtocol:string='ws://';
const server:string='pomodoro-rest-api.herokuapp.com';
export const SERVER_URL:string=`${httpProtocol}${server}`;
export const WEB_SOCKET_URL:string=`${wsProtocol}${server}/socket`;
const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('2835776676443332')
  }
]);

export function provideConfig() {
  return config;
}
