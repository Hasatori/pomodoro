import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {getEnvironment} from "../ServerConfig";
@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  constructor() {
  }


  public getFullUrl(relativePath: string): string {
    return getEnvironment().backend + relativePath;
  }
}
