import { prismaClient } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import analyzeTicket from "@/utils/ai";
import { sendMail } from "@/utils/mailer";
import { NonRetriableError } from "inngest";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries : 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
        const {ticketId} = event.data;

        const ticket = await step.run("fetch-ticket", async () => {
            const ticketObject = await prismaClient.ticket.findUnique({
                where : {id : ticketId}
            })
            if(!ticketObject) {
                throw new NonRetriableError("Ticket not found")
            }
            return {
                ...ticketObject,
                deadline: new Date(ticketObject.deadline),
                createdAt: new Date(ticketObject.createdAt)
            }    
        })

        await step.run("update-ticket-status" , async () => {
            await prismaClient.ticket.update({
                where : {id : ticketId},
                data : {
                    status : "TODO"
                }
            })
        })

        const aiResponse = await analyzeTicket(ticket)

        const relatedSkills = await step.run("ai-processing", async() => {
            let skills = []
            if(aiResponse) {
                await prismaClient.ticket.update({
                    where : { id: ticketId},
                    data : {
                        priority : !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" 
                        : aiResponse.priority,
                        helpfulNotes : aiResponse.helpfulNotes,
                        status : "IN_PROGRESS",
                        relatedSkills : aiResponse.relatedSkills
                    }
                })
                skills = aiResponse.relatedSkills
            }
            return skills
        })

        const moderator = await step.run("assign-moderator", async () => {
            let user = await prismaClient.user.findFirst({
                where : {
                    role : "MODERATOR",
                    skills : {
                        hasSome : relatedSkills
                    }
                },
                orderBy : {
                    createdAt: 'asc'
                }
            })
            if(!user) {
                user = await prismaClient.user.findFirst({
                    where : {
                        role : "ADMIN"
                    }
                })
            }
            await prismaClient.ticket.update({
                where: { id: ticketId },
                data : {
                    assignedToId: user?.id || null
                }
            })
            return user
        })

        await step.run("send-email-notification", async () => {
            if(moderator){
                const finalTicket = await prismaClient.ticket.findUnique({
                    where : {id : ticketId}
                })
                await sendMail(
                    moderator.email,
                    "Ticket assigned",
                    `A new ticket is assigned to you ${finalTicket?.title}`
                )
            }
        })

    } catch (error) {
        console.error("Error running the step", error instanceof Error ? error.message : String(error))
    }
  }
)