import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  constructor() {
  }


  public getFullUrl(relativePath: string): string {
    return environment.backend + relativePath;
  }
}
