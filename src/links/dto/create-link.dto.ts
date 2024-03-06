import { IsNotEmpty, IsString } from "class-validator"

export class CreateLinkDto {
    @IsString()
    @IsNotEmpty()
    image : string
    
    @IsString()
    @IsNotEmpty()
    label : string

    @IsString()
    @IsNotEmpty()
    link : string
}

