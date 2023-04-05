import { Component } from '@angular/core';
import { AudioRecorder } from './audioRecorder';
import { Note } from "./note";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  circleCenterPos: number;
  frequencyCache: Array<number> = new Array(50);
  amplitudeLimit: number = 0.01;
  tuned: boolean = true;
  perfectlyTuned: boolean = true;
  almostTuned: boolean = false;
  tooLoose: boolean = false;
  tooTight: boolean = false;


  constructor(private audioRecorder: AudioRecorder, private noteTools: Note,) {

    // Setup frequency cache with limit 5
    this.frequencyCache.push = function() {
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


    if (diffFromFundemental < 0.1) {
      this.perfectlyTuned = true;
      this.tuned = true;
    }
    else if (diffFromFundemental < 2) {
      this.tuned = true;
    }
    else {
      this.tuned = false;
      this.perfectlyTuned = false;
    }

    var note = this.noteTools.getMIDIasNote(frequency);
    var frequency = frequency.toFixed(1);
    var octave = this.noteTools.getOctave(frequency);
    var tuneComment, tuneComment2;

    if (document.getElementById("note") != null) {
      document.getElementById("note").textContent = note + octave;
    }


    if (document.getElementById("diff") != null) {
      document.getElementById("diff").textContent = this.noteTools.getDistanceToCurrentPitch(frequency).toFixed(2).toString() + 'Hz';
    }

    if (document.getElementById("frequency") != null) {
      document.getElementById("frequency").textContent = frequency + "Hz";
    }

    if (document.getElementById("frequencyRange") != null) {
      var min = this.noteTools.getPreviousFundementalFrequency(frequency);
      document.getElementById("frequencyRange").textContent = min + "Hz";
    }

    if (document.getElementById("circle") != null) {
      var circle = document.getElementById("circle");
      var currentFundementalFrequency = this.noteTools.getFundamentalFrequency(frequency);
      var previousFundementalFrequency = this.noteTools.getPreviousFundementalFrequency(frequency);
      var nextFundementalFrequency = this.noteTools.getNextFundementalFrequency(frequency);
      //this.moveCircle(frequency, currentFundementalFrequency, previousFundementalFrequency, nextFundementalFrequency, circle);
      this.sizeCircle(frequency, currentFundementalFrequency, previousFundementalFrequency, nextFundementalFrequency, circle);
      this.colorCircle(circle);

      if (document.getElementById("tuneComment") != null) {

        if (!this.perfectlyTuned) {
          if (frequency > currentFundementalFrequency) {
            tuneComment2 = "tune down a bit"
          } else {
            tuneComment2 = "tune up a bit"
          }
        }

        if (this.perfectlyTuned) {
          tuneComment = "perfect!"
          tuneComment2 = ""
        } else if (this.tuned) {
          tuneComment = "almost there!"
        }
        else {
          tuneComment = "Way off!"
        }

        document.getElementById("tuneComment").textContent = tuneComment + " " + tuneComment2;
      }
    }

  }

  private averageOffset = function() {
    let offsetCache = Object.assign([], this.frequencyCache);
    offsetCache = offsetCache.map(f => f - this.noteTools.getFundamentalFrequency(f).toFixed(2));
    let avg = (offsetCache.reduce((a, b) => a + b, 0) / offsetCache.length);
    return avg;
  }


  public colorCircle = function(circle: HTMLElement) {
    if (this.perfectlyTuned) {
      circle.style.backgroundColor = 'rgba(62, 153, 48, 0.8)';
      // circle.style.boxShadow = '0em 0em 20px 20px rgba(0, 0, 0, 0.325)';
    } else {
      circle.style.backgroundColor = 'rgb(192, 57, 43)';
      // circle.style.boxShadow = '0em 0em 10px 8px rgba(255, 0, 0, 0.125)';
    }
  }

  public moveCircle = function(frequency: number, currentFundementalFrequency, previousFundementalFrequency, nextFundementalFrequency, circle: HTMLElement) {
    let center = 50
    let amplify_finetunning = 1.5;
    let amplify = 1;

    let position = (frequency - this.noteTools.getFundamentalFrequency(frequency)) * amplify;
    let newPosition = (center + position);

    if (newPosition < 10 || newPosition > 90) {
      return;
    }

    circle.style.left = 'calc(' + newPosition.toFixed(3) + '%)';
    //console.log('current fun=' + currentFundementalFrequency, '  prev fun= ' + previousFundementalFrequency + '  next fun= ' + nextFundementalFrequency)
    console.log('new position:' + newPosition);
  }

  public sizeCircle = function(frequency: number, currentFundementalFrequency, previousFundementalFrequency, nextFundementalFrequency, circle: HTMLElement) {
    let minSize = 60;
    let maxSize = 130;
    let diff = minSize + this.noteTools.getFundamentalFrequency(frequency) - frequency;

    if (diff > maxSize) {
      diff = maxSize;
    }

    if (diff > minSize && diff < maxSize) {
      circle.style.width = 'calc(' + diff.toFixed(3) + 'vh)';
      circle.style.height = 'calc(' + diff.toFixed(3) + 'vh)';
    }
  }

}
