import { Controller, Get } from "@nestjs/common";

@Controller()
export class UsersController {

    // GET: ~/api/users
    @Get('/api/users')
    public getAllUsers() {
        return [
            { id: 1, email: 'ahmed@email.com' },
            { id: 2, email: 'youssef@email.com' }
        ]
    }
}