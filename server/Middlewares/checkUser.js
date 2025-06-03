import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const fetchUser = (req, res, next) => {
    const token = req.header('authToken');
    
    if (!token) {
        res.status(401).send({ error: "Authentication did not happen" });
    } else {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);
            req.user = data;
            next();
        } catch (error) {
            res.status(401).send({ error: "Authentication did not happen" });
        }
    }
}

export default fetchUser;
