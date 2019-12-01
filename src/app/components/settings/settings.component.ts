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
export class SettingsComponent {
  private phaseChangedSoundPlaying: boolean = false;
  private pauseSoundPlaying: boolean = false;
  private workSoundPlaying: boolean = false;
  private noValueWasChanged: boolean = false;
  private currentSettings: Settings;
  private sounds: Array<String> =
    [
      null,
      'Noise-cancelling-sound.mp3',
      'Simple-alert-bells-tone.mp3'
    ];
  private inProgress: boolean = false;
  private success: boolean = false;

  constructor(private userService: UserService,private pomodoroService:PomodoroService) {

    userService.getUser().subscribe((user) => {
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
      this.userService.updateSettings(updatedSettings).pipe(first()).subscribe(result => {
        this.currentSettings = updatedSettings;
        this.success = true;
        this.inProgress = false;
        this.pomodoroService.resetPomodoroForCurrentUser();
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
