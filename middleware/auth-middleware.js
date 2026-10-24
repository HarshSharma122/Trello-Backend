import Jwt from 'jsonwebtoken'

const authMiddleware = async(req, res, next)=>{


    // first get the cookie for valid user

    const cookie = await req.cookies.userCookie;
    if(!cookie){
         return res.status(411).send({
            message:"No user found!"
        })
    }

    // Jwt verify that given string is valid or not if valid you get the data which is saved  here i saved userId 


    const user = Jwt.verify(cookie, "secretauth0199829429378479");

    if(!user){
       return res.status(411).send({
            message:"No user found!"
        })
    }



    // now attach the userId into req so when we use this like we modify the request just add user id into it 
    req.userId = user.userId;
    next(); // this is a function here we use because everythign is done now send to nest work which is server 
}

export default authMiddleware;


/* as you know middleware is a bridge between client and server or you also say req send to server(http server)_in between you modify the request  */