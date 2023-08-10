var jwt = require('jsonwebtoken');
const JWT_SECRET = "jwt#kunwhidhsodi$sdghjld";

const fetchUsers = async (req,res,next)=>{
    // verifing the user using token
    console.log(req.header("auth-token"))
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req.user);
        next();
    }catch(err){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

module.exports = fetchUsers;