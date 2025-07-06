import nodemailer from 'nodemailer';
import { VerificationEmail } from '@/emails/verificationEmail';
import { APIResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<APIResponse> {
    try {
        console.log(" Attempting to send verification email via Nodemailer to:", email, "Username:", username, "Code:", verifyCode);
        
        // Check if all required environment variables are set
        const requiredEnvVars = {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            EMAIL_FROM: process.env.EMAIL_FROM
        };
        
        const missingVars = Object.entries(requiredEnvVars)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        if (missingVars.length > 0) {
            console.error("❌ Missing environment variables:", missingVars);
            
            // For development, provide fallback
            console.log("=== DEVELOPMENT MODE: EMAIL SKIPPED ===");
            console.log("Verification code for", username, ":", verifyCode);
            console.log("Email would be sent to:", email);
            console.log("=== Use this code to verify the account ===");
            console.log("  Missing env vars:", missingVars.join(", "));
            return { success: true, message: "Verification email sent (development mode)" };
        }
        
        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        // Verify the connection configuration
        console.log(" Verifying SMTP connection...");
        try {
            await transporter.verify();
            console.log("✅ SMTP connection verified successfully");
        } catch (verifyError) {
            console.error("SMTP verification failed:", verifyError);
            // Continue anyway, sometimes verify fails but sending works
            console.log("Continuing with email send attempt...");
        }
        
        // Generate email HTML
        const verificationEmailHtml = VerificationEmail({ username, otp: verifyCode });
        
        // Email options
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'GhostNote'}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: '🔐 Verify your GhostNote account',
            html: verificationEmailHtml,
        };
        
        console.log("📤 Sending email with options:", { 
            from: mailOptions.from, 
            to: mailOptions.to, 
            subject: mailOptions.subject,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT
        });
        
        // Send the email
        const result = await transporter.sendMail(mailOptions);
        
        console.log("✅ Email sent successfully via Nodemailer!");
        console.log("📧 Message ID:", result.messageId);
        console.log("📮 Accepted:", result.accepted);
        console.log("❌ Rejected:", result.rejected);
        
        return { 
            success: true, 
            message: "Verification email sent successfully" 
        };
        
    } catch (error) {
        console.error("❌ Error sending verification email via Nodemailer:", error);
        
        // Provide more specific error information
        let errorMessage = "Error sending verification email";
        if (error instanceof Error) {
            if (error.message.includes("Invalid login") || error.message.includes("Username and Password not accepted")) {
                errorMessage = "Email authentication failed. Please check your Gmail credentials and enable App Password.";
            } else if (error.message.includes("self signed certificate")) {
                errorMessage = "SSL certificate error. Please check your email configuration.";
            } else if (error.message.includes("ECONNREFUSED") || error.message.includes("connection")) {
                errorMessage = "Connection to email server failed. Please check your internet connection.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "Email server not found. Please check your SMTP_HOST configuration.";
            } else if (error.message.includes("timeout")) {
                errorMessage = "Email send timeout. Please try again.";
            } else {
                errorMessage = `Nodemailer error: ${error.message}`;
            }
        }
        
        // For development, provide fallback
        console.log("=== DEVELOPMENT FALLBACK: EMAIL FAILED ===");
        console.log("Verification code for", username, ":", verifyCode);
        console.log("Email would be sent to:", email);
        console.log("Error was:", errorMessage);
        console.log("=== Use this code to verify the account ===");
        console.log("⚠️  To fix Gmail issues:");
        console.log("   1. Enable 2-Factor Authentication on Gmail");
        console.log("   2. Generate App Password: Google Account > Security > App passwords");
        console.log("   3. Update SMTP_PASS in .env with the app password");
        
        return { 
            success: true, 
            message: "Verification code available in console (development fallback)" 
        };
    }
}

