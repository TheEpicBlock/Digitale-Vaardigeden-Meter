import './assets/style.scss'
import * as GS from './globalstate'

/**
 * This function is accessible from html files
 */
export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}
