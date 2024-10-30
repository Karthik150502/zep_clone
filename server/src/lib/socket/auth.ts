import jwt from "jsonwebtoken";



const AuthWsMiddleWare = (tokenString: string) => {

    const token = tokenString.split(" ")[1];

    // Verifying the JWT
    try {
        let res = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Data from socket authentication = ", res);
        return res;
    } catch (e) {
        console.log(e);
        return false;
    }

}


export default AuthWsMiddleWare;