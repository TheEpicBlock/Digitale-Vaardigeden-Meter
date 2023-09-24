import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import * as Main from './index'

import test0 from './assets/tests/0.html'
import test1 from './assets/tests/1.html'
import test2 from './assets/tests/2.html'
import test3 from './assets/tests/3.html'
import test3config from './assets/tests/3.json'
import test4 from './assets/tests/4.html'
import test6 from './assets/tests/6.html'
import test7 from './assets/tests/7.html'
import test8 from './assets/tests/8.html'
import test9 from './assets/tests/9.html'
import test10 from './assets/tests/10.html'

export const enum TestResult {
    Success,
    QuiteGood,
    Fail,
    TryAgain,
}

export interface Test {
    id: number;
    name: string;
    /**
     * Grades how well the test was performed. Called when a html message is received
     */
    checkResult(msg: String): Promise<TestResult>;
    onLoad(): void;
    html: string;
}

export function getById(id: number): Test {
    if (allTests.length < id) {
        throw new Error(`Invalid test id ${id}`);
    }
    return allTests[id];
}

export function getTests(): Array<Test> {
    return allTests;
}

export function getFirstTest(): Test {
    return allTests[0];
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

async function unconditionalSuccess(message: string) {
    return TestResult.Success;
}

const allTests: Array<Test> = [
    {
        name: "Klikken",
        checkResult: unconditionalSuccess,
        html: test0,
    },
    {
        name: "Chrome openen",
        checkResult: async function(message: string) {
            if (message == "continue") {
                return TestResult.Success;
            } else if (message == "start") {
                document.getElementById('desktop').style.display = "none";
                document.getElementById('start-menu').style.display = "flex";
            } else if (message == "closestart") {
                document.getElementById('desktop').style.display = "flex";
                document.getElementById('start-menu').style.display = "none";
            }
            return TestResult.TryAgain;
        },
        html: test1,
    },
    {
        name: "Email versturen",
        checkResult: async function(message: string) {
            var rec = testElementValue("reciever", "fpcvanmesdag@vanmesdag.nl", false);
            var subj = testElementValue("subject", "hallo", true);
            var cont = testElementValue("content", "dit is mijn bericht", true);
            if (rec && subj && cont) {
                return TestResult.Success;
            } else {
                return TestResult.Fail;
            }
        },
        html: test2,
    },
    {
        name: "Google resultaten begrijpen",
        checkResult: async function(message: string) {
            switch(message) {
                case "success": return TestResult.Success;
                case "quite_good": return TestResult.QuiteGood;
                case "fail": return TestResult.Fail;
            }
        },
        html: test3,
        onLoad: function() {
            var toPopulate = document.getElementById("bol-buttons");
            var imgHeight = 2401;
            var imgWidth = 1748;
            test3config.forEach(button => {
                var buttonHtml = document.createElement("button");
                buttonHtml.className = "invis-button"
                buttonHtml.style.left = button.coords[0] / imgWidth * 100 + "%";
                buttonHtml.style.top = button.coords[1] / imgHeight * 100 + "%";
                buttonHtml.style.width = (button.coords[2] / imgWidth - button.coords[0] / imgWidth) * 100 + "%";
                buttonHtml.style.height = (button.coords[3] / imgHeight - button.coords[1] / imgHeight) * 100 + "%";
                buttonHtml.style.cursor = "pointer";
                if (button.alt) buttonHtml.setAttribute("alt", button.alt);
                buttonHtml.onclick = () => Main.sendMessage(button.result);
                toPopulate.appendChild(buttonHtml);
            });
        }
    },
    {
        name: "Reisplanner gebruiken",
        checkResult: async function(message: string) {
            var a = testElementValue("reisplanner-a", "groningen hoofdstation", true);
            var b = testElementValue("reisplanner-b", "zuiderdiep", true);
            return a && b ? TestResult.Success : TestResult.Fail;
        },
        html: test4,
    },
    {
        name: "Budgetteren",
        checkResult: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test6,
    },
    {
        name: "OV-chipkaart opladen",
        checkResult: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test7,
        onLoad: function() {
            setZxcvbnOptions(); // Already start loading these for the password test
        }
    },
    {
        name: "Spam email identificeren",
        checkResult: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test8,
    },
    {
        name: "Een veilig wachtwoord bedenken",
        checkResult: async function(message: string) {
            var elem = document.getElementById("pw-input");
            if (elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement) {
                var output = await zxcvbn(elem.value);
                console.log(output);
                switch (output.score) {
                    case 0:
                    case 1:
                    case 2:
                        return TestResult.Fail;
                    case 3:
                        return TestResult.QuiteGood;
                    case 4:
                    default:
                        return TestResult.Success;
                }
            }
        },
        html: test9,
        onLoad: function() {
            setZxcvbnOptions(); // Ensure they're loaded
        }
    },
    {
        name: "Veilige webpagina identificeren",
        checkResult: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test10,
    },
].map((obj, i) => {
    var onload;
    if (obj.onLoad != undefined) {
        onload = obj.onLoad;
    } else {
        onload = function () {};
    }
    return {
        id: i,
        name: obj.name,
        checkResult: obj.checkResult,
        html: obj.html,
        onLoad: onload,
    }
});
