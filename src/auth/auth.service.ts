import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
// import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/shemas/User.schema';
import { UsersService } from 'src/users/users.service';
// import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly useService: UsersService,
    private jwtService: JwtService,
  ) {}

  async SignUp(signUpDto: SignUpDto) {
    try {
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10); // Ensure bcrypt.hash uses salt rounds
      const signUpUser = new this.userModel({
        username: signUpDto.username,
        password: hashedPassword,
        email: signUpDto.email,
      });
      return await signUpUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.useService.findOne(signInDto.username);
    if (!user) {
      throw new UnauthorizedException('invalid username or password');
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid password');
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
