/**
 * Audio Player class for audio playback.
 */
class AudioPlayer {
  constructor(scribble) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.dst = this.audioCtx.destination;
    this.bufferSource = this.audioCtx.createBufferSource();
    this.addLoadEventHandler('audiofile');
    this.analyzer = this.audioCtx.createAnalyser();
    this.analyzer.fftSize = 1024;
    this.scribble = scribble;
  }

  /**
   * Add load event handler for file input.
   * It plays the audio file locally loaded by the user.
   *
   * Arg:
   *  fileInputTag: string indicating id of file input tag
   */
  addLoadEventHandler(fileInputTag) {
    const fileInputElem = document.getElementById(fileInputTag);
    const fileReader = new FileReader();
    fileInputElem.addEventListener('change', () => {
      // reads the file as ArrayBuffer for audio context to decode
      fileReader.onload = (e) => {
        this.audioCtx.decodeAudioData(e.target.result).then((buffer) => {
          this.bufferSource.buffer = buffer;
          this.bufferSource.connect(this.analyzer);
          this.analyzer.connect(this.dst);
          this.bufferSource.start(0);  // start playing right away
          this.drawWaveForm();
        });
      };

      fileReader.readAsArrayBuffer(fileInputElem.files[0]);
    }, false);
  }

  /**
   * Draw wave form -- TESTING.
   */
  drawWaveForm() {
    const analyzer = this.analyzer;
    const bufferSize = analyzer.fftSize;
    const dataArray = new Float32Array(bufferSize);
    const scribble = this.scribble;
    let x = 0;
    let prevY = 0;

    function draw() {
      const drawVisual = requestAnimationFrame(draw);
      analyzer.getFloatTimeDomainData(dataArray);

      for (let i = 0; i < bufferSize; i += 15) {
        const magnitude = dataArray[i] * 1000;
        scribble.scribbleLine(x, prevY, ++x, magnitude);
        console.log(x + ', ' + magnitude);
        prevY = magnitude;

        // right-limit to x value
        if (x > 1024) {
          x = 0;
        }
      }
    }

    draw();
  }
}
