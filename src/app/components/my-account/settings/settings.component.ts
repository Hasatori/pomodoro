import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PomodoroService} from '../../../services/pomodoro.service';
import {UserService} from '../../../services/user.service';
import {Settings} from '../../../model/settings';
import {first} from 'rxjs/operators';
import {UserServiceProvider} from '../../../services/user-service-provider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public phaseChangedSoundPlaying: boolean = false;
  public pauseSoundPlaying: boolean = false;
  public workSoundPlaying: boolean = false;
  public noValueWasChanged: boolean = false;
  public currentSettings: Settings;
  public sounds: Array<String> =
    [
      null,
      'Noise-cancelling-sound.mp3',
      'Simple-alert-bells-tone.mp3'
    ];
  public  inProgress: boolean = false;
  public  success: boolean = false;

  constructor(public userServiceProvider: UserServiceProvider) {

    userServiceProvider.userService.getUser().subscribe((user) => {
      this.currentSettings = user.settings;
    });
  }

  private resetValues() {
    this.phaseChangedSoundPlaying = false;
    this.pauseSoundPlaying = false;
    this.workSoundPlaying = false;
    this.noValueWasChanged = false;
    this.inProgress = false;
    this.success = false;
  }

  updateSettings(pauseTime: string, workTime: string, soundOnPhaseChange: string, soundOnWork: string, soundOnPause: string) {
    console.log('Test' + workTime);
    this.resetValues();
    let updatedSettings = new Settings();
    updatedSettings.pauseTime = Number(pauseTime) * 60;
    updatedSettings.workTime = Number(workTime) * 60;
    updatedSettings.phaseChangedSound = soundOnPhaseChange;
    updatedSettings.workSound = soundOnWork;
    updatedSettings.pauseSound = soundOnPause;
    if (JSON.stringify(this.currentSettings) !== JSON.stringify(updatedSettings)) {
      this.inProgress = true;
      this.userServiceProvider.userService.updateSettings(updatedSettings).pipe(first()).subscribe(result => {
        this.currentSettings = updatedSettings;
        this.success = true;
        this.inProgress = false;
        this.userServiceProvider.pomodoroService.resetPomodoroForCurrentUser();
      }, error1 => {
        if (error1.status == 400) {
          this.inProgress = false;
        }
      });
    } else {
      this.noValueWasChanged = true;
    }
  }
}
