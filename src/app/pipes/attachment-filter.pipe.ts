import {Pipe, PipeTransform} from '@angular/core';
import {Attachment} from "../model/attachment/attachment";

@Pipe({
  name: 'attachmentFilter'
})
export class AttachmentFilterPipe implements PipeTransform {

  private imageExtensions: Array<string> = ['jpg', 'png', 'gif', 'svg', 'tif'];

  transform(attachments: Array<Attachment>, imagesOnly: boolean): any {
    return attachments.filter(attachment =>  this.isAttachmentImage(attachment)===imagesOnly);
  }

  private isAttachmentImage(attachment: Attachment):boolean {
return  this.imageExtensions.some(imageExtension => imageExtension === attachment.format);

  }
}
