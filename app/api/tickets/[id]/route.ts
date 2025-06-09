// app/api/tickets/[id]/route.ts - Missing!
import { getTicket } from "@/lib/controllers/ticket";
import { getCurrentUser } from "@/lib/middleware/auth";

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
