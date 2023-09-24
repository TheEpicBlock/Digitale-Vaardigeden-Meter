import * as Tests from './tests'
import { TestResult } from './tests'
import * as States from './pagestate'
import { ProgressTracker } from './progresstracker'

var globalState: States.PageState;
var globalProgress: ProgressTracker = new ProgressTracker();

export function getGlobalProgress() {
    return globalProgress;
}

export function get() {
    return globalState;
}

export function set(state: States.PageState) {
    globalState = state;
}

export function switchState(newState: States.PageState) {
    get().setVisibility(true, false);
    newState.setVisibility(true, true);
    set(newState);
    saveStateToUrl();
}

function switchStateWithoutAnimation(newState: States.PageState) {
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

export function saveTestResult(id: number, result: TestResult) {
    globalProgress.addToTracker(id, result);
    
    if (id == Tests.getTests().length-1) {
        switchState(new States.ResultState());
    }
    
    if (id >= 2) {
        if (globalProgress.get(id) == TestResult.Fail && globalProgress.get(id-1) == TestResult.Fail && globalProgress.get(id-2) == TestResult.Fail) {
            switchState(new States.ResultState());
        }
    }
    
    if (result != TestResult.TryAgain) {
        toNextTest();
    }
}

function saveStateToUrl() {
    window.location.replace(window.location.pathname+"#"+globalState.toUrlString()+"-"+globalProgress.toUrlString());
}

function loadStateFromUrl() {
    set(new States.StartState()); // The html starts with start state always loaded already
    let hash = window.location.hash.substring(1);
    
    var parts = hash.split('-');
    if (parts.length == 2) {
        var state = States.fromUrlString(parts[0]);
        globalProgress = new ProgressTracker();
        globalProgress.importUrlString(parts[1]);
        switchStateWithoutAnimation(state);
        saveStateToUrl();
    } else {
        switchStateWithoutAnimation(get());
    }
}

document.addEventListener('DOMContentLoaded', () => { loadStateFromUrl() });
