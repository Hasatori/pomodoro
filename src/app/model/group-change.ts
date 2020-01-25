import {Group} from './group';
import {User} from './user';

export class GroupChange {

  id: number;
  group: Group;
  changeType:ChangeType;
  changeAuthor: User;
  changeDescription: string;
  changeTimestamp: Date;


}
export enum ChangeType{
CREATE,UPDATE,DELETE
}
