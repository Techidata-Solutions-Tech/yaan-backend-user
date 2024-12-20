// routes/userRoutes.js
import express from 'express';
import { registerUser,phoneVerification ,requestOTPLogin,loginUser, userProfile 
    ,updateProfile,userProfileChangePhoneVerify,getUserNotfication,userNotfication,addAddress,
    getFavoriteAddresses,addFavoriteAddress 
    
    
    
   ,EmailLoginUser,
    userProfileChangeName,
    userProfileChangeEmail,userProfileChangePhoneEmergency,
    userProfileChangePhone,userProfileChangeEmailVerify,
  userAccountDelete

} from '../../contollers/v1/userController.js';

import {authUser} from '../../../middlewares/auth.middleware.js'

const router = express.Router();

// POST /api/v1/users/register - Register a new user
router.post('/register', registerUser);
router.post('/verify_otp', phoneVerification );
router.post('/send_otp',requestOTPLogin);
router.post('/verify_login_otp',loginUser);
router.get('/profile',authUser,userProfile);
router.post('/profile',authUser,updateProfile);
router.put('/profile',authUser,userProfileChangePhoneVerify);
router.get('/notification',authUser, getUserNotfication);
router.post('/address',authUser, addAddress);
router.get('/favorite',authUser,  getFavoriteAddresses);
router.patch('/favorite',authUser, addFavoriteAddress );
router.get('/delete-account',authUser, userAccountDelete);


// router.post('/notification',authUser, userNotfication);




export default router;
