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
  frequencyCache: Array<number> = new Array(15);;
  amplitudeLimit: number = 0.2;

  constructor(public navCtrl: NavController, androidPermissions: AndroidPermissions,
    private audioRecorder: AudioRecorder, private noteTools: Note) {

    // Setup frequency cache with limit 5
    this.frequencyCache.push = function () {
      if (this.length >= 15) {
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
    /*
        this.MIDI = this.noteTools.getMIDI(this.frequency);
        this.previousFundamental = this.noteTools.getMIDIToFrequency(this.MIDI - 1);
        this.fundamental = this.noteTools.getMIDIToFrequency(this.MIDI);
        this.nextFundamental = this.noteTools.getMIDIToFrequency(this.MIDI + 1);
    */
    if (amplitude > this.amplitudeLimit) {
      this.amplitudeLimit = amplitude;
    }

    // Skip if amplitude too low
    if ((amplitude / this.amplitudeLimit) < 0.20) {
      return;
    }

    //console.log("FundementalFreq:" + currentFreq.toFixed(2) + " amp:" + amplitude.toFixed(2) + " note:" + note);
    //console.log('ratio:' + (amplitude / amplitudeLimit)) 

    // Reflect values to view
    if (document.getElementById("note") != null) {
      document.getElementById("note").textContent = this.noteTools.getMIDIasNote(frequency, true);;
    }

    if (document.getElementById("frequency") != null) {
      document.getElementById("frequency").textContent = frequency.toFixed(0) + "Hz";
    }

    if (document.getElementById("octave") != null) {
      document.getElementById("octave").textContent = 'Octave: ' + this.noteTools.getOctave(frequency);
    }

    if (document.getElementById("circle") != null) {
      var circle = document.getElementById("circle");

      this.frequencyCache.push(frequency.toFixed(2));
      var offset = this.averageOffset();

      if(Math.abs(offset) > 50){
        offset = 0;
      }
      var offsetAsPercent = 50 + offset;

      circle.style.left = 'calc(' + offsetAsPercent + '% - 1em)';
      if (Math.abs(offsetAsPercent - 50) < 0.5) {
        circle.style.backgroundColor = 'black';
      } else {
        circle.style.backgroundColor = 'rgb(124, 12, 12)';
      }
      // console.log('center:' + offsetAsPercent);
      // console.log('circlePos' + circlePos);
    }
  }
  averageOffset = function () {
    let offsetCache = Object.assign([], this.frequencyCache);
    offsetCache = offsetCache.map( f => f - this.noteTools.getFundamentalFrequency(f).toFixed(2));
    let avg = (offsetCache.reduce((a,b) => a + b,0) / offsetCache.length);
    console.log(avg);
    return avg;
  }
}