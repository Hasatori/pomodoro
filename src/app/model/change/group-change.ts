import {Group} from '../group/group';
import {Change} from "./change";

export class GroupChange extends Change {

  oldName: string;
  newName: string;
  oldDescription: string;
  newDescription: string;
  oldLayoutImage: string;
  newLayoutImage: string;
  oldIsPublic: boolean;
  newIsPublic: boolean;
  group: Group;
}
