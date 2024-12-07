import { z } from 'zod';
export const userSchema = z.object({
  name: z.string({required_error: "Name is required",invalid_type_error: "Name must be a string"}).trim().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string({required_error: "Email is required",invalid_type_error: "Email must be a string"}).trim().email({ message: "Invalid email address" }),
  password: z.string({required_error: "Password is required",invalid_type_error: "Password must be a string",}).trim().min(6, { message: "Password must be at least 6 characters" }),
});
