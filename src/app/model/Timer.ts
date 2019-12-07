import {Pomodoro} from './pomodoro';
import {Observable, Observer} from 'rxjs';
import {OnPhaseChanged} from './OnPhaseChanged';
import {Optional} from '@angular/core';
import {useAnimation} from '@angular/animations';
import {Settings} from './settings';
import {NGXLogger} from 'ngx-logger';

export class Timer {

  public phase: string = 'NOT RUNNING';
  public minutes: string;
  public seconds: string;
  public secondsLeft: number = 0;
  public interval;
  public timeLeft: string = '00:00';
  public started: boolean = false;
  public audio: HTMLAudioElement;
  public onPhaseChanged: OnPhaseChanged;
  private SOUNDS_PATH: string = '../assets/sounds/';
  private settings: Settings;

  constructor(private log:NGXLogger,settings?: Settings, onPhaseChanged?: OnPhaseChanged) {
    this.settings = settings;
    this.onPhaseChanged = onPhaseChanged;
    this.audio = document.createElement('audio');
    this.log.debug(`Initializing timer with settings ${JSON.stringify(settings)}`);
  }

  start(pomodoro: Pomodoro) {
    this.pause();
    // @ts-ignore
    let difference = (new Date().getTime() - new Date(pomodoro.creationTimestamp).getTime()) / 1000;
    let sum=pomodoro.breakTime+pomodoro.workTime;
  this.log.debug(`Pomodoro was interrupted ${pomodoro.interrupted} and sum is ${sum} and difference is ${difference}`);
    if (pomodoro.interrupted || difference>sum) {
    this.pause();
      this.secondsLeft = 0;
    } else if (difference > pomodoro.workTime) {
      this.started = true;
      this.secondsLeft = pomodoro.breakTime - (difference - pomodoro.workTime);
      this.setPhase('PAUSE');
    } else {
      this.started = true;
      this.setPhase('WORK');
      this.secondsLeft = pomodoro.workTime - difference;
    }
    let minutes;
    let seconds;
    this.interval = setInterval(() => {
      if (this.secondsLeft > 0) {
        // @ts-ignore

        var difference = (new Date() - new Date(pomodoro.creationTimestamp)) / 1000;
        if (difference > pomodoro.workTime && this.phase !== 'PAUSE') {
          this.secondsLeft = pomodoro.breakTime;
          this.setPhase('PAUSE');
        }
        this.secondsLeft--;
        minutes = Math.floor(this.secondsLeft / 60) % 60;
        seconds = Math.floor(this.secondsLeft - minutes * 60);
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (seconds < 10) {
          seconds = '0' + seconds;
        }
        this.timeLeft = minutes + ':' + seconds;

      } else {
        this.pause();
      }


    }, 1000);
  }

  private setPhase(newPhase: string) {
    this.log.debug(`Setting phase from ${this.phase} to ${newPhase}`);
    this.phase = newPhase;
    if (this.settings!=null) {
      this.audio.setAttribute('src', this.SOUNDS_PATH+this.settings.phaseChangedSound);
      this.audio.pause();
      this.audio.onended = () => {
        if (newPhase === 'PAUSE') {
          this.audio.setAttribute('src', this.SOUNDS_PATH+this.settings.pauseSound);
          this.audio.play();
          this.audio.onended = () => {
            if (this.phase === 'PAUSE') {
              this.audio.play();
            }
          };
        }
        if (newPhase === 'WORK') {
          this.audio.setAttribute('src', this.SOUNDS_PATH+this.settings.workSound);
          this.audio.play();
          this.audio.onended = () => {
            if (this.phase === 'WORK') {
              this.audio.play();
            }
          };
        }
      };
      this.audio.play();
    }

    if (this.onPhaseChanged != null) {
      this.onPhaseChanged.phaseChanged();
    }
  }

  pause() {
    this.started = false;
    this.timeLeft = '00:00';
    this.secondsLeft = 0;
    this.setPhase('NOT RUNNING');
    this.audio.pause();
    clearInterval(this.interval);
  }

  isRunning(): boolean {
    return this.secondsLeft !== 0;
  }
}
