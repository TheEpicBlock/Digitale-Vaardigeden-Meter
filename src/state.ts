import * as Tests from './tests'
import * as Animate from './animate'
import * as GS from './globalstate'
import { ProgressTracker } from './progresstracker'

export interface State {
    toUrlString(): string
    setVisibility(animate: boolean, visibility: boolean): void
    onHtmlMessage(msg: String): void
}

export class StartState implements State {
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

export class ResultState implements State {
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
        var moduleNum = -1;
        if (correct > 0 && correct <=3) {
            moduleNum = 1;
        } else if (correct <= 6) {
            moduleNum = 2;
        } else {
            moduleNum = 3;
        }
        
        var module = document.createElement('h1');
        module.textContent = "Resultaat: module "+moduleNum;
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

export class TestState implements State  {
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
        var result = await this.test.checkConditions(msg);
        GS.saveTestResult(this.test.id, result);
    }
}

export function fromUrlString(str: string): State {
    if (str.startsWith("t") && str.length >= 2) {
        return new TestState(Tests.getById(parseInt(atob(str.substring(1)), 10)));
    } else if (str.startsWith("r")) {
        return new ResultState();
    } else {
        return new StartState();
    }
}
