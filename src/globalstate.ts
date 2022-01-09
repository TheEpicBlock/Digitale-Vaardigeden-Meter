import * as Tests from './tests'
import * as States from './state'

var globalState: States.State;

export function get() {
    return globalState;
}

export function set(state: States.State) {
    globalState = state;
}

export function switchState(newState: States.State) {
    get().setVisibility(true, false);
    newState.setVisibility(true, true);
    set(newState);
    saveStateToUrl();
}

function switchStateWithoutAnimation(newState: States.State) {
    get().setVisibility(false, false);
    newState.setVisibility(false, true);
    set(newState);
    saveStateToUrl();
}

export function toTest(id: number) {
    switchState(new States.TestState(Tests.getById(id)));
}

export function toNextTest() {
    var state = get();
    if (state instanceof States.TestState) {
        toTest(state.test.id+1);
    }
}

function saveStateToUrl() {
    window.location.replace(window.location.pathname+"#"+get().toUrlString());
}

function loadStateFromUrl() {
    set(new States.StartState()); // The html starts with start state always loaded already
    let hash = window.location.hash.substring(1);
    
    switchStateWithoutAnimation(States.fromUrlString(hash));
}

document.addEventListener('DOMContentLoaded', () => { loadStateFromUrl() });
