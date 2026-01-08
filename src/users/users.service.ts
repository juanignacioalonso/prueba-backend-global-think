import { BadRequestException, Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });

      return await createdUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('El correo electrónico ya existe');
      }
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(role?: string): Promise<User[]> {
    const filter = role ? { 'perfil.nombre_perfil': role } : {};
    return this.userModel.find(filter).exec();
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`El ID '${id}' no es válido para MongoDB`);
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`El ID '${id}' no es válido para MongoDB`);
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      return updatedUser;

    } catch (error: any) {
      if (error.code === 11000 || error.codeName === 'DuplicateKey') {
        throw new ConflictException('El correo electrónico ya está en uso por otro usuario');
      }
      if (error instanceof NotFoundException) throw error;

      console.error('Error no controlado en update:', error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`El ID '${id}' no es válido para MongoDB`);
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }
}