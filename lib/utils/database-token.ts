export function getDatabaseToken(database: Function): string {
    return `Notion${database.name}Database`;
}
