import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalotariosService } from './balotarios.service';
import { CreateBalotarioDto } from './dto/create-balotario.dto';
import { UpdateBalotarioDto } from './dto/update-balotario.dto';

@Controller('balotarios')
export class BalotariosController {
  constructor(private readonly balotariosService: BalotariosService) {}

  @Post()
  create(@Body() createBalotarioDto: CreateBalotarioDto) {
    return this.balotariosService.create(createBalotarioDto);
  }

  @Get()
  findAll() {
    return this.balotariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balotariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBalotarioDto: UpdateBalotarioDto) {
    return this.balotariosService.update(+id, updateBalotarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.balotariosService.remove(+id);
  }
}
