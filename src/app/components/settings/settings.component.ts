import {Component, OnInit} from '@angular/core';
import {PomodoroService} from '../../services/pomodoro.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
 private phaseChangedSoundPlaying:boolean=false;
  private pauseSoundPlaying:boolean=false;
  private workSoundPlaying:boolean=false;
  
  constructor(private pomodoroService: PomodoroService) {
    this.playSound = JSON.parse(window.localStorage.getItem(pomodoroService.PLAY_SOUND_KEY));
    if (this.playSound == null) {
      this.playSound = false;
    }
  }

  ngOnInit() {
  }

  updateSettings(playSound:boolean) {
    console.log(playSound);
    localStorage.setItem(this.pomodoroService.PLAY_SOUND_KEY, JSON.stringify(playSound));
    location.reload();
  }
}
