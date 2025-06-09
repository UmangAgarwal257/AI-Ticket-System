import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { onSignup } from "@/inngest/functions/on-signup";
import { onTicketCreated } from "@/inngest/functions/on-ticket-create";

export const {GET , POST , PUT} = serve({
    client: inngest,
    functions: [
        onSignup,
        onTicketCreated
    ]
})