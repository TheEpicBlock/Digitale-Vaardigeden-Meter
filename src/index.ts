import './assets/style.scss'
import * as GS from './globalstate'

/**
 * This function is accessible from html files.
 * When on a test page, this will terminate the test
 */
export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}

/**
 * Debug function, to be used from the console.
 * Use as `Main.skipTo(x)`
 */
export function skipTo(test: number) {
    GS.toTest(test);
}