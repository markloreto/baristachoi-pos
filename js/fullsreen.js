var isFullScr = false;
function isFullScreen() {
    isFullScr = true
}

function notFullScreen() {
    isFullScr = false;
    if($("#POSPage").hasClass("visible")){
        $("#mainMenu a:first").click()
    }
}
document.addEventListener("fullscreenchange", function () {
    if (document.fullscreen) {
        isFullScreen();
    } else {
        notFullScreen();
    }
}, false);

document.addEventListener("mozfullscreenchange", function () {
    if (document.mozFullScreen) {
        isFullScreen();
    } else {
        notFullScreen();
    }
}, false);

document.addEventListener("webkitfullscreenchange", function () {
    if (document.webkitIsFullScreen) {
        isFullScreen();
    } else {
        notFullScreen();
    }
}, false);

function toggleFullScreen() {
    if(!isFullScr && settings.fullscreen == true){
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

}
