export class NotionException extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "NotionException";
    }
}
