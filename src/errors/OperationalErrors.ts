export class OperationalErrors extends Error {
    constructor (message:string) {
        super(message);
        this.name = "OperationalErrors";
    }
}