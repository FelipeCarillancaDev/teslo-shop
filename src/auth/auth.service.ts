import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto; //se desestructura la contraseña y las demás propiedades
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10), // como parametros se envía la contraseña y el número de saltos y guardar la contraseña encriptada
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  login(loginUserDto: LoginUserDto) {}

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log();
    throw new InternalServerErrorException('Error Internal Server');
  }
}
