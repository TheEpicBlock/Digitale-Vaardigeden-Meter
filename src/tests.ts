import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'

import * as GS from './globalstate'
import test0 from './tests/0.html'
import test1 from './tests/1.html'
import test2 from './tests/2.html'
import test3 from './tests/3.html'
import test4 from './tests/4.html'
import test6 from './tests/6.html'
import test7 from './tests/7.html'
import test8 from './tests/8.html'
import test9 from './tests/9.html'
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

async function setZxcvbnOptions() {
    const zxcvbnCommonPackage = (await import(/* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common')).default;
    
    const options = {
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            custom: ['test', 'digi', 'vaardigheden'],
        },
    }
    
    ZxcvbnOptions.setOptions(options);
    
    const zxcvbnNlBePackage = (await import(/* webpackChunkName: "zxcvbnNlBePackage" */ '@zxcvbn-ts/language-nl-be')).default;
    
    const options2 = {
        translations: zxcvbnNlBePackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnNlBePackage.dictionary,
            custom: ['test', 'digi', 'vaardigheden'],
        },
    }
    
    ZxcvbnOptions.setOptions(options2);
}

const allTests: Array<Test> = [
    { // Simple click test
        id: -1,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test0),
    },
    { // Open chrome
        id: -1,
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
        id: -1,
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
        id: -1,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test3),
    },
    {
        id: -1,
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
        id: -1,
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
        id: -1,
        onHtmlMessage: function(message) {
            if (message == "right") {
                GS.toNextTest();
            } else if (message == "wrong"){
                // TODO
            }
        },
        getHtml: function() {
            setZxcvbnOptions(); // Already start loading these for the password test
            return htmlFromFile(test7)();
        },
    },
    { // Safe link
        id: -1,
        onHtmlMessage: function(message) {
            if (message == "right") {
                GS.toNextTest();
            } else if (message == "wrong"){
                // TODO
            }
        },
        getHtml: htmlFromFile(test8),
    },
    { // Password
        id: -1,
        onHtmlMessage: async function(message) {
            var elem = document.getElementById("pw-input");
            if (elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement) {
                var output = await zxcvbn(elem.value);
                console.log(output)
                if (output.score >= 3) {
                    GS.toNextTest();
                }
            }
        },
        getHtml: htmlFromFile(test9),
    },
    {
        id: -1,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(testend),
    }
];

for (var i = 0; i < allTests.length; i++) {
    allTests[i].id = i;
}
