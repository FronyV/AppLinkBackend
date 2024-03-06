import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter, fileNamer } from './helpers/';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ){}

  @Get('links/:imageName')
  findLinkImage(
    @Res() res: Response,
    @Param('imageName') imageName:string
  ){
    const path = this.filesService.getStaticLinkImage( imageName )
    res.sendFile( path )
  }

  @Post('links')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/linkImage',
      filename: fileNamer
    })
  }))
    uploadLinkImage(
      @UploadedFile()
      file:Express.Multer.File,
    ){

      if ( !file ){
        throw new BadRequestException('Make sure that the file is an image')
      }

      const secureUrl = `${this.configService.get('HOST_API') }/files/links/${ file.filename }`

      return {secureUrl}
    }
 
  

}


