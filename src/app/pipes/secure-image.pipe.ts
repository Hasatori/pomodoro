import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {GroupService} from '../services/group.service';
import {isUndefined} from 'util';
import {UserServiceProvider} from '../services/user-service-provider';

@Pipe({
  name: 'secureImage'
})
export class SecureImagePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private userServiceProvider: UserServiceProvider) {
  }

  transform(url): Observable<SafeUrl> {
    let val = this.userServiceProvider.cachingService.getImageFromCache(url);
    if (!isUndefined(val)) {
      return of(val);
    } else {
      return this.http
        .post(url, {}, {responseType: 'blob'})
        .pipe(
          map(val => {
            let result = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val));
            this.userServiceProvider.cachingService.cacheImage(url, result);
            
            return result;
          }));
    }
  }

}
