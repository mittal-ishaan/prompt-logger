import {
  Body,
  Controller,
  Post,
  UseGuards,
  Inject,
  HttpException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserParam } from 'src/decorators/UserParam';
import { SignupDto } from 'src/dtos/SignUpDto';
import { clickHouseService } from 'src/services/clickHouseService';
import { User } from 'src/types/UserType';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(clickHouseService) private clikChat: clickHouseService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserParam() user: User) {
    return this.authService.login(user);
  }

  @Post('signup')
  async makeUser(@Body() user: SignupDto) {
    if ((await this.clikChat.getUsers(user.username)) != null) {
      throw new HttpException('User already exists', 400);
    }
    return this.clikChat.makeUser(user.username, user.password);
  }
}
