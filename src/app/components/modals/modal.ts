import {ModalDirective} from 'angular-bootstrap-md';

export class Modal {

  waitAndShowAgain(waitDuration: number, modal: ModalDirective) {
    setTimeout(() => {
      if (!modal.isShown) {
        modal.show();
      }
    }, waitDuration);
  }
}
