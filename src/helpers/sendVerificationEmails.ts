import nodemailer from 'nodemailer';
import { VerificationEmail } from '@/emails/verificationEmail';
import { APIResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<APIResponse> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.APP_PASS
            }
        });
        const verificationEmail = VerificationEmail({username, otp: verifyCode});
        transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify Ghost Note account",
            html: verificationEmail
        });
        return { success: true, message: "Verification email sent" };
    } catch (error) {
        console.error("Error sending verification email->", error);
        return { success: false, message: "Error sending verification email" }
    }
}

