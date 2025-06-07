import { requireAdmin } from "@/lib/middleware/auth";
import { getUsers } from "@/lib/controllers/user";

export async function GET() {
    try {
        await requireAdmin(); 
        const users = await getUsers();

        return Response.json(users);
    } catch (error) {
        return Response.json({
            error: error instanceof Error ? error.message : "An error occurred"
        }, { 
            status: error instanceof Error && error.message === "Forbidden" ? 403 : 401
        });
    }
}