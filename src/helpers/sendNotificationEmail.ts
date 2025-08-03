import nodemailer from 'nodemailer';
import { APIResponse } from '@/types/apiResponse';

interface NotificationEmailProps {
  email: string;
  username: string;
  messagePreview: string;
  messageCount: number;
}

export async function sendNotificationEmail({
  email,
  username,
  messagePreview,
  messageCount
}: NotificationEmailProps): Promise<APIResponse> {
  try {
    console.log("📧 Sending notification email to:", email);
    
    // Check if email config exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log("⚠️ Email configuration missing, skipping notification");
      return { success: true, message: "Email notification skipped" };
    }
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Anonymous Message</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #3b82f6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .logo { color: white; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
          .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .message-preview { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin: 20px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">👻 GhostNote</div>
            <div class="subtitle">You have a new anonymous message!</div>
          </div>
          <div class="content">
            <h2>Hi ${username}! 👋</h2>
            <p>Someone sent you an anonymous message:</p>
            
            <div class="message-preview">
              <strong>Message Preview:</strong><br>
              "${messagePreview}${messagePreview.length > 100 ? '...' : ''}"
            </div>
            
            <p>You have <strong>${messageCount}</strong> unread message${messageCount > 1 ? 's' : ''} waiting for you.</p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="cta-button">
              View Your Messages
            </a>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <p style="font-size: 14px; color: #64748b;">
              Don't want these notifications? You can disable them in your 
              <a href="${process.env.NEXTAUTH_URL}/dashboard">dashboard settings</a>.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 GhostNote - Anonymous messaging made simple</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'GhostNote'}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `👻 New anonymous message for ${username}`,
      html: emailHtml,
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log("✅ Notification email sent successfully!");
    console.log("📧 Message ID:", result.messageId);
    
    return { 
      success: true, 
      message: "Notification email sent successfully" 
    };
    
  } catch (error) {
    console.error("❌ Error sending notification email:", error);
    
    return { 
      success: false, 
      message: `Failed to send notification email: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
} 