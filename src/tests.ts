import * as GS from './globalstate'
import test0 from './tests/0.html'
import test1 from './tests/1.html'
import test2 from './tests/2.html'
import test3 from './tests/3.html'
import test4 from './tests/4.html'
import test6 from './tests/6.html'
import test7 from './tests/7.html'
import testend from './tests/end.html'

export interface Test {
    id: number
    onHtmlMessage(msg: String): void,
    getHtml(): HTMLElement,
}

export function getById(id: number): Test {
    if (allTests[id].id = id) return allTests[id];
}

export function getFirstTest(): Test {
    return allTests[0];
}

function htmlFromFile(file: string) {
    return () => {
        var base = document.createElement("div");
        var margin = document.createElement("div");
        margin.innerHTML = file;
        margin.className = "margin-wrapper";
        base.append(margin);
        base.className = "state";
        return base;
    }
}

function testElementValue(id: string, expected: string, ignoreTrailingDot: boolean): boolean {
    var elem = document.getElementById(id);
    if (elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement) {
        var content = elem.value.trim().toLowerCase();
        if (ignoreTrailingDot && content.endsWith(".")) {
            content = content.substr(0, content.length-1);
        }
        return content === expected;
    }
}

const allTests: Array<Test> = [
    { // Simple click test
        id: 0,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test0),
    },
    { // Open chrome
        id: 1,
        onHtmlMessage: function(message) {
            if (message == "continue") {
                GS.toNextTest();
            } else if (message == "start") {
                document.getElementById('desktop').style.display = "none";
                document.getElementById('start-menu').style.display = "flex";
            } else if (message == "closestart") {
                document.getElementById('desktop').style.display = "flex";
                document.getElementById('start-menu').style.display = "none";
            }
        },
        getHtml: htmlFromFile(test1),
    },
    { // Gmail
        id: 2,
        onHtmlMessage: function(message) {
            var rec = testElementValue("reciever", "fpcvanmesdag@vanmesdag.nl", false);
            var subj = testElementValue("subject", "hallo", true);
            var cont = testElementValue("content", "dit is mijn bericht", true);
            if (rec && subj && cont) {
                GS.toNextTest();
            } else {
                // TODO
            }
        },
        getHtml: htmlFromFile(test2),
    },
    { // Google
        id: 3,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test3),
    },
    {
        id: 4,
        onHtmlMessage: function(message) {
            var a = testElementValue("reisplanner-a", "groningen hoofdstation", true);
            var b = testElementValue("reisplanner-b", "zuiderdiep", true);
            if (a && b) {
                GS.toNextTest();
            } else {
                // TODO
            }
        },
        getHtml: htmlFromFile(test4),
    },
    {
        id: 5,
        onHtmlMessage: function(message) {
            if (message == "right") {
                GS.toNextTest();
            } else if (message == "wrong"){
                // TODO
            }
        },
        getHtml: htmlFromFile(test6),
    },
    {
        id: 6,
        onHtmlMessage: function(message) {
            if (message == "right") {
                GS.toNextTest();
            } else if (message == "wrong"){
                // TODO
            }
        },
        getHtml: htmlFromFile(test7),
    },
    {
        id: 7,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(testend),
    }
];

if (process.env.NODE_ENV !== 'production') {
    for (var i = 0; i < allTests.length; i++) {
        if (allTests[i].id != i) {
            throw new Error("test array out of sync");
        }
    }
}
