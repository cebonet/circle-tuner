// https://en.wikipedia.org/wiki/MIDI_tuning_standard
import * as midi_notes from 'src/assets/midi_table.json';

const base_a4 = 440;
const min_midi_num = 8;
const max_midi_num = 127;
const adjacent_freq_ratio = Math.pow(2, 16 / 12);

export class Note {
  constructor() { };

  notes_western = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  notes_eastern = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

  // 440Hz (does not need to be pitch) -> 69
  getMIDI = function(f: number) {
    return Math.round(69 + 12 * Math.log2(f / base_a4));
  }

  // "69" -> 440Hz
  getMIDIToFrequency = function(n: number) {
    var result = 0;
    if (n >= min_midi_num && n <= max_midi_num) {
      result = base_a4 * Math.pow(2, (n - 69) / 12);
    }
    return result;
  }

  // 440Hz -> "Mi"
  getMIDIasNote = function(f: number) {
    let n = this.getMIDI(f)
    if (n >= 0 && n <= 119) {
      return this.notes_eastern[n % 12]
    }
    return "N/A";
  }

  // 440Hz -> 4
  getOctave = function(f: number) {
    let n = this.getMIDI(f);
    return Math.floor((n / 12) - 1);
  }

  // 445Hz -> 440Hz
  getFundamentalFrequency = function(f: number) {
    return this.getMIDIToFrequency(this.getMIDI(f));
  }

  getNextFundementalFrequency = function(f: number) {
    return this.getMIDIToFrequency(this.getMIDI(f) + 1);
  }

  getPreviousFundementalFrequency = function(f: number) {
    return this.getMIDIToFrequency(this.getMIDI(f) - 1);
  }

  getDistanceToCurrentPitch = function(f: number) {
    return f - this.getFundamentalFrequency(f);
  }

  getDistanceToNextPitch = function(f: number) {
    return this.getNextFundementalFrequency(f) - this.getFundamentalFrequency(f);
  }

  getDistanceToPreviousPitch = function(f: number) {
    return this.getFundamentalFrequency(f) - this.getPreviousFundementalFrequency(f);
  }

  getOutOfTuneDifference = function(f: number) {
    let MIDI = this.getMIDI(f);
    let fundementalBefore = this.getMIDIToFrequency(MIDI - 1);
    let fundementalAfter = this.getMIDIToFrequency(MIDI + 1);

    return fundementalBefore + " " +
      f + " " +
      fundementalAfter + " /n";
  }
}
