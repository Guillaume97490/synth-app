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

document.addEventListener('DOMContentLoaded', function(){ 

    $("#attack-input").slider({
        reversed : true
    });
    $("#v-decay").slider({
        reversed : true
    });
    $("#v-sustain").slider({
        reversed : true
    });
    $("#v-release").slider({
        reversed : true
    });

}, false);



window.addEventListener("load", () => {
    const sounds = document.querySelectorAll(".sound");
    const piano = document.querySelectorAll(".piano .white")
    const visual = document.querySelector(".visual");
    const colors = [
        "#60d394",
        "#d36060",
        "#c060d3",
        "#d3d160",
        "#606bd3",
        "#60c2d3",
        "#d39d60"
    ];

    $(".sliderSettings").change((e) => {
        setting = $(e.currentTarget).attr('id').split('-')[0];
        categorySetting = $(e.currentTarget).parents().parents().parents().attr('id');
        synth[categorySetting][setting] = Number($(`#${setting}-input`).val());
    });

    $("#setting-reset").click(() => resetSynth());
    piano.forEach((key, index) => {
        key.addEventListener("click", function() {
            gamme = ["C", "D", "E", "F", "G", "A", "B"];
            synth.triggerAttackRelease(gamme[index] + '4', 0.5)

            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 200);
            // createBubble(index);
        });
    });


    const createBubble = index => {
        const bubble = document.createElement("div");
        visual.appendChild(bubble);
        bubble.style.backgroundColor = colors[index];
        bubble.style.animation = `jump 10s linear`;
        bubble.addEventListener("animationend", function() {
            visual.removeChild(this);
        });
    };


    let liste = [];
    let is_record = false;
    let gammes = ["C", "D", "E", "F", "G", "A", "B"];
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
                            pad2: document.querySelector(`.${gammes[index]}`),
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
    shortcuts = ["a", "z", "e", "r", "t", "y", "u"];
    gammes = ["C", "D", "E", "F", "G", "A", "B"];

    shortcuts.forEach((shortcut, i) => {
        if (e.key == shortcut) {
            document.querySelector(`.white.${gammes[i]}`).click();
        };
    });

};

resetSynth = () => {
    synth.oscillator.spread = 40;
    synth.oscillator.count = 3;
    synth.envelope.attack = 0.01;
    synth.envelope.decay = 1.6;
    synth.envelope.sustain = 0;
    synth.envelope.release = 1.6;
    $("#attack-input").val(synth.envelope.attack);
    $("#decay-input").val(synth.envelope.decay);
    $("#sustain-input").val(synth.envelope.sustain);
    $("#release-input").val(synth.envelope.release);
    $("#count-input").val(synth.oscillator.count);
    $("#spread-input").val(synth.oscillator.spread);
}