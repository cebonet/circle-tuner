import { Component } from '@angular/core';
import { AudioRecorder } from './audioRecorder';
import { Note } from "./note";
import { instruments } from "src/assets/config/arrangements.json";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  circleCenterPos: number;
  frequencyCache: Array<number> = new Array(50);;
  amplitudeLimit: number = 0.02;
  tuned: boolean = true;
  almostTuned: boolean = false;
  tooLoose: boolean = false;
  tooTight: boolean = false;


  constructor(private audioRecorder: AudioRecorder, private noteTools: Note,) {

    // Setup frequency cache with limit 5
    this.frequencyCache.push = function () {
      if (this.length >= 50) {
        this.shift();
      }
      return Array.prototype.push.apply(this, arguments);
    }

    // Setup screen with target notes
    

  }

  ngOnInit() {
    this.audioRecorder.startRecording(this.processAudioData.bind(this));
  }

  // Use audio data here to modify view
  processAudioData(frequency, amplitude) {
    this.frequencyCache.push(frequency.toFixed(2));
    var offset = this.averageOffset(); //offset from fundemental frequency
    let diffFromFundemental = Math.abs(this.noteTools.getFundamentalFrequency(frequency) - frequency) 

    // Skip if amplitude too low
    if (amplitude < this.amplitudeLimit) {
      return;
    }

    if (diffFromFundemental < 2) {
      this.tuned = true;
    } else {
      this.tuned = false;
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
      this.moveCircle(frequency, circle);
    }

    //this.updateTuneComment(offset);


  }

  private averageOffset = function () {
    let offsetCache = Object.assign([], this.frequencyCache);
    offsetCache = offsetCache.map(f => f - this.noteTools.getFundamentalFrequency(f).toFixed(2));
    let avg = (offsetCache.reduce((a, b) => a + b, 0) / offsetCache.length);
    return avg;
  }



  public moveCircle = function (frequency: number, circle: HTMLElement) {
    let position = -1*(this.noteTools.getFundamentalFrequency(frequency) - frequency);
    let newPosition = (50 + position);

    if(newPosition < 20 || newPosition > 80){
      return;
    }

    console.log('new position:' + newPosition);
    circle.style.left = 'calc(' + newPosition.toFixed(3) + '%)';
    //circle.style.transform = 'translateX(' + (50 + position).toFixed(3)+'px)';

    let scale = 1 + (Math.abs(position))/15 ;
    //circle.style.transform = 'scale(' + scale + ') ';


    if (this.tuned) {
      circle.style.backgroundColor = 'rgb(39, 174, 96)';
    } else {
      circle.style.backgroundColor = 'rgb(192, 57, 43)';
    }
  }

}
