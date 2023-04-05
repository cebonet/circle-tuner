export class Frequency {

  constructor(private window_size: number) {
  }

  getFrequency = function(autoCorBuffer: number[], sampleRate: number) {
    let period = this.getFirstKeyMaxima(autoCorBuffer);
    return sampleRate / period;
  }
  // Returns maximum peak
  get_n_max(data) {
    var max = -1;
    for (let i = 0; i < this.window_size; i++) {
      if (i > 0 && data[i] > max && data[i - 1] < data[i]) {
        max = data[i];
      }
    }
    return max;
  }

  getAmplitude = function(data) {
    let max: number = 0;
    let average: number = 0;
    let val: number = 0;
    for (let i = 0; i < this.window_size; i++) {
      val = data[i];
      if (val < 0) val = -val;
      if (val > max) {
        max = val;
      }
      average += val;
    }
    average = average / this.window_size;
    return average;
  }


  // Returns first of the maximas occuring after a
  // zero crossed positive slope ending with a 
  // with a negatively sloped zero crossing.
  getFirstKeyMaxima(data) {
    let zerocrossed = false;
    let n_max = this.get_n_max(data);
    let max = -1;
    let max_x = 0;

    for (var i = 0; i < this.window_size; i++) {
      if (i > 0) {
        if (data[i - 1] < 0 && data[i] >= 0) {
          zerocrossed = true;
        }
        if (data[i - 1] > 0 && data[i] <= 0 && zerocrossed) {
          if (this.inside_threshold(max, n_max)) {
            return max_x + this.qint_x(data, max_x); // add 'real' key maxima
          }
          zerocrossed = false;
          max = 0;
        }
        if (zerocrossed && i == this.window_size - 1) {
          if (this.inside_threshold(max, n_max)) {
            return this.qint_x(data, max_x); // add last key maxima without negative zero
          }
          max = 0;
        }
        if (zerocrossed && data[i - 1] < data[i] && data[i + 1] < data[i]) {
          if (data[i] > max) {
            max = data[i];
            max_x = i;
          }
        }
      }
    }
    return 0;
  }

  // Define the threshold for accepted peaks
  inside_threshold(candidate, n_max) {
    return (candidate >= (n_max * 0.8));
  }


  //QINT_X - quadratic interpolation of three adjacent samples
  qint_x(data, i) {
    let alpha = data[i - 1];
    let beta = data[i];
    let gamma = data[i + 1];
    return 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
  }

  //QINT_Y - quadratic interpolation of three adjacent samples
  qint_y(data, i) {
    let alpha = data[i - 1];
    let beta = data[i];
    let gamma = data[i + 1];
    let p = this.qint_x(data, i);
    return beta - 0.25 * (alpha - gamma) * p;
  }
}
