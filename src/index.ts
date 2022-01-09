import './style.scss'
import * as States from './state'
import * as Tests from './tests'
import * as GS from './globalstate'

export function sendMessage(msg: String) {
    GS.get().onHtmlMessage(msg);
}

