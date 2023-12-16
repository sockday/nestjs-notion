import type { DatabaseRawInterface, DatabaseTargetType } from "../interfaces";

export class DatabaseMap extends Map<DatabaseTargetType, DatabaseRawInterface<DatabaseTargetType>> {
    public get<T extends DatabaseTargetType>(entity: T): DatabaseRawInterface<InstanceType<T>> {
        const value = super.get(entity);

        if (!value) throw new Error(`Database ${entity.name} not found`);

        return value as DatabaseRawInterface<InstanceType<T>>;
    }
}
