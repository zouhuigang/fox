(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var context = require('./Context');

Zepto( function($) {
  var Sequencer = require('./Sequencer');
  var Input     = require('./Input');
  var Sampler   = require('./Sampler');

  var timer = null;

  var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
  if(iOS) {
    $('[data-play-button]').show().on('click', function(e) {
      // play an empty buffer to unmute the iOS AudioContext
      var buffer = context.createBuffer(1, 1, 22050);
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
      source.stop(context.currentTime + 0.01);

      $(this).hide();
      $('textarea').focus();
    }).show();
  }

  $('[data-share]').on('click', function(e) {
    timer = clearTimeout(timer);

    var text = $('textarea').val();

    if(!text) {
      $('[data-link]').text('you need to type something first!');
      timer = setTimeout(function() {
        $('[data-link]').text('');
      }, 2000);
      return;
    }

    $.post('/share', { text: text, samples: $('body').attr('data-samples') }, function(link) {
      $('[data-link]').html( 'your beat is here: ' + link.link(link) );
    });
  });
});
},{"./Context":3,"./Input":4,"./Sampler":5,"./Sequencer":6}],2:[function(require,module,exports){
// an abstraction written by Boris Smus,
// taken from http://www.html5rocks.com/en/tutorials/webaudio/intro/
// ... thanks Boris!

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

module.exports = BufferLoader;
},{}],3:[function(require,module,exports){
var ac = window.AudioContext || window.webkitAudioContext;
var context = new ac();
module.exports = context;
},{}],4:[function(require,module,exports){
var Sequencer = require('./Sequencer');

function Input() {
  var self = this;

  var currentSequence = $('textarea').val();

  $('textarea').on('keydown', function(e) {
    var sequence = $(this).val();
    if(sequence.length > 102) {
      $(this).val( sequence.substr(0,102) );
    }
  });

  $('textarea').on('keyup', function(e) {
    var sequence = $(this).val().toLowerCase();
    if(sequence !== currentSequence) {
      currentSequence = sequence;
      parseSequence();
    }
  });

  function parseSequence() {

    var notes = [];
    var triplets = false;

    for(var i = 0; i < currentSequence.length; i++) {

      if(currentSequence[i] === '(') {
        triplets = true;
        continue;
      } else if(currentSequence[i] === ')') {
        triplets = false;
        continue;
      }
      if(triplets) {
        notes.push( new Sequencer.Triplet(currentSequence[i]) );
      } else {
        notes.push( new Sequencer.Note(currentSequence[i]) );
      }
    }

    Sequencer.set(notes);
  }

  self.check = function() {
    parseSequence();
  };
}

var input = new Input();
module.exports = input;
},{"./Sequencer":6}],5:[function(require,module,exports){
var context      = require('./Context');
var BufferLoader = require('./BufferLoader');

// The sampler turns ascii notes into indices from the self.samples array.

function Sampler() {
  // ### properties ###
  var self     = this;
  self.samples = [];

  self.mbOnLoad = false;
  self.originalSamples = [];
  self.mbSamples = [];

  self.sampleFiles = [
    '/static/mp3/audio/a.mp3', '/static/mp3/audio/b.mp3', '/static/mp3/audio/c.mp3', '/static/mp3/audio/d.mp3', '/static/mp3/audio/e.mp3', '/static/mp3/audio/f.mp3', '/static/mp3/audio/g.mp3',
    '/static/mp3/audio/h.mp3', '/static/mp3/audio/i.mp3', '/static/mp3/audio/j.mp3', '/static/mp3/audio/k.mp3', '/static/mp3/audio/l.mp3', '/static/mp3/audio/m.mp3', '/static/mp3/audio/n.mp3',
    '/static/mp3/audio/o.mp3', '/static/mp3/audio/p.mp3', '/static/mp3/audio/q.mp3', '/static/mp3/audio/r.mp3', '/static/mp3/audio/s.mp3', '/static/mp3/audio/t.mp3', '/static/mp3/audio/u.mp3',
    '/static/mp3/audio/v.mp3', '/static/mp3/audio/w.mp3', '/static/mp3/audio/x.mp3', '/static/mp3/audio/y.mp3', '/static/mp3/audio/z.mp3'
  ];

  self.mbSampleFiles = [
    '/static/mp3/audio/mb/a.mp3', '/static/mp3/audio/mb/b.mp3', '/static/mp3/audio/mb/c.mp3', '/static/mp3/audio/mb/d.mp3', '/static/mp3/audio/mb/e.mp3', '/static/mp3/audio/mb/f.mp3', '/static/mp3/audio/mb/g.mp3',
    '/static/mp3/audio/mb/h.mp3', '/static/mp3/audio/mb/i.mp3', '/static/mp3/audio/mb/j.mp3', '/static/mp3/audio/mb/k.mp3', '/static/mp3/audio/mb/l.mp3', '/static/mp3/audio/mb/m.mp3', '/static/mp3/audio/mb/n.mp3',
    '/static/mp3/audio/mb/o.mp3', '/static/mp3/audio/mb/p.mp3', '/static/mp3/audio/mb/q.mp3', '/static/mp3/audio/mb/r.mp3', '/static/mp3/audio/mb/s.mp3', '/static/mp3/audio/mb/t.mp3', '/static/mp3/audio/mb/u.mp3',
    '/static/mp3/audio/mb/v.mp3', '/static/mp3/audio/mb/w.mp3', '/static/mp3/audio/mb/x.mp3', '/static/mp3/audio/mb/y.mp3', '/static/mp3/audio/mb/z.mp3'
  ];

  self.samplesToLoad = self.sampleFiles;

  // which samples are we loading?
  if($('body').attr('data-samples') === 'mb') {
    self.mbOnLoad = true;
    self.samplesToLoad = self.mbSampleFiles;
  }

  /// ### api ###
  self.schedule = function(note, time) {
    if(note.note === ' ') {
      return;
    }

    var index = asciiToIndex(note.note);

    if(index !== null && index < self.samples.length) {
      var source = context.createBufferSource();
      source.buffer = self.samples[index];
      source.connect(context.destination);
      source.start(time);
    }
  };

  function asciiToIndex(letter) {
    var code = letter.charCodeAt(0) - 97;
    if(code >= 0 && code < 26) {
      return code;
    } else {
      return null;
    }
  }

  // ### INIT ###

  var bufferLoader = new BufferLoader(
    context,
    self.samplesToLoad,
    function(list) {
      self.samples = list;
      var Sequencer = require('./Sequencer');
      var Input = require('./Input');
      Input.check();
      Sequencer.start();
      if(!self.mbOnLoad) {
        self.originalSamples = list;
      }
    }
  );
  bufferLoader.load();

  // ================================================================
  // MOON BOUNCE SAMPLE PACK STUFF
  // ================================================================

  $('[data-load-samples]').click(loadMbSamples);

  // for switching back
  $('body').on('click', '[data-switch-samples]', function(e) {
    // do we have the original samples yet?
    if(self.mbOnLoad) {
      loadOriginalSamples(showSwitchToMbMessage);
    } else {
      showSwitchToMbMessage();
      self.samples = self.originalSamples;
    }
  });

  // switch back againnnn
  $('body').on('click', '[data-mb-samples]', function(e) {
    if(self.mbSamples.length) {
      self.samples = self.mbSamples;
      showMbMessage();
    } else {
      loadMbSamples();
    }
  });

  function loadMbSamples() {
    // load the new samples and set them
    var bufferLoader = new BufferLoader(
      context,
      self.mbSampleFiles,
      function(list) {
        self.samples = list;
        self.mbSamples = list;
        showMbMessage();
      }
    );
    bufferLoader.load();
  }

  function loadOriginalSamples(cb) {
    // load the new samples and set them
    var bufferLoader = new BufferLoader(
      context,
      self.sampleFiles,
      function(list) {
        self.samples = list;
        self.samples = list;
        cb();
      }
    );
    bufferLoader.load();
  }

  function showMbMessage() {
    // we have MB samples loaded.
    $('body').attr('data-samples', 'mb');
    // change the interface
    $('.sample-message').html(
      '<a href="https://grindselect.bandcamp.com/album/fool-echo-back">Moon Bounce</a> --<a href="https://soundcloud.com/moonbounce/fool">《Fool》</a><br/><span data-switch-samples>返回默认音调</span>'
    );
  }

  function showSwitchToMbMessage() {
    // no special samples
    $('body').attr('data-samples', '');
    // change the interface
    $('.sample-message').html(
      '<div class="load-samples" data-mb-samples>换一个音调</div>'
    );
  }
}

var sampler = new Sampler();
module.exports = sampler;
},{"./BufferLoader":2,"./Context":3,"./Input":4,"./Sequencer":6}],6:[function(require,module,exports){
var context = require('./Context');
var Sampler = require('./Sampler');

/*

Sequencer keeps track of the last hit's timestamp and uses that to
determine when the next note will be struck. This allows us to add
new note lengths in the future without touching this file.

*/

function Sequencer() {
  var self = this;

  // private jibjabs
  var lastNote      = context.currentTime;
  var pattern       = [];
  var index         = 0;
  var lookahead     = 25;
  var scheduleahead = 0.05;
  var nexttick      = 0;
  var timerId       = null;

  var QUARTER = 0.25;

  // private API
  function tick() {
    while(nexttick < context.currentTime + scheduleahead) {
      if(index >= pattern.length) {
        index = 0;
      }
      if(pattern.length) {
        nexttick += pattern[index].length;
        Sampler.schedule( pattern[index], nexttick );
        index++;
      } else {
        nexttick += QUARTER;
      }
    }
  }

  // public API
  self.set = function(p) {
    pattern = p;
  };

  self.Note = function(note) {
    this.length = QUARTER;
    this.note = note;
  };

  self.Triplet = function(note) {
    this.length = 2*QUARTER/3;
    this.note = note;
  };

  self.start = function() {
    // hack to get the clock to start immediately
    self._temporaryBuffer = context.createBufferSource();
    delete self._temporaryBuffer;
    // end hack.
    timerId = setInterval(tick, lookahead);
  };

  self.stop = function() {
    clearInterval(timerId);
  };
}

var sequencer = new Sequencer();
module.exports = sequencer;
},{"./Context":3,"./Sampler":5}]},{},[1]);
