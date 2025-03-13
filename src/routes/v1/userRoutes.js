// routes/userRoutes.js
import express from 'express';
import { registerUser,phoneVerification ,requestOTPLogin,loginUser, userProfile 
    ,updateProfile,userProfileChangePhoneVerify,getUserNotfication,userNotfication,addAddress,
    getFavoriteAddresses,addFavoriteAddress , userExist
    
    
    
   ,EmailLoginUser,
    userProfileChangeName,
    userProfileChangeEmail,userProfileChangePhoneEmergency,
    userProfileChangePhone,userProfileChangeEmailVerify,
  userAccountDelete,
  requestResendOTPLogin,
 

} from '../../contollers/v1/userController.js';

import {authUser} from '../../../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', phoneVerification );
router.post('/verify', userExist);
router.post('/send-otp',requestOTPLogin);
router.post('/resend-otp',requestResendOTPLogin);











// router.post('/resend-otp',requestResendOTPLogin);

// router.get('/profile',authUser,userProfile);
// router.post('/profile',authUser,updateProfile);
// router.put('/profile',authUser,userProfileChangePhoneVerify);
// router.get('/notification',authUser, getUserNotfication);
// router.post('/address',authUser, addAddress);
// router.get('/favorite',authUser,  getFavoriteAddresses);
// router.patch('/favorite',authUser, addFavoriteAddress );
// router.get('/delete-account',authUser, userAccountDelete);


// router.post('/notification',authUser, userNotfication);




export default router;
