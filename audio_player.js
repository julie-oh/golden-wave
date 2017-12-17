class AudioPlayer {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.dst = this.audioCtx.destination;
    this.bufferSource = this.audioCtx.createBufferSource();
  }

  addLoadEventHandler(fileInputTag) {
    const fileInputElem = document.getElementById(fileInputTag);
    const fileReader = new FileReader();
    fileInputElem.addEventListener("change", function() {
      fileReader.onload = function(e) {
        console.log("debug");
        this.audioCtx.decodeAudioData(e.target.result, function(buffer) {
          this.bufferSource.buffer = buffer;
          this.bufferSource.connect(this.dst);
          this.bufferSource.noteOn(0);
        });
        fileReader.readAsArrayBuffer(this.files[0]);
      }
    }, false);
  }
}
