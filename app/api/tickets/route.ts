// app/api/tickets/route.ts - Missing!
import { createTicket, getTickets } from "@/lib/controllers/ticket";
import { getCurrentUser } from "@/lib/middleware/auth";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const ticket = await createTicket({
            ...body,
            createdById: user.id
        });

        return Response.json(ticket);
    } catch (error) {
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