import { createAgent, gemini } from "@inngest/agent-kit";
import { Ticket } from "@prisma/client";

interface AgentResponse {
    content: string;
}

const analyzeTicket = async(ticket : Pick<Ticket, 'title' | 'description' >) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-2.0-flash",
            apiKey: process.env.GEMINI_API_KEY || "",
        }),
        name: "AI Ticket Triage Assistant",
        system: `You are an expert AI assistant that processes technical support tickets.
        
    Your job is to:
    1. Summarize the issue.
    2. Estimate its priority.
    3. Provide helpful notes and resource links for human moderators.
    4. List relevant technical skills required.
    
    IMPORTANT SKILLS MAPPING:
    - Use these EXACT skill names only: ["React", "Node.js", "JavaScript", "TypeScript", "Database", "API", "Frontend", "Backend", "DevOps", "Mobile", "Testing", "Security"]
    - Map specific technologies to broader categories:
      * MongoDB/PostgreSQL/MySQL → "Database"
      * Express/FastAPI/Django → "Backend"
      * HTML/CSS → "Frontend"
      * REST/GraphQL → "API"
    
    IMPORTANT:
    - Respond with *only* valid raw JSON.
    - Do not include markdown, code fences, comments, or any extra formatting.
    - Use ONLY the predefined skill names above.`,
    })

    const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
    Analyze the following support ticket and provide a JSON object with:

    - summary: A short 1-2 sentence summary of the issue.
    - priority: One of "low", "medium", or "high".
    - helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue.
    - relatedSkills: An array of skills from this EXACT list only: ["React", "Node.js", "JavaScript", "TypeScript", "Database", "API", "Frontend", "Backend", "DevOps", "Mobile", "Testing", "Security"]

    EXAMPLES:
    - Database connection issue → ["Database", "Backend"]
    - React component not rendering → ["React", "Frontend", "JavaScript"]  
    - API authentication failing → ["API", "Backend", "Security"]

    Respond ONLY in this JSON format:

    {
    "summary": "Short summary of the ticket",
    "priority": "high", 
    "helpfulNotes": "Here are useful tips...",
    "relatedSkills": ["React", "Frontend"]
    }

    ---

    Ticket information:

    - Title: ${ticket.title}
    - Description: ${ticket.description}`)

    const raw = (response.output[0] as AgentResponse).content;

    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse JSON response:", error instanceof Error ? error.message : String(error));
        return null
    }
}

export default analyzeTicket;