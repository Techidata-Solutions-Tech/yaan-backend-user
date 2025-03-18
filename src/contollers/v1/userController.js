

import User from '../../models/User.js';
import Address from '../../models/Address.js';
import { userSchema ,phoneSchema, phoneNumberSchema,updateUserSchema ,addressSchema} from '../../../validators/userValidator.js';

import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const validatedData = await userSchema.parseAsync(req.body);

    const { name, phone } = validatedData;

    const existingUser = await User.findOne({ phone, phone_verified:true });
    if (existingUser) {
      return res.status(500).json({ message: 'User already exists',success:false });
    }

    const otp = '123456';
    const newUser = new User({ name,  phone,otp_phone:otp, otp_phone_expiry: Date.now() + process.env.OTP_EXPIRATION_TIME * 1000});
    const user = await newUser.save();

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (error) {
    console.log(error)
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message ,success:false});
    }
    return res.status(500).json({success: false, message: 'Something went wrong' });
}
};

export const phoneVerification = async (req,res) =>{

  try{
    const validatedData = await phoneSchema.parseAsync(req.body);
    const { phone,otp } = validatedData;
    const existingUser = await User.findOne({ phone}).sort({createdAt:-1});
    if (!existingUser) {
      return res.status(500).json({ message: 'User not found',success:false });
    }
    if (existingUser.isDeleted) {
      return res.status(500).json({ message: 'User not found',success:false });
    }
    if(existingUser.otp_phone !== otp){
      return res.status(500).json({ message: 'OTP not matched' ,success:false});
    }
    if (!existingUser.otp_phone_expiry || existingUser.otp_phone_expiry < Date.now()) {
      return res.status(500).json({ message: 'OTP expired',success:false });
    }
    existingUser.phone_verified = true;
    existingUser.otp = null;
    existingUser.otp_phone_expiry = null;
    const isVerified = await existingUser.save()
    if(isVerified){
      return res.status(200).json({ success:true, verified:true });
    }
    return res.status(500).json({  success:false, error: 'Invalid OTP' });

  } catch (error) {
    console.log(error)
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message,success:false });
    }
    return res.status(500).json({ message: 'Internal server error',success:false });
  }
};

export const userExist = async (req,res) =>{
 
  try{
    const validatedData = await phoneNumberSchema.parseAsync(req.body);
    const { phone } = validatedData;
    const existingUser = await User.findOne({ phone,phone_verified:true });
    if (!existingUser) {
      return res.status(500).json({ error: 'User not found',success:false });
    }
    if (existingUser.isDeleted) {
      return res.status(500).json({ error: 'User not found',success:false });
    }
    if(existingUser){
      return res.status(200).json({ success:true,userExists:true,userId:existingUser._id});
    }
    return res.status(500).json({ error: 'User not found',success:false });
  } catch (error) {
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message,success:false });
    }
    return res.status(500).json({ message: 'Internal server error',success:false });
  }
};

export const requestOTPLogin = async (req,res) =>{
 
  try{
    const validatedData = await phoneNumberSchema.parseAsync(req.body);
    const { phone } = validatedData;
    const existingUser = await User.findOne({ phone,phone_verified:true });
    const otp = '123456';
    if (!existingUser) {
      const newUser = new User({ phone,otp_phone:otp, otp_phone_expiry: Date.now() + process.env.OTP_EXPIRATION_TIME * 1000});
      const user = await newUser.save();
      if(user){
        return res.status(200).json({ success:true,otpSent:true});
      }
      return res.status(500).json({ error: 'User not found',success:false });
    }else{
      existingUser.otp_phone = otp;
      existingUser.otp_phone_expiry=Date.now() + process.env.OTP_EXPIRATION_TIME * 1000;
      const isOTPSend = await existingUser.save();
      if(isOTPSend){
        return res.status(200).json({ success:true,otpSent:true});
      }
      return res.status(500).json({ error: 'Failed to send OTP',success:false });
    }
    
   
  } catch (error) {
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message,success:false });
    }
    return res.status(500).json({ message: 'Internal server error',success:false });
  }
};

export const requestResendOTPLogin = async (req,res) =>{
 
  try{
    const validatedData = await phoneNumberSchema.parseAsync(req.body);
    const { phone } = validatedData;
    const existingUser = await User.findOne({ phone,phone_verified:true });
    if (!existingUser) {
      return res.status(500).json({ message: 'User not found',success:false });
    }
    if (existingUser.isDeleted) {
      return res.status(500).json({ message: 'User not found',success:false });
    }
    const otp = '123456';
    existingUser.otp_phone = otp;
    existingUser.otp_phone_expiry=Date.now() + process.env.OTP_EXPIRATION_TIME * 1000;
    const isOTPSend = await existingUser.save()
    if(isOTPSend){
      return res.status(200).json({ otpResent:true,success:true });
    }
    return res.status(500).json({success:false, message: 'OTP limit exceeded' });
    

  } catch (error) {
    if (error?.errors?.[0]?.message) {
        return res.status(400).json({ message: error.errors[0].message });
    }
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};


































// ----------------------old--------------------------------









export const loginUser = async (req,res) =>{
  try {
    const validatedData = await phoneSchema.parseAsync(req.body);
    const { phone,otp } = validatedData;

    const existingUser = await User.findOne({ phone,phone_verified:true});
    if (existingUser.isDeleted) {
      return res.status(500).json({ message: 'User not found' });
    }
    if(!existingUser.otp_login || existingUser.otp_login !== otp){
      return res.status(500).json({ message: 'OTP not matched' });
    }
    if (!existingUser.otp_login_expiry || existingUser.otp_login_expiry < Date.now()) {
      return res.status(500).json({ message: 'OTP expired' });
    }
    return res.status(200).json({ message: 'Login successful',token:existingUser.generateAuthToken()});
  

  } catch (error) {
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message });
    }
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const userProfile = async (req, res) => {
  try {
    
    const getUser = await User.findById(req.user._id).select('name phone email dob createdAt emergency_phone -_id')
    
    if (!getUser) {
      return res.status(500).json({ message: 'User not found' });
    }


    return res.status(200).json({ message: 'User found' , user: getUser});

  } catch (error) {
    console.error('Error in accountStatus:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};








export const EmailLoginUser = async (req,res) =>{
  try {
    const { email, password } = req.body;
    // await UserValidationSchema.parseAsync(phone)
    if (!email) return res.status(500).json({ message: 'Email number is required' });
    if (!password) return res.status(500).json({ message: 'Password number is required' });
    const existingUser = await User.findOne({  email, email_verified:true});
    if (!existingUser || existingUser.isDeleted) {
      return res.status(500).json({ message: 'User not found' });
    }
    if(!existingUser.password || existingUser.password !== password){
      return res.status(500).json({ message: 'Password not matched' });
    }
    
    const token = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, { expiresIn: '30d' });
    return res.status(500).json({ message: 'Login successful',token});
   

  } catch (error) {
    if (error?.errors?.[0]?.message) {
        return res.status(500).json({ message: error.errors[0].message });
    }
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const userAccountDelete = async (req, res) => {
  try {
    
    
    // Find the driver by ID
    const existingUser = await User.findOneAndUpdate(
      { _id: req.user._id,  }, // Match document by ID and ensure `isDeleted` is 0
      { $set: { isDeleted: true } }, // Update fields as needed
      { new: true } // Return the updated document
    );
    
    if (!existingUser) {
      return res.status(500).json({ message: 'Driver not found' });
    } else {
       return res.status(200).json({ message: 'Driver deleted'});
    }
    

  } catch (error) {
    console.error('Error in accountStatus:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






export const updateProfile = async (req, res) => {
  try {
    const validatedData = await updateUserSchema.parseAsync(req.body);

    // If validation passes, proceed with user registration
    const { name, email, phone, dob, emergency_phone } = validatedData;

    let update_fields = {};
    if(phone){
      const phoneAlreadyexist = await User.findOne({ phone,phone_verified:true});
      if(phoneAlreadyexist){
        return res.status(500).json({ message: 'Phone already exist' });
      }
      update_fields = {
        name, email,  
        temp_phone : phone, dob, emergency_phone, otp_phone_expiry : Date.now() + process.env.OTP_EXPIRATION_TIME * 1000, otp_phone: '1234'
      }
     
    }else{
      update_fields = {
        name, email, dob, emergency_phone,
      }
    }
    const updateResult = await User.updateOne(
      { _id: req.user._id }, // Match document by ID
      { $set: update_fields }    // Update the dob field
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Nothing to update' });
    }

    // Success response
    return res.status(200).json({
      message: 'Updated successfully',
    });

  } catch (error) {
    console.log(error)
    if (error?.errors?.[0]?.message) {
      return res.status(500).json({ message: error.errors[0].message });
    }
  return res.status(500).json({ message: 'Internal server error' });
  }
};


export const userProfileChangePhoneVerify = async (req, res) => {
  try {
   

    const {otp } = req.body;


    if (!otp) {
      return res.status(500).json({ message: 'OTP is missing' });
    }

    // Decode the token
  

    // Find the user
    const getUser = await User.findById({ _id: req.user.id });
    if (!getUser) {
      return res.status(500).json({ message: 'User not found' });
    }

    // Validate OTP and expiry
    if (getUser.otp_phone !== otp) {
      return res.status(500).json({ message: 'Invalid OTP' });
    }

    if (getUser.otp_phone_expiry <  Date.now()) {
      return res.status(500).json({ message: 'OTP has expired' });
    }

    // Update the phone number after successful OTP verification
    const updateResult = await User.updateOne(
      { _id: getUser._id }, // Match document by ID
      { 
        $set: { phone:getUser.temp_phone, otp_phone: null,
          otp_phone_expiry: null, temp_phone: null,
          phone_verified:true } // Finalize phone update and clear temp fields
      }
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update phone number' });
    }

    // Success response
    return res.status(200).json({
      message: 'Phone number updated successfully',
    });

  } catch (error) {
    console.error('Error in userProfileChangePhoneVerify:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserNotfication = async (req, res) => {
  try {
    
    const getUser = await User.findById(req.user?._id);

    const { message, wallet } = getUser.notification;

    return res.status(200).json({ message, wallet });
  
  } catch (error) {
    console.error('Error adding notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
export const userNotfication = async (req, res) => {
  try {
    
   
    
    const getDriver = await User.findById(req.user?._id)
    
    const { message, wallet } = req.body; // Destructure notifications from request body

    // Validate input
    if (!message && !wallet) {
      return res.status(500).json({ success: false, message: 'Message or wallet notification required.' });
    }

    // Find the driver
   
    if (!getDriver) {
      return res.status(500).json({ success: false, message: 'Driver not found.' });
    }

    // Push new notifications
    if (message) {
      getDriver.notification.message.push({
        isRead: false, // Default unread status
        message: message, // Notification content
      });
    }

    if (wallet) {
      getDriver.notification.wallet.push({
        isRead: false, // Default unread status
        wallet: wallet, // Notification content
      });
    }

    // Save the updated driver document
    await getDriver.save();

    return res.status(200).json({ success: true, message: 'Notifications added successfully!' });
  } catch (error) {
    console.error('Error adding notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};








export const addAddress = async (req, res) => {
  try {
    const validatedData = await addressSchema.parseAsync(req.body);

    // If validation passes, proceed with user registration
    const {   name,
      state,
      city,
      addressLine1,
      addressLine2,
      houseNumber,
      landmark } = validatedData;
    // Fetch all favorite addresses for the logged-in user
    const createAddresses = await Address.create({  name,
      state,
      city,
      addressLine1,
      addressLine2,
      houseNumber,
      landmark , userId: req.user._id});

    if (createAddresses) {
      return res.status(200).json({ message : 'Address created' });
    }

    return res.status(500).json({ message : 'Address not created' });
  } catch (error) {
    if (error?.errors?.[0]?.message) {
      return res.status(500).json({ message: error.errors[0].message });
  }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFavoriteAddresses = async (req, res) => {
  try {
    // Fetch all favorite addresses for the logged-in user
    const favoriteAddresses = await Address.find({ userId: req.user._id, isFavorite: true });

    if (favoriteAddresses.length === 0) {
      return res.status(500).json([]);
    }

    return res.status(200).json( favoriteAddresses);
  } catch (error) {
    console.error('Error fetching favorite addresses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const addFavoriteAddress = async (req, res) => {
  try {
    const { addressId } = req.body; // Assume we get the addressId from the request body

    if (!addressId) {
      return res.status(500).json({ message: 'Address ID is required' });
    }

    // Find the address by ID and make sure it's associated with the user
    const address = await Address.findOne({ _id: addressId, userId: req.user._id });

    if (!address) {
      return res.status(500).json({ message: 'Address not found' });
    }

    // Mark the address as favorite
    address.isFavorite = true;
    await address.save();

    return res.status(200).json({ message: 'Address marked as favorite', address });
  } catch (error) {
    console.error('Error adding favorite address:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





export const userProfileChangeName = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(500).json({ message: 'Name is missing' });
    }

 

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    // Update the DOB
    const updateResult = await User.updateOne(
      { _id: decoded.id }, // Match document by ID
      { $set: { name } }    // Update the dob field
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Name is already the same' });
    }

    // Success response
    return res.status(200).json({
      message: 'Name updated successfully',
    });

  } catch (error) {
    console.error('Error in userProfileChangeDOB:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const userProfileChangePhone = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    const { phone } = req.body;

    if (!phone) {
      return res.status(500).json({ message: 'Phone number is missing' });
    }

    // Validate phone format (e.g., 10-digit number)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(500).json({ message: 'Invalid phone number format. It should be a 10-digit number.' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    const otp = '1234'

    // Update the phone
    const updateResult = await User.updateOne(
      { _id: decoded.id }, // Match document by ID
      { $set: {temp_phone: phone,otp_phone:otp,otp_login_expiry: Date.now() + 10 * 60 * 1000} }  // Update the phone field
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Phone number is already the same' });
    }

    // Success response
    return res.status(200).json({
      message: 'OTP sent successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const userProfileChangeEmail = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(500).json({ message: 'Email is missing' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(500).json({ message: 'Invalid email format' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    // Generate OTP (for simplicity, hardcoding here; ideally, generate dynamically)
    const otp = '1234';

    // Update the temporary email and OTP
    const updateResult = await User.updateOne(
      { _id: decoded.id }, // Match document by ID
      { $set: { temp_email: email, otp_email: otp, otp_email_expiry: Date.now() + 10 * 60 * 1000 } } // Expiry in 10 minutes
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Email is already the same' });
    }

    // Send OTP response
    return res.status(200).json({
      message: 'OTP sent to the new email successfully',
    });

  } catch (error) {
    console.error('Error in userProfileChangeEmail:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const userProfileChangeEmailVerify = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(500).json({ message: 'OTP is missing' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user
    const getUser = await User.findOne({ _id: decoded.id });

    if (!getUser) {
      return res.status(500).json({ message: 'User not found' });
    }

    // Validate OTP and expiry
    if (getUser.otp_email !== otp) {
      return res.status(500).json({ message: 'Invalid OTP' });
    }

    const now = Date.now();
    if (getUser.otp_email_expiry < now) {
      return res.status(500).json({ message: 'OTP has expired' });
    }

    // Finalize the email update
    const updateResult = await User.updateOne(
      { _id: decoded.id }, // Match document by ID
      { 
        $set: { email: getUser.temp_email, otp_email: null, otp_email_expiry: null, temp_email: null,email_verified:true } // Finalize email update
      }
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update email' });
    }

    // Success response
    return res.status(200).json({
      message: 'Email updated successfully',
    });

  } catch (error) {
    console.error('Error in userProfileChangeEmailVerify:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const userProfileChangePhoneEmergency = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    const { emergency_phone } = req.body;

    if (!emergency_phone) {
      return res.status(500).json({ message: 'Phone number is missing' });
    }

    // Validate phone format (e.g., 10-digit number)
    if (!/^\d{10}$/.test(emergency_phone)) {
      return res.status(500).json({ message: 'Invalid phone number format. It should be a 10-digit number.' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(500).json({ message: 'User not found' });
    }

    // Update the phone
    const updateResult = await User.updateOne(
      { _id: decoded.id }, // Match document by ID
      { $set: { emergency_phone} }  // Update the phone field
    );

    // Check if the update actually modified the document
    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Phone number is already the same' });
    }

    // Success response
    return res.status(200).json({
      message: 'Phone number updated successfully',
    });

  } catch (error) {
    console.error('Error in userProfileChangePhone:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






export const userNotficationMessage = async (req, res) => {
  try {
    
    
    const getDriver = await User.findById(req.user._id)
    
    // const { message} = getDriver.notification;

    // Return the notifications
    return res.status(200).json(getDriver.notification);
  } catch (error) {
    console.error('Error adding notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const userNotficationWallet = async (req, res) => {
  try {
    
    const token = req.headers.authorization;
    // Validate if token is provided
    if (!token) {
      return res.status(500).json({ message: 'Token not found' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Find the driver by ID
    const getDriver = await User.findById(decoded.id)
    
    const {wallet } = getDriver.notification;

    // Return the notifications
    return res.status(200).json({
      success: true,
      message: 'Notification wallet fetched successfully!',
      notification_wallet:wallet
    });
  } catch (error) {
    console.error('Error adding notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};