import { inngest } from "@/lib/inngest"
import { prismaClient } from "../db";

interface CreateTicketData {
    title: string;
    description: string;
    priority: string;
    deadline: Date;
    createdById: string;
}

export const createTicket = async (data: CreateTicketData) => {
    try {
        const ticket = await prismaClient.ticket.create({
            data: {
                ...data,
                helpfulNotes: "",
                relatedSkills: [],
                status: "TODO"
            }
        })

        // Trigger AI processing
        await inngest.send({
            name: "ticket/created",
            data: { ticketId: ticket.id }
        })

        return ticket
    } catch (error) {
        console.error("Create ticket error:", error instanceof Error ? error.message : error)
        throw error
    }
}

export const getTickets = async (userId?: string, role?: string) => {
    try {
        const whereClause = role === "USER" ? { createdById: userId } : {};

        return await prismaClient.ticket.findMany({
            where: whereClause,
            include: {
                createdBy: {
                    select: { email: true }
                },
                assignedTo: {
                    select: { email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error("Get tickets error:", error instanceof Error ? error.message : error)
        throw error;
    }
}

export const getTicket = async (ticketId: string) => {
    try {
        return await prismaClient.ticket.findUnique({
            where: { id: ticketId },
            include: {
                createdBy: {
                    select: { email: true }
                },
                assignedTo: {
                    select: { email: true }
                }
            }
        })
    } catch (error) {
        console.error("Get ticket error:", error instanceof Error ? error.message : error)
        throw error;
    }
}