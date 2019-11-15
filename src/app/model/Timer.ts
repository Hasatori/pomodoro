import {Pomodoro} from './pomodoro';
import {Observable, Observer} from 'rxjs';
import {OnPhaseChanged} from './OnPhaseChanged';
import {Optional} from '@angular/core';
import {useAnimation} from '@angular/animations';

export class Timer {

  public phase: string = 'NOT RUNNING';
  public minutes: string;
  public seconds: string;
  public secondsLeft: number=0;
  public interval;
  public timeLeft: string = '00:00';
  public started: boolean = false;
  public audio: HTMLAudioElement;
  public onPhaseChanged: OnPhaseChanged;
  private SOUNDS_PATH: string = '../assets/sounds/';
  private CHANGE_SOUND: string = this.SOUNDS_PATH + 'Simple-alert-bells-tone.mp3';
  private PAUSE_BACKGROUND_SOUND: string = this.SOUNDS_PATH + 'Noise-cancelling-sound.mp3';
  private useAudio: boolean;

  constructor(useAudio:boolean,onPhaseChanged?: OnPhaseChanged) {
    this.useAudio=useAudio;
    this.onPhaseChanged = onPhaseChanged;
    this.audio = document.createElement('audio');
    this.audio.setAttribute('src', '../assets/sounds/Simple-alert-bells-tone.mp3');
    this.audio.setAttribute('type', 'audio/ogg');
  }

  start(pomodoro: Pomodoro) {
    this.pause();
    // @ts-ignore
    var difference = (new Date() - new Date(pomodoro.creationTimestamp)) / 1000;
    if (pomodoro.interrupted) {
      this.setPhase('NOT RUNNING');
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
    this.phase = newPhase;
    if (this.useAudio) {
      this.audio.setAttribute('src', this.CHANGE_SOUND);
      this.audio.pause();
      this.audio.onended = () => {
        if (newPhase === 'PAUSE') {
          this.audio.setAttribute('src', this.PAUSE_BACKGROUND_SOUND);
          this.audio.play();
          this.audio.onended = () => {
            if (this.phase === 'PAUSE') {
              this.audio.play();
            }
          }
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
    this.secondsLeft=0;
    this.setPhase('NOT RUNNING');
    clearInterval(this.interval);
  }
  isRunning():boolean{
 return this.secondsLeft !== 0;
  }
}
