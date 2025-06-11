"use client"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, User } from "@prisma/client"

type TicketWithUser = Ticket & {
    createdBy: Pick<User, 'email'>
    assignedTo: Pick<User, 'email'> | null
}

export const ModeratorDashboard = () => {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<TicketWithUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets')
            if (response.ok) {
                const data = await response.json()
                setTickets(data)
            }
        } catch (error) {
            console.error('Error fetching tickets:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateTicketStatus = async (ticketId: string, status: string) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            
            if (response.ok) {
                fetchTickets()
            }
        } catch (error) {
            console.error('Error updating ticket:', error)
        }
    }

    const assignedTickets = tickets.filter(ticket => 
        ticket.assignedTo?.email === session?.user?.email
    )
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedToId)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-400">Moderator Dashboard</h1>
                        <p className="text-slate-400">Welcome back, {session?.user?.email}</p>
                    </div>
                    <Button 
                        onClick={() => signOut()}
                        className="bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-cyan-400">{assignedTickets.length}</div>
                            <p className="text-slate-400">Assigned to You</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-yellow-400">{unassignedTickets.length}</div>
                            <p className="text-slate-400">Unassigned</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-green-400">{tickets.length}</div>
                            <p className="text-slate-400">Total Tickets</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Assigned Tickets */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Assigned Tickets</h2>
                    {assignedTickets.length === 0 ? (
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="text-center py-8">
                                <p className="text-slate-400">No tickets assigned to you</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {assignedTickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-slate-800/50 border-slate-700">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-white">{ticket.title}</CardTitle>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    ticket.status === 'TODO' ? 'bg-yellow-900 text-yellow-300' :
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-900 text-blue-300' :
                                                    'bg-green-900 text-green-300'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    ticket.priority === 'low' ? 'bg-gray-700 text-gray-300' :
                                                    ticket.priority === 'medium' ? 'bg-orange-900 text-orange-300' :
                                                    'bg-red-900 text-red-300'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <CardDescription className="text-slate-400">
                                            {ticket.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="text-sm text-slate-500">
                                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                                <br />
                                                By: {ticket.createdBy.email}
                                            </div>
                                            
                                            {/* AI-generated helpful notes - Most important for moderators */}
                                            {ticket.helpfulNotes && (
                                                <div className="bg-slate-700/50 p-3 rounded">
                                                    <p className="text-xs text-slate-400 mb-1">🤖 AI Analysis:</p>
                                                    <p className="text-sm text-slate-300">{ticket.helpfulNotes}</p>
                                                </div>
                                            )}
                                            
                                            {/* Show related skills */}
                                            {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Required Skills:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ticket.relatedSkills.map((skill, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Action buttons */}
                                            <div className="flex gap-2 pt-2">
                                                {ticket.status !== 'COMPLETED' && (
                                                    <>
                                                        <Button
                                                            onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                                                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                                            size="sm"
                                                        >
                                                            In Progress
                                                        </Button>
                                                        <Button
                                                            onClick={() => updateTicketStatus(ticket.id, 'COMPLETED')}
                                                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                            size="sm"
                                                        >
                                                            Complete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Tickets */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                            <p className="text-slate-400">Loading tickets...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-white">{ticket.title}</CardTitle>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    ticket.status === 'TODO' ? 'bg-yellow-900 text-yellow-300' :
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-900 text-blue-300' :
                                                    'bg-green-900 text-green-300'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    ticket.priority === 'low' ? 'bg-gray-700 text-gray-300' :
                                                    ticket.priority === 'medium' ? 'bg-orange-900 text-orange-300' :
                                                    'bg-red-900 text-red-300'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <CardDescription className="text-slate-400">
                                            {ticket.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="text-sm text-slate-500">
                                                Created: {new Date(ticket.createdAt).toLocaleDateString()} by {ticket.createdBy.email}
                                                {ticket.assignedTo && (
                                                    <span className="ml-4">
                                                        | Assigned to: {ticket.assignedTo.email}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}