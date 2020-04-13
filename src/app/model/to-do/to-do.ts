import {ToDoStatus} from "./to-do-status";
import {User} from "../user/user";
import {Pomodoro} from "../user/pomodoro";
import {ToDoChange} from "../change/to-do-change";
import {ToDoAttachment} from "../attachment/to-do-attachment";

export class ToDo {

  id: number;
  name: string;
  description: string;
  status: ToDoStatus;
  deadline: Date;
  author: User;
  finishedPomodoros: Array<Pomodoro>;
  toDoChanges: Array<ToDoChange>
  attachments: Array<ToDoAttachment>;
  visible?: boolean;
  selected?:boolean;
  accordionDisabled?:boolean;
}
