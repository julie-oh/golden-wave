/**
 * Audio Player class for audio playback.
 */
class AudioPlayer {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.dst = this.audioCtx.destination;
    this.bufferSource = this.audioCtx.createBufferSource();
    this.addLoadEventHandler('audiofile');
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
          this.bufferSource.connect(this.dst);
          this.bufferSource.start(0);  // start playing right away
        });
      }

      fileReader.readAsArrayBuffer(fileInputElem.files[0]);
    }, false);
  }
}
