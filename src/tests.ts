import * as GS from './globalstate'
import test0 from './tests/0.html'
import test1 from './tests/1.html'
import test2 from './tests/2.html'

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

const allTests: Array<Test> = [
    {
        id: 0,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test0),
    },
    {
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
    {
        id: 2,
        onHtmlMessage: GS.toNextTest,
        getHtml: htmlFromFile(test2),
    }
];

if (process.env.NODE_ENV !== 'production') {
    for (var i = 0; i < allTests.length; i++) {
        if (allTests[i].id != i) {
            throw new Error("test array out of sync");
        }
    }
}
