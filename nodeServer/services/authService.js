import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  async hashing(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return { error: false, password: hashedPassword, msg: "success" };
    } catch (error) {
      return { error: true, msg: "Error in hashing password" };
    }
  }

  async generateToken(user) {
    try {
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return { error: false, msg: "Token generated successfully", token };
    } catch (error) {
      return { error: true, msg: "Failed to generate token" };
    }
  }

  seeder = async (req, res) => {
    try {
      const searchAdmin = await userModel.findOne({
        email: "admin@gmail.com",
        userRole: "admin",
      });
      const password = "admin@123";

      if (!searchAdmin) {
        const hashedPassword = await this.hashing(password);
        if (hashedPassword.error) {
          return { error: true, msg: "Error hashing password" };
        }

        const createAdmin = await userModel.create({
          email: "admin@gmail.com",
          name: "admin",
          password: hashedPassword.password,
          userRole: "admin",
        });
        return { error: false, msg: "Admin account created" };
      }
    } catch (error) {
      return {
        msg: "Failed to create or find admin",
        error: error.message,
      };
    }
  };

  auth = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return { error: true, msg: "Email or password missing" };
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return { error: true, msg: "Invalid credentials" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { error: true, msg: "Invalid credentials" };
      }

      if (user.status === false) {
        return { error: true, msg: "This account is blocked" };
      }

      const token = await this.generateToken(user);

      if (!token || token.error) {
        return { error: true, msg: "Token generation failed" };
      }

      return {
        error: false,
        msg: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      };

    } catch (err) {
      console.error("Auth error:", err);
      return { error: true, msg: "Internal server error" };
    }
  };
}

const auth = new AuthService();
export default auth;
