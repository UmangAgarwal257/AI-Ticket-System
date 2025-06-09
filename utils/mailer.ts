import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        console.log("🚀 Attempting to send email to:", to);
        console.log("📧 SMTP Config:", {
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            user: process.env.MAILTRAP_SMTP_USER ? "***" : "MISSING"
        });

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: parseInt(process.env.MAILTRAP_SMTP_PORT || '587'),
            auth: {
                user: process.env.MAILTRAP_SMTP_USER, 
                pass: process.env.MAILTRAP_SMTP_PASS, 
            },
        });

        const info = await transporter.sendMail({
            from: `"AI Ticket System" <noreply@example.com>`,
            to,
            subject,
            text,
        });

        console.log('✅ Message sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Mail error:", error);
        throw error;
    }
}