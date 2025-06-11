// app/api/tickets/[id]/route.ts - Missing!
import { getTicket } from "@/lib/controllers/ticket";
import { getCurrentUser } from "@/lib/middleware/auth";
import { prismaClient } from "@/lib/db";
import { z } from "zod";

// Validation schema
const updateTicketSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
    assignedToId: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional()
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ticket = await getTicket(params.id);
        if (!ticket) {
            return Response.json({ error: "Ticket not found" }, { status: 404 });
        }

        return Response.json(ticket);
    } catch (error) {
        return Response.json({ 
            error: error instanceof Error ? error.message : "Failed to get ticket" 
        }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || !["ADMIN", "MODERATOR"].includes(user.role)) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        
        // Validate the request body
        const validatedData = updateTicketSchema.parse(body);
        
        const updatedTicket = await prismaClient.ticket.update({
            where: { id: params.id },
            data: validatedData,
            include: {
                createdBy: { select: { email: true } },
                assignedTo: { select: { email: true } }
            }
        });
        
        return Response.json(updatedTicket);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }
        
        return Response.json({ 
            error: error instanceof Error ? error.message : "Update failed" 
        }, { status: 500 });
    }
}
