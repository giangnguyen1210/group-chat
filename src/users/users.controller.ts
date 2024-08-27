import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/get/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  @Get('/get-all')
  getAllUser() {
    return this.usersService.getAllUser();
  }

  // @Get('/get-hello')
  // helloWorld() {
  //   return this.usersService.helloWorld();
  // }
}
