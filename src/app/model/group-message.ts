import {User} from './user';
import {UserGroupMessage} from './user-group-message';

export class GroupMessage {
  author:User;
  value:string;
  timestamp:Date;
  relatedGroupMessages:Array<UserGroupMessage>;
}
