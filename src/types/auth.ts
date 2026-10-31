import { z } from "zod";

/**
 * User type representing the core user data without sensitive information.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
}

/**
 * LoginCredentials type for validating login form inputs.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * RegisterCredentials type for validating registration form inputs.
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Zod schema for validating user registration data.
 */
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Zod schema for validating user login data.
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});