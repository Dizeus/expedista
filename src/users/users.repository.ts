import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { USER_ROLE } from "src/assets/constants/roles";

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateUserDto, hashedPassword: string) {
    return this.prismaService.user.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        password: hashedPassword,
        fullname: dto.fullname,
        role: USER_ROLE,
        avatar: null,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        avatar: true,
      },
    });
  }

  findAll(skip: number, count: number, query: string) {
    return this.prismaService.user.findMany({
      skip,
      take: count,
      where: {
        fullname: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
  }

  totalCount(query: string) {
    return this.prismaService.user.count({
      where: {
        fullname: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }


  getUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  findOne(id: string) {
    return this.prismaService.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        fullname: true,
        role: true,
        avatar: true
      },
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  setAvatar(filename: string, id: string) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        avatar: "avatars/" + filename,
      },
    });
  }
}
