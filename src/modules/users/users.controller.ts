import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTAuthGuard } from 'src/common/guards/jwt-guard';
import { UpdateUserResponse, UserResponseInfo } from './responses';
import { UserUpdateDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { IJWTUser } from 'src/common/interfaces/auth';
@ApiTags('API')
@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiResponse({ status: 200, type: UserResponseInfo })
  @Get('info/:idOrEmail')
  public async getInfoUser(
    @Param('idOrEmail') idOrEmail: string,
  ): Promise<UserResponseInfo | Error> {
    return await this.usersService.getPublicUser(idOrEmail);
  }
  @ApiResponse({ status: 200, type: UpdateUserResponse })
  @Patch('update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  public async updateUser(
    @Body() userUpdateDTO: UserUpdateDTO,
    @Req() request,
  ): Promise<UpdateUserResponse> {
    const { id } = request.user;
    return await this.usersService.updateUser(id, userUpdateDTO);
  }
  @ApiResponse({ status: 200 })
  @Delete('delete/:id')
  public async deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: IJWTUser,
  ) {
    return await this.usersService.deleteUser(id, user);
  }
}
