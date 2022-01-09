import { TestResult, getAmountOfTests } from './tests'

export class ProgressTracker {
    results: TestResult[]
    
    constructor() {
        this.results = new Array(getAmountOfTests());
    }
    
    importUrlString(urlString: string) {
        var split = urlString.split("")
        for (var i in split) {
            this.results[i] = parseInt(split[i]);
        }
    }
    
    addToTracker(id: number, result: TestResult) {
        this.results[id] = result;
    }
    
    toUrlString(): string {
        return this.results.join('');
    }
}
