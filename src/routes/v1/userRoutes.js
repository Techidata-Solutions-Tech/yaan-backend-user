// routes/userRoutes.js
import express from 'express';
import { registerUser, userProfile ,EmailLoginUser,userProfileChangeDOB,
    userProfileChangeName,
    userProfileChangeEmail,userProfileChangePhoneEmergency,
    userProfileChangePhone,userProfileChangeEmailVerify,
    userProfileChangePhoneVerify,userAccountDelete, userNotfication,userNotficationMessage
    ,userNotficationWallet

} from '../../contollers/v1/userController.js';

const router = express.Router();

// POST /api/v1/users/register - Register a new user
router.post('/register', registerUser);
router.post('/login/email',EmailLoginUser);
router.get('/profile',userProfile);
router.put('/profile/dob',userProfileChangeDOB);
router.put('/profile/name',userProfileChangeName);
router.put('/profile/emergency-phone',userProfileChangePhoneEmergency);

router.put('/profile/phone',userProfileChangePhone);
router.put('/profile/phone/verify',userProfileChangePhoneVerify);

router.put('/profile/email',userProfileChangeEmail);
router.put('/profile/email/verify',userProfileChangeEmailVerify);
router.get('/delete-account',userAccountDelete);


router.post('/notification', userNotfication);
router.get('/notfication/message',userNotficationMessage);
router.get('/notfication/wallet',userNotficationWallet);



export default router;
