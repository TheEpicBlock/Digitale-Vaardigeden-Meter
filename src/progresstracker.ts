import { TestResult, getTests } from './tests'

export class ProgressTracker {
    results: TestResult[]
    
    constructor() {
        this.results = new Array(getTests().length);
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
    
    countCorrect(): number {
        var c = 0;
        for (var i = 0; i < this.results.length; i++) {
            var t = this.get(i);
            if (t == TestResult.Success || t == TestResult.QuiteGood) {
                c += 1;
            }
        }
        return c;
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
