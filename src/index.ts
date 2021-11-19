import './style.scss';

const transitionTime = 2000;

var testState = {
    name: "start"
};

export function start() {
    transition("0")
}

function isInStart() {
    return testState.name == "start";
}

function verifyTestState() {
}

function loadStateFromUrl() {
    testState.name = window.location.hash.substring(1);
    if (document.getElementById(testState.name) == undefined) {
        testState.name = "start";
    }
    setVisible(document.getElementById(testState.name), true);
    saveStateToUrl()
}

function saveStateToUrl() {
    if (isInStart()) {
        window.location.replace(window.location.pathname+"#");
    } else {
        window.location.replace(window.location.pathname+"#"+testState.name)
    }
}

function transition(to: string) {
    let fromElem = document.getElementById(testState.name);
    let toElem = document.getElementById(to);
    
    testState.name = to;
    saveStateToUrl();
    
    setVisible(toElem, true);
    setVisible(fromElem, true);
    fromElem.classList.add("fading-out");
    toElem.classList.add("fading-in");
    
    setTimeout(() => {
        setVisible(fromElem, false);
        fromElem.classList.remove("fading-out");
        toElem.classList.remove("fading-in");
    }, transitionTime);
}

function setVisible(o: HTMLElement, v: boolean) {
    o.style.display = v ? "unset" : "none";
}

document.addEventListener('DOMContentLoaded', () => { loadStateFromUrl() });
