import { prismaClient } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { sendMail } from "@/lib/mailer";
import { NonRetriableError } from "inngest";

export const onSignup = inngest.createFunction(
  { id: "on-user-signup", retries : 2 },
  { event: "user/signup" },
  async ({ event , step  }) => {
    try {
        const { userId } = event.data

        const user = await step.run("get-user-email", async () => {
            const userObject =  await prismaClient.user.findUnique({
                where: { id:userId}
            }); 

            if(!userObject) {
                throw new NonRetriableError("User not found");
            }
            return userObject;
        })

        await step.run("send-welcome-email", async() => {
            const subject = `Welcome to the app`
            const message = `Hi,
            
            Thanks for signing up. We're glad to have you onboard!

            Best regards,
            AI Ticket System Team`
            await sendMail(user.email, subject, message);
        })

        return { success: true }

    } catch (error) {
        console.error("Error running step" ,error instanceof Error ? error.message : error)
        return {success: false }
    }
  }
);