import { Injectable } from '@nestjs/common';
import { CreateBalotarioDto } from './dto/create-balotario.dto';
import { UpdateBalotarioDto } from './dto/update-balotario.dto';

@Injectable()
export class BalotariosService {
  create(createBalotarioDto: CreateBalotarioDto) {
    return 'This action adds a new balotario';
  }

  findAll() {
    return `This action returns all balotarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} balotario`;
  }

  update(id: number, updateBalotarioDto: UpdateBalotarioDto) {
    return `This action updates a #${id} balotario`;
  }

  remove(id: number) {
    return `This action removes a #${id} balotario`;
  }
}
