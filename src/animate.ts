const transitionTime = 2000;

export function activateOrDeactivateElement(o: HTMLElement, animate: boolean, activate: boolean) {
    if (animate) {
        setVisible(o, true);
        o.classList.add(activate ? "fading-in" : "fading-out");
        setTimeout(() => {
            o.classList.remove(activate ? "fading-in" : "fading-out");
            setVisible(o, activate);
        }, transitionTime);
    } else {
        setVisible(o, activate);
    }
}

export function fadeIn(o: HTMLElement) {
    o.classList.add("fading-in");
    setTimeout(() => {
        o.classList.remove("fading-in");
    }, transitionTime);
}

export function fadeOut(o: HTMLElement) {
    o.classList.add("fading-out");
    setTimeout(() => {
        o.classList.remove("fading-out");
    }, transitionTime);
}

export function setVisible(o: HTMLElement, v: boolean) {
    o.style.display = v ? "unset" : "none";
}
