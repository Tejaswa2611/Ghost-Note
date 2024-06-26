import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await connectDB();
    try {
        const { username, email, password } = await request.json();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            },
                {
                    status: 400
                }
            )
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        // two cases -- if user email exists and is verified, return error,
        // -- if user email exists and not verified, update the user with new otp and expiry date
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exists"
                },
                    {
                        status: 400
                    }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = otp;
                existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            const currentDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                createdOn: currentDate,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();
        }
        // send otp to users
        const emailResponse = await sendVerificationEmail(email, username, otp);
        console.log("emailResponse->", emailResponse);
    
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Error sending verification email"
            },
                {
                    status: 500
                }
            )
        }
        return Response.json({
            success: true,
            message: "User registered successfully"
        },
            {
                status: 201
            }
        )

    } catch (error) {
        console.error("Error registering user->", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            {
                status: 500
            }
        )
    }
}