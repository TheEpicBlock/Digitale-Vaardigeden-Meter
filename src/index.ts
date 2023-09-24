import './style.scss'
import * as GS from './globalstate'

export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}
