class Verse {
    constructor(id, surah, ayah, text) {
        this.id = id;
        this.surah = surah;
        this.ayah = ayah;
        this.text = text;
    }
}

// to Arabic digits
String.prototype.toArDgt = function () {
    return this.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
}

function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// ToDo: passer les requetes en JQuery si c'est plus simple
async function getVerse(id) {
    try {
        const res = await fetch(`/api/quran/getVerse/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await res.json()
        return data;
    } catch (err) {
        console.log(err.message)
    }
}

async function getChoices(id) {
    try {
        const res = await fetch(`/api/quran/getChoices/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await res.json()
        return data;
    } catch (err) {
        console.log(err.message)
    }
}


async function getSurah(id) {
    try {
        const res = await fetch(`/api/quran/getSurah/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err.message)
    }
}



/* Partie script */

let round = 1;
let score = 0;

function reloadGame() {
    let percent = "";
    if (round != 1)
        percent = `(${((score / (round - 1)) * 100).toFixed(1)}%)`;

    if (score > 1)
        $("#round").html(`Tour ${round} | <b>${score} points</b> ${percent}`);
    else
        $("#round").html(`Tour ${round} | <b>${score} point</b> ${percent}`);

    displayVerse();
}

async function showSuccessUI(btn) {
    $(btn).addClass("btn-success");
    $(".btn-answers").off('click');
    score++;
    round++;
    // ToDo: store res
    await delay(500);  // ToDo: laisser à l'utilisateur le choix du temps
    reloadGame();
}

async function showFailUI(btn, rightSurah) {
    $(btn).addClass("btn-danger");
    $(".btn-answers").off('click')
    for (let i = 0; i < 4; i++) {
        if ($(`#btn-${i + 1}`).text() == rightSurah)
            $(`#btn-${i + 1}`).addClass("btn-success");
    }
    round++;
    await delay(500);
    reloadGame();
}


function displayVerse() {
    let verse;
    let data = getVerse(randInt(1, 6236));
    $(".btn-answers").removeClass("btn-success");
    $(".btn-answers").removeClass("btn-danger");
    /* <div class="container px-4 px-lg-5 verse-text text-end">
         <p>Verse + digit</p>
       </div> */
    data.then(function (result) {
        verse = new Verse(result.ID, result.SuraID, result.VerseID, result.AyahText);
        data = getChoices(verse.surah);

        data.then(function (choices) {
            // Verse (ToDo: passer en jquery)
            verseSection = document.querySelector("#verse");
            verseSection.innerHTML = "";
            let newDiv = document.createElement("div");
            newDiv.className = "container px-4 px-lg-5 verse-text text-end";
            verseSection.appendChild(newDiv);

            let text = document.createElement("p");
            text.appendChild(document.createTextNode(verse.text + " " + verse.ayah.toString().toArDgt()));
            newDiv.appendChild(text);

            // Answers
            for (let i = 0; i < 4; i++)
                $((`#btn-${i + 1}`)).text(choices[i].Surah);

            getSurah(verse.surah).then(function (rightSurah) {
                // console.log(rightSurah);
                $(".btn-answers").on("click", function (event) {
                    let chosenSurah = $(event.target).text();
                    if (chosenSurah == rightSurah.Surah) {
                        showSuccessUI(event.target);
                    } else {
                        showFailUI(event.target, rightSurah.Surah);
                    }
                });
            });
        });
    })
}


// $(document).on("ready", (function () {
window.addEventListener('DOMContentLoaded', event => {
    reloadGame();

    let scrollToTopVisible = false;

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
