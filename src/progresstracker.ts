import { TestResult, getAmountOfTests } from './tests'

export class ProgressTracker {
    results: TestResult[]
    
    constructor() {
        this.results = new Array(getAmountOfTests());
    }
    
    importUrlString(urlString: string) {
        urlString = atob(urlString);
        var len = urlString.length;
        for (var i = 0; i < urlString.length; i++) {
            this.results[i] = urlString.charCodeAt(i);
        }
    }
    
    get(id: number): TestResult {
        return this.results[id];
    }
    
    addToTracker(id: number, result: TestResult) {
        this.results[id] = result;
    }
    
    toUrlString(): string {
        return btoa(this.results.map(i => String.fromCharCode(i)).join(''))
        return Buffer.from(this.results).toString('base64');
        return btoa(this.results.join(''));
    }
}
