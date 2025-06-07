import { requireAdmin } from "@/lib/middleware/auth";
import { updateUser } from "@/lib/controllers/user";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const body = await request.json();
        
        const updatedUser = await updateUser(params.id, body);
        
        return Response.json(updatedUser);
    } catch (error) {
        return Response.json({ 
            error: error instanceof Error ? error.message : "Update failed" 
        }, { 
            status: error instanceof Error && error.message === "Forbidden" ? 403 : 
                   error instanceof Error && error.message === "Unauthorized" ? 401 : 400 
        });
    }
}