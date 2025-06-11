// app/api/tickets/route.ts - Missing!
import { createTicket, getTickets } from "@/lib/controllers/ticket";
import { getCurrentUser } from "@/lib/middleware/auth";
import { z } from "zod";

const createTicketSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
    priority: z.enum(['low', 'medium', 'high']),
    deadline: z.string().datetime("Invalid deadline format")
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        
        // Validate the request body
        const validatedData = createTicketSchema.parse(body);
        
        // Check if deadline is in the future
        const deadlineDate = new Date(validatedData.deadline);
        if (deadlineDate < new Date()) {
            return Response.json({ error: "Deadline must be in the future" }, { status: 400 });
        }

        const ticket = await createTicket({
            ...validatedData,
            deadline: deadlineDate,
            createdById: user.id
        });

        return Response.json(ticket, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ 
                error: "Invalid data", 
                details: error.errors 
            }, { status: 400 });
        }
        
        console.error('Error creating ticket:', error);
        return Response.json({ 
            error: error instanceof Error ? error.message : "Failed to create ticket" 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tickets = await getTickets(user.id, user.role);
        return Response.json(tickets);
    } catch (error) {
        return Response.json({ 
            error: error instanceof Error ? error.message : "Failed to get tickets" 
        }, { status: 500 });
    }
}