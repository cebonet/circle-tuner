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
  circleOffsetArray: Array<number> = new Array(0);
  prevFundemantalFreq: number = 0;
  previousFrequency:number;
  maxAmplitude:number=0;

  constructor(public navCtrl: NavController, androidPermissions: AndroidPermissions,
    private audioRecorder: AudioRecorder,  private noteTools: Note) { }

  ngOnInit() {
    this.audioRecorder.startRecording(this.processAudioData.bind(this));
    var rect = document.getElementById("circle").getBoundingClientRect();
    this.circleCenterPos = rect.left;
    console.log('initial circle pos : ' + this.circleCenterPos);
  }

  // Use audio data here to modify view
  processAudioData(frequency, amplitude){
/*
    this.MIDI = this.noteTools.getMIDI(this.frequency);
    this.previousFundamental = this.noteTools.getMIDIToFrequency(this.MIDI - 1);
    this.fundamental = this.noteTools.getMIDIToFrequency(this.MIDI);
    this.nextFundamental = this.noteTools.getMIDIToFrequency(this.MIDI + 1);
*/
    if (amplitude > this.maxAmplitude) {
        this.maxAmplitude = amplitude;
    }

    // Skip if amplitude too low
    if ((amplitude / this.maxAmplitude) < 0.20) {
      return;
    }

    //console.log("FundementalFreq:" + currentFreq.toFixed(2) + " amp:" + amplitude.toFixed(2) + " note:" + note);
    //console.log('ratio:' + (amplitude / maxAmplitude)) 

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
      let offset = this.previousFrequency - frequency;

/*
      this.circleOffsetArray.push(offset);
      var smoothOffset = this.circleOffsetArray.reduce((a, b) => a + b, 0) / this.circleOffsetArray.length;
      // console.log(this.circleOffsetArray);
      // console.log('offset:' + offset);
      // console.log('smooth-offset:' + smoothOffset)

      var circlePos = (this.circleCenterPos);
      var offsetAsPercent = 50 + smoothOffset;

      circle.style.left = 'calc(' + offsetAsPercent + '% - 1em)';
      if (Math.abs(offsetAsPercent - 50) < 1) {
        circle.style.backgroundColor = 'black';
      } else {
        circle.style.backgroundColor = 'rgb(124, 12, 12)';
      }
      // console.log('center:' + offsetAsPercent);
      // console.log('circlePos' + circlePos);

      */
    }
    // this.prevFundemantalFreq = this.currentFreq;
  }
}