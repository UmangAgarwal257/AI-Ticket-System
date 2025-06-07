import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: parseInt(process.env.MAILTRAP_SMTP_PORT || '587'),
            auth: {
                user: process.env.MAILTRAP_SMTP_USER, 
                pass: process.env.MAILTRAP_SMTP_PASS, 
            },
        })

        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.MAILTRAP_SMTP_USER}>`,
            to,
            subject,
            text,

        })

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error("Mail error:", error instanceof Error ? error.message : error);
        throw error;
    }
}