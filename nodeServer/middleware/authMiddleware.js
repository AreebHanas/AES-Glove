import jwt from 'jsonwebtoken'

const validation = async(req,res,next)=>{
    const token = req.header('Authorization');
    const JWT_SECRET = process.env.JWT_SECRET;
    if(!token){
        return res.status(401).json({error:true, msg:"Access Denied"})
    }
    const decoded = jwt.verify(token.replace('Bearer ',''),JWT_SECRET)
    if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ message: 'Token has expired.' });
    }
    try {
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error:true ,msg: 'Invalid Token' });
    }
}

export default validation;