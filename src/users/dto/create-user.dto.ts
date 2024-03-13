import { IsArray, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"
import { Link } from "src/links/entities"

export class CreateUserDto {

    @IsString()
    @IsNotEmpty({
        message: 'El usuario no puede ser vacío'
    })
    name : string

    @IsString()
    perfilImage ?: string
    
    @IsString()
    // @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener almenos 1 mayúscula y 1 número'
    })
    password: string;

    // @IsString({ each: true })
    @IsArray()
    @IsOptional()
    links ?: Link[]
}
