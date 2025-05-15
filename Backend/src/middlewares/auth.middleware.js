const jwt = require('jsonwebtoken')

const verifyToken = (req,res, next)=>{
    const token = req.header.authorization?.split(' ')[1];

    if(!token) return res.this.status(403).json({message:'Token expired'})

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        next();

    }catch(error){
        res.status(402).json({message: 'Invalid Token'})
    }
}

module.exports = verifyToken;