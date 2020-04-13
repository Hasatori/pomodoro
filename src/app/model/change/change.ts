import {ChangeType} from "./change-type";
import {User} from "../user/user";


export class Change {

  id: number;
  changeType: ChangeType;
  changeTimestamp: Date;
  changeAuthor: User;
}
