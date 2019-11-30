import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PomodoroService} from '../../services/pomodoro.service';
import {UserService} from '../../services/user.service';
import {Settings} from '../../model/settings';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent  {
  private phaseChangedSoundPlaying: boolean = false;
  private pauseSoundPlaying: boolean = false;
  private workSoundPlaying: boolean = false;
  private currentSettings: Settings;
  private sounds: Array<String> =
    [null, 'Noise-cancelling-sound.mp3', 'Simple-alert-bells-tone.mp3'];

  constructor(private userService: UserService) {

    userService.getUser().subscribe((user) => {
      this.currentSettings = user.settings;
    });
  }


  updateSettings(pauseTime: string, workTime: string, soundOnPhaseChange: string, soundOnWork: string, soundOnPause: string) {
    console.log('Test'+workTime);
    let updatedSettings=new Settings();
    updatedSettings.pauseTime=Number(pauseTime)*60;
    updatedSettings.workTime=Number(workTime)*60;
    updatedSettings.phaseChangedSound=soundOnPhaseChange;
    updatedSettings.workSound=soundOnWork;
    updatedSettings.pauseSound=soundOnPause;
    this.userService.updateSettings(updatedSettings).pipe(first()).subscribe(result=>{
   this.currentSettings=updatedSettings;

    },error1 => {
      if (error1.status == 400) {
      console.log('Error');
      }
    });
  }
}
