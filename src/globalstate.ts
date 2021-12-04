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
