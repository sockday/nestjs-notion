import { DatabaseTargetType, ModuleOptionsInterface } from "./interfaces";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { NotionService } from "./notion.service";

@Global()
@Module({})
export class NotionModule {
    private static readonly DATABASES: DatabaseTargetType[] = [];

    static forRoot(options: ModuleOptionsInterface): DynamicModule {
        NotionModule.DATABASES.push(...options.databases);

        return {
            module: NotionModule,
            providers: [
                {
                    provide: NotionService,
                    useFactory: () => {
                        const service = new NotionService();

                        service.setClient(options.client);
                        service.addDatabases(NotionModule.DATABASES);

                        if (options.manager) {
                            service.setManager(options.manager);
                        }

                        return service;
                    },
                },
            ],
            exports: [NotionService],
        };
    }
}
