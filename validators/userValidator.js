import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" }),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .trim()
    .email({ message: "Invalid email address" })
    .optional(),

  phone: z
    .string({ required_error: "Phone is required", invalid_type_error: "Phone must be a string" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
});

export const phoneSchema = z.object({
  phone: z
    .string({ required_error: "Phone is required", invalid_type_error: "Phone must be a string" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),

  otp: z
    .string({ required_error: "OTP is required", invalid_type_error: "OTP must be a string" })
    .trim()
    .min(4, { message: "Username must be at least 4 characters" }),
});

export const phoneNumberSchema = z.object({
  phone: z
    .string({ required_error: "Phone is required", invalid_type_error: "Phone must be a string" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
});

export const updateUserSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" })
    .optional(),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .trim()
    .email({ message: "Invalid email address" })
    .optional(),

  dob: z
    .string({ invalid_type_error: "Date of birth must be a string" })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of birth must be in the format YYYY-MM-DD" })
    .optional(),

  emergency_phone: z
    .string({ invalid_type_error: "Emergency number must be a string" })
    .trim()
    .regex(/^\d{10}$/, { message: "Emergency number must be exactly 10 digits" })
    .optional(),
});

export const addressSchema = z.object({
  name: z
    .string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" }),
  
  state: z
    .string({ required_error: "State is required", invalid_type_error: "State must be a string" })
    .trim()
    .min(2, { message: "State must be at least 2 characters" }),
  
  city: z
    .string({ required_error: "City is required", invalid_type_error: "City must be a string" })
    .trim()
    .min(2, { message: "City must be at least 2 characters" }),
  
  addressLine1: z
    .string({ required_error: "Address Line 1 is required", invalid_type_error: "Address Line 1 must be a string" })
    .trim()
    .min(5, { message: "Address Line 1 must be at least 5 characters" }),
  
  addressLine2: z
    .string({ invalid_type_error: "Address Line 2 must be a string" })
    .trim()
    .min(5, { message: "Address Line 2 must be at least 5 characters" })
    .optional(),
  
  houseNumber: z
    .string({ required_error: "House Number is required", invalid_type_error: "House Number must be a string" })
    .trim()
    .regex(/^\d+[a-zA-Z]?$/, { message: "House Number must be a valid format" }),
  
  landmark: z
    .string({ invalid_type_error: "Landmark must be a string" })
    .trim()
    .min(3, { message: "Landmark must be at least 3 characters" })
    .optional(),
});
