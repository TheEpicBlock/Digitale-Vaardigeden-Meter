import * as Tests from './tests'
import * as Animate from './animate'
import * as GS from './globalstate'

export interface State {
    toUrlString(): String
    setVisibility(animate: boolean, visibility: boolean): void
    onHtmlMessage(msg: String): void
}

export class StartState implements State {
    type: "start"
    
    constructor() {
    }
    
    toUrlString(): String {
        return "";
    }
    
    setVisibility(animate: boolean, visibility: boolean) {
        Animate.activateOrDeactivateElement(document.getElementById("start"), animate, visibility);
    }
    
    onHtmlMessage(msg: String) {
        GS.switchState(new TestState(Tests.getFirstTest()));
    }
}

export class TestState implements State  {
    type: "test"
    test: Tests.Test
    htmlRep: HTMLElement | null // The Html representation insided the dom
    
    constructor(test: Tests.Test) {
        this.test = test;
        this.htmlRep = null;
    }
    
    toUrlString(): String {
        return "t"+this.test.id;
    }
    
    setVisibility(animate: boolean, visibility: boolean) {
        if (this.htmlRep != null) {
            Animate.activateOrDeactivateElement(this.htmlRep, animate, visibility);
        } else {
            var main = document.getElementById("main");
            var html = this.test.getHtml();
            main.append(html);
            Animate.activateOrDeactivateElement(html, animate, visibility);
            this.htmlRep = html;
        }
    }
    
    onHtmlMessage(msg: String) {
        this.test.onHtmlMessage(msg);
    }
}

export function fromUrlString(str: String): State {
    if (str.startsWith("f") && str.length > 2) {
        return new TestState(Tests.getById(parseInt(str.substring(1), 16)))
    }
}
