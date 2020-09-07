const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.adminData = decoded;
        const adminId = req.adminData.adminId;
        next();
    }
    catch(error){
        return res.status(401).json({
            message : "Auth Failed"
        });
    }
    
};