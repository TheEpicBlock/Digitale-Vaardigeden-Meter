import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'

import test0 from './assets/tests/0.html'
import test1 from './assets/tests/1.html'
import test2 from './assets/tests/2.html'
import test3 from './assets/tests/3.html'
import test4 from './assets/tests/4.html'
import test6 from './assets/tests/6.html'
import test7 from './assets/tests/7.html'
import test8 from './assets/tests/8.html'
import test9 from './assets/tests/9.html'

export const enum TestResult {
    Success,
    QuiteGood,
    Fail,
    TryAgain,
}

export interface Test {
    id: number;
    name: string;
    checkConditions(msg: String): Promise<TestResult>;
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

async function unconditionalCheck(message: string) {
    return TestResult.Success;
}

const allTests: Array<Test> = [
    {
        name: "Klikken",
        checkConditions: unconditionalCheck,
        html: test0,
    },
    {
        name: "Chrome openen",
        checkConditions: async function(message: string) {
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
        checkConditions: async function(message: string) {
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
        checkConditions: unconditionalCheck,
        html: test3,
    },
    {
        name: "Reisplanner gebruiken",
        checkConditions: async function(message: string) {
            var a = testElementValue("reisplanner-a", "groningen hoofdstation", true);
            var b = testElementValue("reisplanner-b", "zuiderdiep", true);
            return a && b ? TestResult.Success : TestResult.Fail;
        },
        html: test4,
    },
    {
        name: "Budgetteren",
        checkConditions: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test6,
    },
    {
        name: "OV-chipkaart opladen",
        checkConditions: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test7,
        onLoad: function() {
            setZxcvbnOptions(); // Already start loading these for the password test
        }
    },
    {
        name: "Spam email identificeren",
        checkConditions: async function(message: string) {
            return message == "right" ? TestResult.Success : TestResult.Fail;
        },
        html: test8,
    },
    {
        name: "Een veilig wachtwoord bedenken",
        checkConditions: async function(message: string) {
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
    }
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
        checkConditions: obj.checkConditions,
        html: obj.html,
        onLoad: onload,
    }
});
