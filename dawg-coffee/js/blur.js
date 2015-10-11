var header = document.getElementsByClassName('header').item();

function blur(element, brightness, blur) {
    var filter = 'brightness(' + brightness + '%) blur(' + blur + 'px)';
    var debug = 0;
    if (debug) {
        console.log(filter);
    } else {
        element.style.webkitFilter = filter;
        element.style.filter = filter;
    }
}

function calcBrightness() {
    var brightness = 100 - 0.25 * window.pageYOffset;
    var MIN_BRIGHTNESS = 85;
    if (brightness < MIN_BRIGHTNESS) {
        brightness = MIN_BRIGHTNESS;
    }
    return brightness;
}

function calcBlur() {
    return 0.03 * window.pageYOffset;
}

function onScrollEventHandler(ev) {
    console.log(window.pageYOffset);
    blur(header, calcBrightness(), calcBlur());
    
}

window.addEventListener('scroll', onScrollEventHandler, false);   
