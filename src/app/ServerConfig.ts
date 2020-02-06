import {AuthServiceConfig, FacebookLoginProvider} from 'angularx-social-login';
import {isDevMode} from "@angular/core";
import {environment} from "../environments/environment.prod";

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('2835776676443332')
  }
]);

export function provideConfig() {
  return config;
}

export function getEnvironment(): Environment {
  let result = new Environment();
  if (environment.production) {
    result.backend = 'https://pomodoro-rest-api.herokuapp.com/';
    result.websocket = 'wss://pomodoro-rest-api.herokuapp.com/socket';
  } else {
    result.backend = 'http://localhost:8080/';
    result.websocket = 'ws://localhost:8080/socket';
  }
  return result;
}

export class Environment {
  backend: string;
  websocket: string;
}
