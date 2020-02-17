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

    $("#attack-input").slider({reversed: true});
    $("#decay-input").slider({reversed: true});
    $("#sustain-input").slider({reversed: true});
    $("#release-input").slider({reversed: true});
    $("#count-input").slider({reversed: true});
    $("#spread-input").slider({reversed: true});

    const sounds = document.querySelectorAll(".sound");
    const piano = document.querySelectorAll(".piano li")
    const gamme = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


    $(".sliderSettings").change((e) => {
        setting = $(e.currentTarget).attr('id').split('-')[0];
        categorySetting = $(e.currentTarget).parents().parents().parents().attr('id');
        console.log(categorySetting)
        synth[categorySetting][setting] = Number($(`#${setting}-input`).val());
    });

    $("#setting-reset").click(() => resetSynth());
    piano.forEach((key, index) => {
        key.addEventListener("click", function() {
            // gamme = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            synth.triggerAttackRelease(gamme[index] + '4', 0.5)

            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 200);
        });
    });


    let liste = [];
    let is_record = false;
    // let gammes = ["C", "D", "E", "F", "G", "A", "B"];
    const gammeRecord = ["C", "CS", "D", "DS", "E", "F", "FS", "G", "GS", "A", "AS", "B"];
    document.querySelector("#record").onclick = () => {
        liste = [];
        document.querySelector('#record').classList.add('d-none');
        document.querySelector('#play').classList.add('d-none');
        document.querySelector('#stop').classList.remove('d-none');

        is_record = true;

        piano.forEach((pad, index) => {
            pad.addEventListener(
                "click",
                function() {
                    if (is_record) {
                        var temps = Date.now();
                        liste.push({
                            son: sounds[index],
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
        document.querySelector('#stop').classList.add('d-none');
        document.querySelector('#play').classList.remove('d-none');
        document.querySelector('#record').classList.remove('d-none');
        is_record = false;
    };


    document.querySelector("#play").onclick = () => {

        for (let i = 0; i < liste.length; i++) {
            const item = liste[i];
            if (i == 0) {
                delay = 0;
            } else {
                delay += liste[i].temps - liste[i - 1].temps;
            };

            setTimeout(() => {
                item.pad2.classList.add('active');
                item.pad2.click();
                setTimeout(() => {
                    item.pad2.classList.remove('active');
                }, 100);

            }, delay);
        };

    };
});


document.onkeypress = function(e) {
    shortcuts =         ["a",  "é", "z", '"',  "e", "r", "(",  "t", "-",  "y", "è",  "u"];
    // gammes = ["C", "D", "E", "F", "G", "A", "B"];
    const gammeRecord = ["C", "CS", "D", "DS", "E", "F", "FS", "G", "GS", "A", "AS", "B"];

    shortcuts.forEach((shortcut, i) => {
        if (e.key == shortcut) {
            document.querySelector(`li.${gammeRecord[i]}`).click();
        };
    });
};

// document.onkeypress = function(e) {
//     shortcuts = ["é", '"', "'", "r", "-", "è"];
//     gammes = ["C", "D", "E", "F", "G", "A", "B"];
// }



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
}