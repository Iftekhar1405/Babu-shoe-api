import { UsersService } from "./users/users.service";
export declare class AppModule {
    private usersService;
    constructor(usersService: UsersService);
    onModuleInit(): Promise<void>;
}
