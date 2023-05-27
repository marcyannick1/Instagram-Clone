import jwt from "jsonwebtoken";

export async function generateToken(data: any, secret: string, exp:number | string) {
    const token = jwt.sign(data, secret, {expiresIn : exp});

    return token;
}

export async function verifyToken(token: any, secret: string): Promise<any> {
    const tokenPayload = jwt.verify(token, secret);

    return tokenPayload;
}
