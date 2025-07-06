export function VerificationEmail({ username, otp }: { username: string; otp: string }): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your GhostNote Account</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { background: linear-gradient(135deg, #9333ea, #3b82f6); color: white; width: 60px; height: 60px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
                .code-box { background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #9333ea; font-family: monospace; }
                .warning { background: #fef3cd; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">📧</div>
                    <h1 style="color: #1f2937; margin: 0;">Welcome to GhostNote!</h1>
                    <p style="color: #6b7280; margin: 10px 0;">Hi ${username}, you're almost there!</p>
                </div>
                
                <p>Thank you for signing up for GhostNote. To complete your registration and verify your email address, please use the verification code below:</p>
                
                <div class="code-box">
                    <div class="code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #6b7280;">Enter this code on the verification page</p>
                </div>
                
                <div class="warning">
                    <strong>⏰ Important:</strong> This verification code expires in 1 hour and can only be used once. Please do not share this code with anyone.
                </div>
                
                <p>If you didn't create an account with GhostNote, you can safely ignore this email.</p>
                
                <div class="footer">
                    <p>Thanks for joining GhostNote!</p>
                    <p style="margin: 5px 0;">Questions? Contact us at support@ghostnote.com</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
