"use client"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, User } from "@prisma/client"

// Define the type that matches your API response
type TicketWithUser = Ticket & {
    createdBy: Pick<User, 'email'>
    assignedTo: Pick<User, 'email'> | null
}

export const UserDashboard = () => {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<TicketWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        deadline: ''
    })

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

    const createTicket = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    deadline: new Date(formData.deadline).toISOString()
                })
            })
            
            if (response.ok) {
                setFormData({ title: '', description: '', priority: 'medium', deadline: '' })
                setShowForm(false)
                fetchTickets()
            }
        } catch (error) {
            console.error('Error creating ticket:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-400">Support Dashboard</h1>
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
                {/* Create Ticket Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Your Support Tickets</h2>
                        <Button 
                            onClick={() => setShowForm(!showForm)}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 cursor-pointer"
                        >
                            {showForm ? 'Cancel' : '+ New Ticket'}
                        </Button>
                    </div>

                    {showForm && (
                        <Card className="mb-6 bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">Create New Ticket</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Describe your issue and we`&apos;`ll get you help
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={createTicket} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-300">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                                            placeholder="Brief description of your issue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-300">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none h-24"
                                            placeholder="Provide more details about the issue..."
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                                Priority
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                                Deadline
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer"
                                    >
                                        Submit Ticket
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Tickets List */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                            <p className="text-slate-400">Loading tickets...</p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="text-center py-8">
                                <p className="text-slate-400 mb-4">No tickets found</p>
                                <p className="text-sm text-slate-500">Create your first support ticket to get started</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map((ticket: TicketWithUser) => (
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
                                        <div className="space-y-2">
                                            <div className="text-sm text-slate-500">
                                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                                {ticket.assignedTo && (
                                                    <span className="ml-4">
                                                        Assigned to: {ticket.assignedTo.email}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Show AI detected skills - helps users understand the complexity */}
                                            {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">AI detected skills needed:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {ticket.relatedSkills.map((skill, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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