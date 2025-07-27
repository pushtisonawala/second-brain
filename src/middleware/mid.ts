import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const JWT_PASSWORD=process.env.JWT_PASSWORD;

function mid(req :Request,res:Response,next:NextFunction){



const auth=req.headers["authorization"];
const decoded=jwt.verify(auth as string ,JWT_PASSWORD!);
if(decoded){
    // @ts-ignore
    req.userId=decoded.id
    next()
    
}else{
    res.json("middleware cant proceed");
}

}
export { mid };