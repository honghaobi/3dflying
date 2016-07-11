
  var context, soundSource, soundBuffer, url = 'sound/up.mp3';

  function initMusic() {
      if (typeof AudioContext !== "undefined") {
          context = new AudioContext();
      } else if (typeof webkitAudioContext !== "undefined") {
          context = new webkitAudioContext();
      } else {
          throw new Error('AudioContext not supported. :(');
      }
  }

  // Step 2: Load our Sound using XHR

  function startBgMusic() {
      // Note: this loads asynchronously
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      // Our asynchronous callback
      request.onload = function() {
          var audioData = request.response;

          audioGraph(audioData);

      };

      request.send();
  }

  // Finally: tell the source when to start

  function playSound() {
      // play the source now
      soundSource.start(context.currentTime);
  }

  function stopBgMusic() {
      // stop the source now
      soundSource.stop(context.currentTime);
  }



  // Events for the play/stop bottons
  // document.querySelector('.play').addEventListener('click', startSound);
  // document.querySelector('.stop').addEventListener('click', stopSound);






  // This is the code we are interested in:


  function audioGraph(audioData) {
      soundSource = context.createBufferSource();
      context.decodeAudioData(audioData, function(soundBuffer){
          soundSource.buffer = soundBuffer;

          volumeNode = context.createGain();

          //Set the volume
          volumeNode.gain.value = 0.3;

          // Wiring
          soundSource.connect(volumeNode);
          volumeNode.connect(context.destination);

          // Get analyzer

          analyser = context.createAnalyser();
          analyser.smoothingTimeConstant = 0.75;
          analyser.fftSize = 2048;


          // Finally
          playSound(soundSource);
      });
  }
