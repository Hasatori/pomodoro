import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {UserServiceProvider} from '../../../services/user-service-provider';
import {Observable, of} from 'rxjs';
import {SERVER_URL} from '../../../ServerConfig';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent  {

  private files: FileList;
  private uploadedFileName = '';
  private progress: number = 0;
  private alreadyUploaded: number = 0;
  private done: boolean;
  private FILE_SIZE_LIMIT: number = 80000000;
  private fileToBig: boolean = false;
  // @ts-ignore
  @ViewChild('frame') input: ModalDirective;

  constructor(private userServiceProvider: UserServiceProvider, private httpClient: HttpClient) {
  }

  reset() {
    this.files = null;
    this.uploadedFileName = '';
    this.progress = 0;
    this.alreadyUploaded = 0;
    this.fileToBig = false;
  }

  handleFileInput(files: FileList) {
    this.reset();
    this.input.show();
    this.files = files;
    if (this.allFilesMatchRestrictions(files)) {
      this.uploadFile(this.files[0], 0);
    } else {
      this.fileToBig = true;
    }
  }

  private allFilesMatchRestrictions(files: FileList): boolean {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).size > this.FILE_SIZE_LIMIT) {
        return false;
      }
    }
    return true;
  }

  private uploadFile(file: File, index: number) {
    this.uploadedFileName = file.name;
    this.postFile(this.files[index]).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          let result = Math.round(this.progress + (100 * ((event.loaded / event.total) / this.files.length)));
          this.progress = result > 100 ? 100 : result;
        } else if (event instanceof HttpResponse) {
          this.alreadyUploaded += 1;
          if (this.alreadyUploaded === this.files.length) {
            this.done = true;
          } else {
            this.uploadFile(this.files[index + 1], index + 1);
          }
        }
      }
    );

  }


  private postFile(fileToUpload: File): Observable<HttpEvent<any>> {
    if (fileToUpload.size < this.FILE_SIZE_LIMIT) {
      const endpoint = `${SERVER_URL}/upload`;
      const data: FormData = new FormData();
      data.append('file', fileToUpload);
      const newRequest = new HttpRequest('POST', endpoint, data, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.httpClient.request(newRequest);
    }
  }
}

