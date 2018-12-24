export class AutoCorrelation {
    constructor(private window_size: number) { }

    nsd(data) {
        let output: number[] = [];
        let acf: number;
        let divisorM: number;
        for (var tau = 0; tau < this.window_size; tau++) {
            acf = 0;
            divisorM = 0;
            for (var i = 0; i < this.window_size - tau; i++) {
                acf += data[i] * data[i + tau];
                divisorM += data[i] * data[i] + data[i + tau] * data[i + tau];
            }
            output[tau] = 2.0 * acf / divisorM;
        }
        return output;
    }
}