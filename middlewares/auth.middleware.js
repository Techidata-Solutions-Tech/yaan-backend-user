import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

export const authUser =async (req, res,next)=>{
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[ 1 ] ;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded._id)
        
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
       
        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}