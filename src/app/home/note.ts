// https://en.wikipedia.org/wiki/MIDI_tuning_standard
const base_a4 = 440;

export class Note {
    constructor(){};

    notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    notesSolfeg = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

    // 440 -> 69
    getMIDI = function (f) {
        return Math.round(69 + 12 * Math.log2(f / base_a4));
    }

    // 440Hz -> "Mi"
    getMIDIasNote = function(f,isSolfeg){
        let n = this.getMIDI(f)
        if (n >= 0 && n <= 119){
            if(isSolfeg){
                return this.notesSolfeg[n % 12]
            }
            else{
                return this.notes[n % 12]
            };
        }
        return "N/A";
    }
   
    // 440 -> 4
    getOctave = function(f){
        let n = this.getMIDI(f);
        return  Math.floor((n/12)-1);
    }
   
    // "69" -> 440
    getMIDIToFrequency = function (n){
        var result= 0;
        if (n >= 0 && n <= 128){
            result = base_a4 * Math.pow(2, (n-69)/12 );
        }
        return result;
    }

    // 445 -> 440
    getFundamentalFrequency = function(f){
        return this.getMIDIToFrequency(this.getMIDI(f));
    }

    getNoteScaleSizeFromCenter = function(f){
       //Distance to next neighbour
       return this.getMIDIToFrequency(this.getMIDI(f) + 1) - this.getFundamentalFrequency(f);
    }


    getOutOfTuneDifference = function(f){
        let MIDI = this.getMIDI(f);
        let fundementalBefore = this.getMIDIToFrequency(MIDI-1);
        let fundementalAfter = this.getMIDIToFrequency(MIDI+1);

        return fundementalBefore  + " " + 
               f + " " + 
               fundementalAfter + " /n";
    }

}