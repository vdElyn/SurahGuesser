/*!
* Start Bootstrap - Bare v5.0.7 (https://startbootstrap.com/template/bare)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/


class Verse {
    constructor(id, surah, ayah, text) {
        this.id = id;
        this.surah = surah;
        this.ayah = ayah;
        this.text = text;
    }
}

let verses = Array();
verses.push(new Verse(-1, 1, 1, "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ"));
verses.push(new Verse(-1, 2, 96, "وَلَتَجِدَنَّهُمۡ أَحۡرَصَ ٱلنَّاسِ عَلَىٰ حَيَوٰةٖ وَمِنَ ٱلَّذِينَ أَشۡرَكُواْۚ يَوَدُّ أَحَدُهُمۡ لَوۡ يُعَمَّرُ أَلۡفَ سَنَةٖ وَمَا هُوَ بِمُزَحۡزِحِهِۦ مِنَ ٱلۡعَذَابِ أَن يُعَمَّرَۗ وَٱللَّهُ بَصِيرُۢ بِمَا يَعۡمَلُونَ"));
verses.push(new Verse(-1, 2, 282, "بِٱلۡعَدۡلِۚ وَلَا يَأۡبَ كَاتِبٌ أَن يَكۡتُبَ كَمَا عَلَّمَهُ ٱللَّهُۚ فَلۡيَكۡتُبۡ وَلۡيُمۡلِلِ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ وَلۡيَتَّقِ ٱللَّهَ رَبَّهُۥ وَلَا يَبۡخَسۡ مِنۡهُ شَيۡـٔٗاۚ فَإِن كَانَ ٱلَّذِي عَلَيۡهِ ٱلۡحَقُّ سَفِيهًا أَوۡ ضَعِيفًا أَوۡ لَا يَسۡتَطِيعُ أَن يُمِلَّ هُوَ فَلۡيُمۡلِلۡ وَلِيُّهُۥ بِٱلۡعَدۡلِۚ وَٱسۡتَشۡهِدُواْ شَهِيدَيۡنِ مِن رِّجَالِكُمۡۖ فَإِن لَّمۡ يَكُونَا رَجُلَيۡنِ فَرَجُلٞ وَٱمۡرَأَتَانِ مِمَّن تَرۡضَوۡنَ مِنَ ٱلشُّهَدَآءِ أَن تَضِلَّ إِحۡدَىٰهُمَا فَتُذَكِّرَ إِحۡدَىٰهُمَا ٱلۡأُخۡرَىٰۚ وَلَا يَأۡبَ ٱلشُّهَدَآءُ إِذَا مَا دُعُواْۚ وَلَا تَسۡـَٔمُوٓاْ أَن تَكۡتُبُوهُ صَغِيرًا أَوۡ كَبِيرًا إِلَىٰٓ أَجَلِهِۦۚ ذَٰلِكُمۡ أَقۡسَطُ عِندَ ٱللَّهِ وَأَقۡوَمُ لِلشَّهَٰدَةِ وَأَدۡنَىٰٓ أَلَّا تَرۡتَابُوٓاْ إِلَّآ أَن تَكُونَ تِجَٰرَةً حَاضِرَةٗ تُدِيرُونَهَا بَيۡنَكُمۡ فَلَيۡسَ عَلَيۡكُمۡ جُنَاحٌ أَلَّا تَكۡتُبُوهَاۗ وَأَشۡهِدُوٓاْ إِذَا تَبَايَعۡتُمۡۚ وَلَا يُضَآرَّ كَاتِبٞ وَلَا شَهِيدٞۚ وَإِن تَفۡعَلُواْ فَإِنَّهُۥ فُسُوقُۢ بِكُمۡۗ وَٱتَّقُواْ ٱللَّهَۖ وَيُعَلِّمُكُمُ ٱللَّهُۗ وَٱللَّهُ بِكُلِّ شَيۡءٍ عَلِيمٞ"));
verses.push(new Verse(-1, 68, 1, "نٓۚ وَٱلۡقَلَمِ وَمَا يَسۡطُرُونَ"))

// to Arabic digits
String.prototype.toArDgt= function() {
    return this.replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
}


let actualVerse = 0;

function displayVerse() {
    /*
    <div class="container px-4 px-lg-5 verse-text text-end">
        <p>Verse + digit</p>
    </div>
    */
    verseSection = document.querySelector("#verse");
    verseSection.innerHTML = "";
    let newDiv = document.createElement("div");
    newDiv.className = "container px-4 px-lg-5 verse-text text-end";
    verseSection.appendChild(newDiv);

    let text = document.createElement("p");
    text.appendChild(document.createTextNode(verses[actualVerse].text + " " + verses[actualVerse].ayah.toString().toArDgt()));
    newDiv.appendChild(text);

    actualVerse++;
    if (actualVerse == verses.length) actualVerse = 0;
}



/* From Portfolio */
window.addEventListener('DOMContentLoaded', event => {

    displayVerse();

    let btn = document.querySelector("#btn-1");
    btn.addEventListener("click", displayVerse, true);

    let scrollToTopVisible = false;
    /*
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }
    */

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
