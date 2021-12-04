import * as GS from './globalstate'

export interface Test {
    id: number
    onHtmlMessage(msg: String): void
}

export function getById(id: number): Test {
    if (allTests[id].id = id) return allTests[id];
}

export function getFirstTest(): Test {
    return allTests[0];
}

const allTests: Array<Test> = [
    {
        id: 0,
        onHtmlMessage: GS.toNextTest,
    },
    {
        id: 1,
        onHtmlMessage: GS.toNextTest,
    }
];

if (process.env.NODE_ENV !== 'production') {
    for (var i = 0; i < allTests.length; i++) {
        if (allTests[i].id != i) {
            throw new Error("test array out of sync");
        }
    }
}
