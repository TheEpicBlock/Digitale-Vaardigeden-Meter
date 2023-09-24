import './assets/style.scss'
import * as GS from './globalstate'

/**
 * This function is accessible from html files.
 * When on a test page, this will terminate the test
 */
export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}
