import * as Tests from './tests'
import * as Animate from './animate'
import * as GS from './globalstate'

export interface PageState {
    toUrlString(): string
    setVisibility(animate: boolean, visibility: boolean): void
    onHtmlMessage(msg: String): void
}

export class StartState implements PageState {
    type: "start"
    
    constructor() {
    }
    
    toUrlString(): string {
        return "s";
    }
    
    setVisibility(animate: boolean, visibility: boolean) {
        Animate.activateOrDeactivateElement(document.getElementById("start"), animate, visibility);
    }
    
    onHtmlMessage(msg: string) {
        GS.switchState(new TestState(Tests.getFirstTest()));
    }
}

export class ResultState implements PageState {
    type: "result"
    
    constructor() {
    }
    
    toUrlString(): string {
        return "r";
    }
    
    setVisibility(animate: boolean, visibility: boolean) {
        Animate.activateOrDeactivateElement(document.getElementById("result"), animate, visibility);
        // Render results
        var resultElement = document.getElementById("result-container");
        var correct = GS.getGlobalProgress().countCorrect();
        
        var module = document.createElement('h1');
        if (correct > 0 && correct <=3) {
            module.textContent = "Resultaat: module 1";
        } else if (correct <= 6) {
            module.textContent = "Resultaat: module 2";
        } else if (correct < Tests.getTests().length) {
            module.textContent = "Resultaat: module 3";
        } else if (correct == Tests.getTests().length) {
            module.textContent = "Resultaat: oefenen bij SJD";
        }
        
        resultElement.append(module);
        
        for (var i in Tests.getTests()) {
            var test = Tests.getTests()[i];
            var div = document.createElement('div');
            div.textContent = test.name;
            div.className = "test-result";
            switch (GS.getGlobalProgress().get(test.id)) {
                case Tests.TestResult.Success:
                    div.className += " good-test";
                    break;
                case Tests.TestResult.QuiteGood:
                    div.className += " quitegood-test";
                    break;
                case Tests.TestResult.Fail:
                    div.className += " fail-test";
                    break;
                default:
                    div.className += " unknown-test";
                    break;
            }
            resultElement.append(div);
        }
    }
    
    onHtmlMessage(msg: string) {
        window.location.assign(window.location.pathname);
    }
}

export class TestState implements PageState  {
    type: "test"
    test: Tests.Test
    htmlRep: HTMLElement | null // The Html representation insided the dom
    
    constructor(test: Tests.Test) {
        this.test = test;
        this.htmlRep = null;
    }
    
    toUrlString(): string {
        return "t"+btoa(''+this.test.id);
    }
    
    setVisibility(animate: boolean, visibility: boolean) {
        if (this.htmlRep != null) {
            Animate.activateOrDeactivateElement(this.htmlRep, animate, visibility);
        } else {
            var main = document.getElementById("main");
            
            var testhtml = document.createElement("div");
            var margin = document.createElement("div");
            margin.innerHTML = this.test.html;
            margin.className = "margin-wrapper";
            testhtml.append(margin);
            testhtml.className = "state";
            
            main.append(testhtml);
            this.test.onLoad();
            Animate.activateOrDeactivateElement(testhtml, animate, visibility);
            this.htmlRep = testhtml;
        }
    }
    
    async onHtmlMessage(msg: string) {
        var result = await this.test.checkResult(msg);
        GS.saveTestResult(this.test.id, result);
    }
}

export function fromUrlString(str: string): PageState {
    if (str.startsWith("t") && str.length >= 2) {
        return new TestState(Tests.getById(parseInt(atob(str.substring(1)), 10)));
    } else if (str.startsWith("r")) {
        return new ResultState();
    } else {
        return new StartState();
    }
}
