import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

import { User, Link } from 'src/links/entities';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
// import { CreateLinkDto } from 'src/links/dto/create-link.dto';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('users')
  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,

    ){}

  async create(createUserDto: CreateUserDto) {

    try{
      const {links = [], password, ...linkDetails } = createUserDto
      const user = this.userRepository.create({
        ...linkDetails,
        password: bcrypt.hashSync(password, 10),
        links: links.map( link => this.linkRepository.create({
          'image': link.image,
          'label': link.label,
          'link' : link.link, 
        }))
      })
      await this.userRepository.save(user)
      delete user.password
      return user
    }
    catch (error){ this.handleDBExceptions(error) }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, name } = loginUserDto
    const user = await this.userRepository.findOne({
      where: {name},
      select: {name: true, password: true, userID: true}
    })

    // if( !user )
    //   throw new UnauthorizedException('Credenciales no válidos! (NickName)')

    // if ( !bcrypt.compareSync(password, user.password) )
    //   throw new UnauthorizedException('Credenciales no válidos! (Password)')

    if (password != user.password) throw new UnauthorizedException('Password incorrecto')

    return {
      ...user,
      token: this.getJwtToken({userID: user.userID})
    }
  }

  private getJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token
  }


  findAll() {
    return this.userRepository.find({
      relations:{
        links: true,
      }
    })
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({'userID' : id})
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    
    const {links, ...toUpdate} = updateUserDto


    const row = await this.userRepository.preload({
      'userID' : id,
      ...toUpdate
    })
    if (!row) throw new NotFoundException(`User with userID: ${id} not found`)

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{

      if(links) {
        await queryRunner.manager.delete( Link, {user: { userID: id} })
        
         row.links = links.map( link => this.linkRepository.create({
          'image': link.image,
          'label': link.label,
          'link' : link.link, 
        }))
     
      } else {
        row.links = await this.linkRepository.findBy({user: {userID:id}})
      }
      await queryRunner.manager.save( row )

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return row
    }
    catch(error) { 
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDBExceptions (error)}
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.userRepository.remove(product)
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('users')

    try{
      return await query
        .delete()
        .where({})
        .execute()
    } catch(error){this.handleDBExceptions(error)}
  }
}
