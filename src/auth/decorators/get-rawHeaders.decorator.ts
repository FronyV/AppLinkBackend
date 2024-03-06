import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const getRawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext)=>{
        const req = ctx.switchToHttp().getRequest()
        const rawHeaders = req.rawHeaders
        
        return rawHeaders 
    }
)