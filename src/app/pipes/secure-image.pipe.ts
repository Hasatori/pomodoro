import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {GroupService} from '../services/group.service';
import {isUndefined} from 'util';

@Pipe({
  name: 'secureImage'
})
export class SecureImagePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private test: GroupService) {
console.log(test.cached);
  }
  transform(url): Observable<SafeUrl> {
    let val = this.test.cached.get(url);
    if (!isUndefined(val)) {
      return of(val);
    } else {
      return this.http
        .post(url, {}, {responseType: 'blob'})
        .pipe(
          map(val => {
            let result = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val));
            this.test.cached.set(url, result);
            return result;
          }));
    }
  }

}
