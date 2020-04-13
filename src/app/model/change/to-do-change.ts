import {ToDoStatus} from "../to-do/to-do-status";
import {ToDo} from "../to-do/to-do";

export class ToDoChange {

  oldDescription: string;
  newDescription: string;
  oldStatus: ToDoStatus;
  newStatus: ToDoStatus;
  toDo: ToDo;

}
