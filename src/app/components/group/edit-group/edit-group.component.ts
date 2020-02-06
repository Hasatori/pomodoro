import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {UploadFile, UploadInput, UploadOutput} from 'ng-uikit-pro-standard';
import {image} from 'd3-fetch';
import {ModalDirective} from 'angular-bootstrap-md';
import {Group} from '../../../model/group';
import {environment} from '../../../../environments/environment';
import {getEnvironment} from "../../../ServerConfig";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  // @ts-ignore
  @ViewChild('basicModal') input: ModalDirective;
  @Input() group: Group = null;
  public  groupName: string = '';
  public  isPublic: boolean = false;
  public  description: string = '';
  selectedImage: string = getEnvironment().backend+'group/layout/teamwork-3.jpg';


  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;


  constructor() {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = new Function;

    for (let i = 1; i < 6; i++) {
      this.images.push(`${getEnvironment().backend}group/layout/teamwork-${i}.jpg`);
    }
  }

  show() {
    this.input.show();
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i++) {
      files += this.files[i].name;
      if (!(this.files.length - 1 === i)) {
        files += ',';
      }
    }
    return files;
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'your-path-to-backend-endpoint',
      method: 'POST',
      data: {foo: 'bar'},
    };
    this.files = [];
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({type: 'cancel', id: id});
  }

  onUploadOutput(output: UploadOutput | any): void {

    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();
  }

  images = [];

  selectImage(image: string) {
    this.selectedImage = image;
  }

  readURL(event: Event): void {
    // @ts-ignore
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.selectedImage = event.target.result;
      };

      // @ts-ignore
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnInit(): void {
    if (this.group !== null) {
      this.groupName = this.group.name;
      this.isPublic = false;
      this.description = '';
      this.selectedImage = this.group.layoutImage;
    }
  }
}
