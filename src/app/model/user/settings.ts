import {User} from "./user";

export class Settings {
  id?: number;
  user?: User;
  workDurationInSeconds: number;
  pauseDurationInSeconds: number;
  phaseChangedSound: string;
  workSound: string;
  pauseSound: string;
}
