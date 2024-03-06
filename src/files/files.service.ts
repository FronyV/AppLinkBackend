import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticLinkImage(imageName: string){
    const path = join(__dirname, '../../static/linkImage', imageName)

    if ( !existsSync(path) )
      throw new BadRequestException(`No link found with image ${imageName}`)
    return path
  }
}
