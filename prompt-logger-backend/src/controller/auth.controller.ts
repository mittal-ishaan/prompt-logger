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
import { clickHouseService } from 'src/db/click-house.service';
import { User } from 'src/types/UserType';
import { UsersService } from 'src/users/users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(clickHouseService) private clikChat: clickHouseService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logs in a user with the provided username and password',
  })
  @ApiResponse({ status: 200, description: 'The JWT token for the user' })
  async login(@UserParam() user: User) {
    return this.authService.login(user);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Creates a new user with the provided username and password',
  })
  @ApiResponse({ status: 200, description: 'The JWT token for the user' })
  async makeUser(@Body() user: SignupDto) {
    if ((await this.usersService.getUsers(user.username)) != null) {
      throw new HttpException('User already exists', 400);
    }
    return this.usersService.makeUser(user.username, user.password);
  }
}
