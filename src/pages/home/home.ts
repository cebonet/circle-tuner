import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AudioRecorder } from './audioRecorder';
import { Note } from "./note";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  circleCenterPos: number;
  frequencyCache: Array<number> = new Array(50);;
  amplitudeLimit: number = 0.2;
  tuned : boolean = true;
  almostTuned :boolean = false;
  tooLoose : boolean = false;
  tooTight : boolean = false;

  constructor(public navCtrl: NavController, androidPermissions: AndroidPermissions,
    private audioRecorder: AudioRecorder, private noteTools: Note) {

    // Setup frequency cache with limit 5
    this.frequencyCache.push = function () {
      if (this.length >= 50) {
        this.shift();
      }
      return Array.prototype.push.apply(this, arguments);
    }
  }

  ngOnInit() {
    this.audioRecorder.startRecording(this.processAudioData.bind(this));
    var rect = document.getElementById("circle").getBoundingClientRect();
    this.circleCenterPos = rect.left;
    console.log('initial circle pos : ' + this.circleCenterPos);
  }

  // Use audio data here to modify view
  processAudioData(frequency, amplitude) {
    this.frequencyCache.push(frequency.toFixed(2));
    var offset = this.averageOffset(); //offset from fundemental frequency

    if (amplitude > this.amplitudeLimit) {
      this.amplitudeLimit = amplitude;
    }

    // Skip if amplitude too low
    if ((amplitude / this.amplitudeLimit) < 0.20) {
      return;
    }

    if (Math.abs(offset) < 0.15) {
      this.tuned = true;  
    }else if(Math.abs(offset) > 0.25 && Math.abs(offset) < 3.50 ){
      this.almostTuned = true;
    }else {
      this.tuned = false;
      this.almostTuned = false;
    }


    if (document.getElementById("note") != null) {
      document.getElementById("note").textContent = this.noteTools.getMIDIasNote(frequency, true);;
    }

    if (document.getElementById("frequency") != null) {
      document.getElementById("frequency").textContent = frequency.toFixed(1) + "Hz";
    }

    if (document.getElementById("octave") != null) {
      document.getElementById("octave").textContent = 'Octave: ' + this.noteTools.getOctave(frequency);
    }

    if (document.getElementById("circle") != null) {
      var circle = document.getElementById("circle");
      this.moveCircle(offset, circle);
    }

    this.updateTuneComment(offset);


  }
  
  private averageOffset = function () {
    let offsetCache = Object.assign([], this.frequencyCache);
    offsetCache = offsetCache.map( f => f - this.noteTools.getFundamentalFrequency(f).toFixed(2));
    let avg = (offsetCache.reduce((a,b) => a + b,0) / offsetCache.length);
    return avg;
  }

  private updateTuneComment(offset: number) {
    var assist = document.getElementById("assist");
    if (this.tuned){
      assist.textContent = 'Tuned!';
    }
    else if (offset < 0) {
      assist.textContent = 'Too loose!';
    }else{
      assist.textContent = 'Too tight!';
    }
  }

  private moveCircle = function(offset: number, circle: HTMLElement) {
    circle.style.left = 'calc(' + (50 + offset).toFixed(3) + '%)';
    if (this.tuned) {
      circle.style.backgroundColor = 'rgb(39, 174, 96)';
    }else {
      circle.style.backgroundColor = 'rgb(192, 57, 43)';
    }
  }
}


