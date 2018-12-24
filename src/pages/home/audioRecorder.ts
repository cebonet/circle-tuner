import { AutoCorrelation } from './autocorrelation'
import { Frequency } from './frequency'
import { AndroidPermissions } from '@ionic-native/android-permissions';


export class AudioRecorder {
    readonly FREQUENCY_MAX_LIMIT = 2200;
    readonly FREQUENCY_MIN_LIMIT = 100;
    autoCorrelation: any;
    frequencyTools: any;
    audioContext: any;
    gainNode: any;
    audioStream: any;
    sampleRate: number;
    bufferSize: number = 1024;
    buffer: any;
    autoCorrelatedbuffer: any;
    androidPermissions: AndroidPermissions;
    amplitude: number;
    frequency: number = 0;

    constructor() {
        this.audioContext = new AudioContext();
        this.autoCorrelation = new AutoCorrelation(this.bufferSize);
        this.frequencyTools = new Frequency(this.bufferSize);
        this.androidPermissions = new AndroidPermissions();
    }

    startRecording = function (onSuccessCaller: Function) {
        console.log("Recording started");
        this.success = function (stream) {
            this.sampleRate = this.audioContext.sampleRate;
            this.gainNode = this.audioContext.createGain();
            this.audioStream = this.audioContext.createMediaStreamSource(stream);
            this.audioStream.connect(this.gainNode);
            let pn = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);

            pn.onaudioprocess = function (e) {
                this.buffer = e.inputBuffer.getChannelData(0);
                this.autoCorrelatedbuffer = this.autoCorrelation.nsd(this.buffer);
                this.frequency = this.frequencyTools.getFrequency(this.autoCorrelatedbuffer, this.sampleRate);
                this.amplitude = this.frequencyTools.getAmplitude(this.buffer);


                // Call only if data is valid
                if (this.frequency != undefined 
                    && isFinite(this.frequency) 
                    && this.note != 'N/A'
                    && this.frequency > this.FREQUENCY_MIN_LIMIT
                    && this.frequency < this.FREQUENCY_MAX_LIMIT){
                    // Callback to function in paramater
                    onSuccessCaller(this.frequency, this.amplitude);
                }
            }.bind(this);
            pn.connect(this.audioContext.destination);
            this.audioStream.connect(pn);
        }
        navigator.getUserMedia = navigator.getUserMedia;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(this.success.bind(this)).catch(function (err) {
            console.log(err);
        });
    }

    askForMicPermission = function (androidPermissions: AndroidPermissions) {
        androidPermissions.checkPermission(androidPermissions.PERMISSION.RECORD_AUDIO).then(
            result => {
                if (!result.hasPermission) {
                    console.log('Asking for permission...')
                    androidPermissions.requestPermissions([androidPermissions.PERMISSION.RECORD_AUDIO, androidPermissions.PERMISSION.GET_ACCOUNTS]);
                }
                console.log('Has mic permission?:', result.hasPermission)
            },
            err => androidPermissions.requestPermission(androidPermissions.PERMISSION.RECORD_AUDIO)
        );
    }
}

