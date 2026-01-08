import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      // Manejo de error de duplicidad 
      if (error.code === 11000) {
        throw new ConflictException('El correo electrónico ya existe');
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  // Filtro por texto en getAll 
  async findAll(search?: string): Promise<User[]> {
    const filter = search
      ? {
        $or: [
          { nombre: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      : {};
    return this.userModel.find(filter).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    // Aquí implementaremos la lógica de permisos en el Controller, el servicio solo borra.
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }
}