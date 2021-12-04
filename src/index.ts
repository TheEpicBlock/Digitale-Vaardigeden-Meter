import './style.scss'
import * as States from './state'
import * as Tests from './tests'
import * as GS from './globalstate'

export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}

function loadStateFromUrl() {
    let hash = window.location.hash.substring(1);
    
    GS.set(new States.StartState());
    GS.get().setVisibility(false, true);
}

document.addEventListener('DOMContentLoaded', () => { loadStateFromUrl() });

function saveStateToUrl() {
    window.location.replace(window.location.pathname+"#"+GS.get().toUrlString());
}
