import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/shemas/User.schema';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async getUserById(id: string): Promise<User[]> {
    return this.userModel.find({ _id: id }).exec();
  }
  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username });
  }
}
