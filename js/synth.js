let synth = new Tone.Synth({
    "oscillator": {
        "type": "fatcustom",
        "partials": [0.2, 1, 0, 0.5, 0.1],
        "spread": 40,
        "count": 3
    },
    "envelope": {
        "attack": 0.01,
        "decay": 1.6,
        "sustain": 0,
        "release": 1.6
    }
}).toDestination();
window.addEventListener("load", () => {
    Tone.context.resume();
    document.documentElement.addEventListener(
      "mousedown", function(){
        mouse_IsDown = true;
        if (Tone.context.state !== 'running') {
        
        }
      })


    $("#slider1").roundSlider({
      handleShape: "round",
      width: 15,
      radius: 30,
      value: 3,
      sliderType: "min-range",
      lineCap: "square",
      mouseScrollAction: true,
      min: 1,
      max: "10",
      step: "0.01",
      showTooltip: false,

      change: function (args) {
        synth.oscillator.count = args.value;
      }
    });


    $("#slider2").roundSlider({
      handleShape: "round",
      width: 15,
      radius: 30,
      value: 40,
      sliderType: "min-range",
      lineCap: "square",
      mouseScrollAction: true,
      min: 0,
      max: "20000",
      step: "0.01",
      showTooltip: false,

      change: function (args) {
        synth.oscillator.spread = args.value;
      }
    });

    





    $("#attack-input").slider({reversed: true});
    $("#decay-input").slider({reversed: true});
    $("#sustain-input").slider({reversed: true});
    $("#release-input").slider({reversed: true});
    $("#count-input").slider({reversed: true});
    $("#spread-input").slider({reversed: true});

    const piano = document.querySelector("#piano")
    const pianoKeys = document.querySelectorAll("#piano li")

    $(".sliderSettings").change((e) => {
        setting = $(e.currentTarget).attr('id').split('-')[0];
        categorySetting = $(e.currentTarget).parents().parents().parents().attr('id');
        synth[categorySetting][setting] = Number($(`#${setting}-input`).val());
    });


    $("#setting-reset").click(() => resetSynth());

    piano.addEventListener("touchstart", e => {
      let audioContext = true;
      if (audioContext){
        Tone.context.resume().then(() => {
          synth.triggerAttack(e.target.dataset.note);
          audioContext = false;
        });

      }
      $(`[data-note='${e.target.dataset.note}']`).addClass('active').click();
      e.stopPropagation();
      e.preventDefault(); 
    });

    piano.addEventListener("touchend", e => {
      synth.triggerRelease();
      $(`[data-note='${e.target.dataset.note}']`).removeClass('active');
      e.stopPropagation(); 
      e.preventDefault(); 
  });



    piano.addEventListener("mousedown", e => {
        synth.triggerAttack(e.target.dataset.note);
    });


    piano.addEventListener("mouseup", e => {
        synth.triggerRelease();
    });


    let liste = [];
    let is_record = false;
    // let gammes = ["C", "D", "E", "F", "G", "A", "B"];
    const gammeRecord = ["C", "CS", "D", "DS", "E", "F", "FS", "G", "GS", "A", "AS", "B"];
    document.querySelector("#record").onclick = () => {
        liste = [];
        document.querySelector('#record').classList.add('hidden');
        document.querySelector('#play').classList.add('hidden');
        document.querySelector('#stop').classList.remove('hidden');

        is_record = true;

        pianoKeys.forEach((pad, index) => {
            pad.addEventListener(
                "click",
                function() {
                    if (is_record) {
                        var temps = Date.now();
                        liste.push({
                            temps: temps,
                            pad2: document.querySelector(`.${gammeRecord[index]}`),
                        });
                    };
                },
                false
            );

        });
    };


    document.querySelector("#stop").onclick = () => {
        document.querySelector('#stop').classList.add('hidden');
        document.querySelector('#play').classList.remove('hidden');
        document.querySelector('#record').classList.remove('hidden');
        is_record = false;
    };


    document.querySelector("#play").onclick = () => {
        // console.log(liste)

        for (let i = 0; i < liste.length; i++) {
            const item = liste[i];
            if (i == 0) {
                delay = 0;
            } else {
                delay += liste[i].temps - liste[i - 1].temps;
            };

            setTimeout(() => {
                item.pad2.classList.add('active');
                synth.triggerAttack(item.pad2.dataset.note);
                setTimeout(() => {
                    item.pad2.classList.remove('active');
                  }, 100);
                  

            }, delay);

        };
        synth.triggerRelease();
    };
});


document.onkeydown = function(e) {
    switch (e.key) {
        case "a":
          $('[data-note=C4]').addClass('active').click();
          return synth.triggerAttack("C4");
        case "é":
          $('[data-note="C#4"]').addClass('active').click();
          return synth.triggerAttack("C#4");
        case "z":
          $('[data-note=D4]').addClass('active').click();
          return synth.triggerAttack("D4");
        case '"':
          $('[data-note="D#4"]').addClass('active').click();
          return synth.triggerAttack("D#4");
        case "e":
          $('[data-note=E4]').addClass('active').click();
          return synth.triggerAttack("E4");
        case "r":
          $('[data-note=F4]').addClass('active').click();
          return synth.triggerAttack("F4");
        case "(":
          $('[data-note="F#4"]').addClass('active').click();
          return synth.triggerAttack("F#4");
        case "t":
          $('[data-note=G4]').addClass('active').click();
          return synth.triggerAttack("G4");
        case "i":
          $('[data-note="G#4"]').addClass('active').click();
          return synth.triggerAttack("G#4");
        case "y":
          $('[data-note=A4]').addClass('active').click();
          return synth.triggerAttack("A4");
        case "è":
          $('[data-note="A#4"]').addClass('active').click();
          return synth.triggerAttack("A#4");
        case "u":
          $('[data-note=B4]').addClass('active').click();
          return synth.triggerAttack("B4");
        default:
          return;
      }
};

document.addEventListener("keyup", e => {
    switch (e.key) {
        case "a":
          $('[data-note=C4]').removeClass('active');
          return synth.triggerRelease(); 
        case "é":
          $('[data-note="C#4"]').removeClass('active');
          return synth.triggerRelease(); 
        case "z":
          $('[data-note=D4]').removeClass('active');
          return synth.triggerRelease(); 
        case '"':
          $('[data-note="D#4"]').removeClass('active');
          return synth.triggerRelease(); 
        case "e":
          $('[data-note=E4]').removeClass('active');
          return synth.triggerRelease(); 
        case "r":
          $('[data-note=F4]').removeClass('active');
          return synth.triggerRelease(); 
        case "(":
          $('[data-note="F#4"]').removeClass('active');
          return synth.triggerRelease(); 
        case "t":
          $('[data-note=G4]').removeClass('active');
          return synth.triggerRelease(); 
        case "i":
          $('[data-note="G#4"]').removeClass('active');
          return synth.triggerRelease(); 
        case "y":
          $('[data-note=A4]').removeClass('active');
          return synth.triggerRelease(); 
        case "è":
          $('[data-note="A#4"]').removeClass('active');
          return synth.triggerRelease(); 
        case "u":
          $('[data-note=B4]').removeClass('active');
          return synth.triggerRelease(); 
        default:
          return;
    }
});


resetSynth = () => {
    synth.oscillator.spread = 40;
    synth.oscillator.count = 3;
    synth.envelope.attack = 0.01;
    synth.envelope.decay = 1.6;
    synth.envelope.sustain = 0;
    synth.envelope.release = 1.6;
    $('#attack-input').slider('refresh', { useCurrentValue: false });
    $('#decay-input').slider('refresh', { useCurrentValue: false });
    $('#sustain-input').slider('refresh', { useCurrentValue: false });
    $('#release-input').slider('refresh', { useCurrentValue: false });
    $('#count-input').slider('refresh', { useCurrentValue: false });
    $('#spread-input').slider('refresh', { useCurrentValue: false });
    $("#slider1").roundSlider({value:3})
    $("#slider2").roundSlider({value:40})
}