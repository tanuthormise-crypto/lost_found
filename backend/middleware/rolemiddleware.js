
const roleadmin=(req,res,next)=>{
    if(req.user.role!="admin"){
         return res.status(403).json({message:"access denied,admin only !"});
    }
    next();
};
module.exports=roleadmin;