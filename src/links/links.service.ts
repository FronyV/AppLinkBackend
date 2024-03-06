import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';

@Injectable()
export class LinksService {

  private readonly logger = new Logger('links');
 
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>
  ){}

  async create(createLinkDto: CreateLinkDto) {
    try{
      const link = this.linkRepository.create(createLinkDto)
      await this.linkRepository.save( link )
      return link
    }
    catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {
    return this.linkRepository.find({})
  }

  findOne( @Param('id', ParseUUIDPipe) id: string) {
    return this.linkRepository.findOneBy({ 'idLink': id })
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    
    const row = await this.linkRepository.preload({
      'idLink': id,
      ...updateLinkDto
    })

    if ( !row ) throw new NotFoundException(`Link with idLink: ${id} not found`)

    try{
      return this.linkRepository.save(row)
    }
    catch(error){
      this.handleDBExceptions(error)
    }
  }

  async remove( @Param('id', ParseUUIDPipe) id: string) {
    const row = await this.findOne(id)
    await this.linkRepository.remove(row)
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
