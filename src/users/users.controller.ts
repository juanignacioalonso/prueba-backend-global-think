import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers,
  UnauthorizedException, ForbiddenException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  private validateAdminRole(role: string) {
    if (role !== 'admin') {
      throw new ForbiddenException('Acceso denegado: Se requieren permisos de administrador');
    }
  }

  private validateViewRole(role: string) {
    if (role !== 'admin' && role !== 'user') {
      throw new ForbiddenException('Acceso denegado: Debes ser Admin o User para ver esto');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario (Solo Admin)' })
  @ApiHeader({ name: 'role', description: 'Rol: admin', required: true })
  create(@Body() createUserDto: CreateUserDto, @Headers('role') role: string) {
    this.validateAdminRole(role);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener usuarios (Requiere ser User o Admin)' })
  @ApiHeader({ name: 'role', description: 'Rol: admin o user', required: true })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre o email (Dejar vacío para ver todos)' })
  findAll(@Query('search') search?: string, @Headers('role') role?: string) {
    this.validateViewRole(role || '');
    return this.usersService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario (Requiere ser User o Admin)' })
  @ApiHeader({ name: 'role', description: 'Rol: admin o user', required: true })
  findOne(@Param('id') id: string, @Headers('role') role?: string) {
    this.validateViewRole(role || '');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario (Solo Admin)' })
  @ApiHeader({ name: 'role', description: 'Rol: admin', required: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Headers('role') role: string) {
    this.validateAdminRole(role);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario (Solo Admin)' })
  @ApiHeader({ name: 'role', description: 'Rol: admin', required: true })
  remove(@Param('id') id: string, @Headers('role') role: string) {
    this.validateAdminRole(role);
    return this.usersService.remove(id);
  }
}