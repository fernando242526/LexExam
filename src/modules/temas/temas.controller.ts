import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemasService } from './temas.service';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';

@Controller('temas')
export class TemasController {
  constructor(private readonly temasService: TemasService) {}

  @Post()
  create(@Body() createTemaDto: CreateTemaDto) {
    return this.temasService.create(createTemaDto);
  }

  @Get()
  findAll() {
    return this.temasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemaDto: UpdateTemaDto) {
    return this.temasService.update(+id, updateTemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temasService.remove(+id);
  }
}
