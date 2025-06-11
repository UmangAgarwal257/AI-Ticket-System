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

type UserWithDetails = User & {
    _count?: {
        createdTickets: number
        assignedTickets: number
    }
}

export const AdminDashboard = () => {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<TicketWithUser[]>([])
    const [users, setUsers] = useState<UserWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets')
    const [editingSkills, setEditingSkills] = useState<{[key: string]: string}>({})

    useEffect(() => {
        fetchTickets()
        fetchUsers()
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

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const updateUserRole = async (userId: string, role: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            })
            
            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating user role:', error)
        }
    }
    
    const updateUserSkills = async (userId: string, skills: string[]) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills })
            })
            
            if (response.ok) {
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating user skills:', error)
        }
    }

    const handleSkillsChange = (userId: string, skillsString: string) => {
        setEditingSkills(prev => ({
            ...prev,
            [userId]: skillsString
        }))
    }

    const saveSkills = (userId: string) => {
        const skillsString = editingSkills[userId] || ''
        const skills = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
        updateUserSkills(userId, skills)
        setEditingSkills(prev => {
            const newState = { ...prev }
            delete newState[userId]
            return newState
        })
    }

    const todoTickets = tickets.filter(ticket => ticket.status === 'TODO')
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'IN_PROGRESS')
    const completedTickets = tickets.filter(ticket => ticket.status === 'COMPLETED')

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-400">Admin Dashboard</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-yellow-400">{todoTickets.length}</div>
                            <p className="text-slate-400">TODO</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-blue-400">{inProgressTickets.length}</div>
                            <p className="text-slate-400">In Progress</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-green-400">{completedTickets.length}</div>
                            <p className="text-slate-400">Completed</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-2xl font-bold text-purple-400">{users.length}</div>
                            <p className="text-slate-400">Total Users</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <Button
                        onClick={() => setActiveTab('tickets')}
                        className={`cursor-pointer ${
                            activeTab === 'tickets'
                                ? 'bg-cyan-600 hover:bg-cyan-700'
                                : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        Manage Tickets
                    </Button>
                    <Button
                        onClick={() => setActiveTab('users')}
                        className={`cursor-pointer ${
                            activeTab === 'users'
                                ? 'bg-cyan-600 hover:bg-cyan-700'
                                : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        Manage Users
                    </Button>
                </div>

                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
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
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-slate-500">
                                                    Created: {new Date(ticket.createdAt).toLocaleDateString()} by {ticket.createdBy.email}
                                                    {ticket.assignedTo && (
                                                        <span className="block">
                                                            Assigned to: {ticket.assignedTo.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="text-sm text-slate-500">
                                                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                                
                                                {/* Show AI-generated helpful notes */}
                                                {ticket.helpfulNotes && (
                                                    <div className="bg-slate-700/50 p-3 rounded">
                                                        <p className="text-xs text-slate-400 mb-1">AI Analysis:</p>
                                                        <p className="text-sm text-slate-300">{ticket.helpfulNotes}</p>
                                                    </div>
                                                )}
                                                
                                                {/* Show related skills */}
                                                {ticket.relatedSkills.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {ticket.relatedSkills.map((skill, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <Card key={user.id} className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* User Info & Role */}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-white font-medium">{user.email}</h3>
                                                    <p className="text-slate-400 text-sm">
                                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                                                        user.role === 'ADMIN' ? 'bg-red-900 text-red-300' :
                                                        user.role === 'MODERATOR' ? 'bg-blue-900 text-blue-300' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                        className="p-2 bg-slate-700 border border-slate-600 rounded text-white cursor-pointer"
                                                    >
                                                        <option value="USER">USER</option>
                                                        <option value="MODERATOR">MODERATOR</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Skills Management */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-slate-300">
                                                    Skills (comma-separated)
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={editingSkills[user.id] !== undefined 
                                                            ? editingSkills[user.id] 
                                                            : user.skills?.join(', ') || ''
                                                        }
                                                        onChange={(e) => handleSkillsChange(user.id, e.target.value)}
                                                        placeholder="e.g., React, Node.js, MongoDB"
                                                        className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                                                    />
                                                    {editingSkills[user.id] !== undefined && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => saveSkills(user.id)}
                                                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                                size="sm"
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                onClick={() => setEditingSkills(prev => {
                                                                    const newState = { ...prev }
                                                                    delete newState[user.id]
                                                                    return newState
                                                                })}
                                                                className="bg-gray-600 hover:bg-gray-700 cursor-pointer"
                                                                size="sm"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Display current skills as tags */}
                                                {user.skills && user.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {user.skills.map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}