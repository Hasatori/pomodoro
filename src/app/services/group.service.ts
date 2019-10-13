import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Group} from '../model/group/group';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }


  public getGroups(): Observable<Array<Group>> {
    return this.http.post<any>(`http://localhost:8080/groups`, '').pipe(map(groups => {
      return groups;
    }));
  }
}
