import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { LocalizationService } from '../localization/localization.service';
import { user } from '@prisma/client';
import { LocalizationObjects } from 'src/assets/types/enums/LocalizationObjects';
import { LocalizationAction } from 'src/assets/types/enums/LocalizationAction';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private localizationService: LocalizationService,
  ) {}

  async create(dto: CreateUserDto): Promise<user> {
    const candidateEmail = await this.usersRepository.getUserByEmail(dto.email);

    if (candidateEmail) {
      throw new HttpException(
        this.localizationService.translate('translation', [
          { type: 'email' },
          { value: dto.email },
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersRepository.create(dto, hashedPassword);
  }

  async findAll(page: number, count: number, query: string) {
    const skip = (page - 1) * count;
    const [users, total] = await Promise.all([
      this.usersRepository.findAll(skip, count, query),
      this.usersRepository.totalCount(query),
    ]);

    return { users, total };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        this.localizationService.notFound(LocalizationObjects.USER, id),
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.usersRepository.remove(id);
    return {
      message: this.localizationService.action(
        LocalizationAction.DELETED,
        LocalizationObjects.USER,
      ),
    };
  }
}
