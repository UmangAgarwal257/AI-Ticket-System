"use client"
import { useSession } from "next-auth/react"
import { LandingPage } from "@/components/LandingPage"
import { UserDashboard } from "@/components/dashboards/UserDashboard"
import { AdminDashboard } from "@/components/dashboards/AdminDashboard"
import { ModeratorDashboard } from "@/components/dashboards/ModeratorDashboard"

interface User {
    id?: string
    name?: string
    email?: string
    image?: string
    role?: "USER" | "MODERATOR" | "ADMIN"
}

export const AppRouter = () => {
  const { data: session, status } = useSession()

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  if (!session) {
    return <LandingPage/>
  }

  // Show appropriate dashboard based on user role
  const userRole = (session.user as User)?.role

  console.log(userRole)

  if (userRole === 'ADMIN') return <AdminDashboard />
  if (userRole === 'MODERATOR') return <ModeratorDashboard />
  if (userRole === 'USER') return <UserDashboard />
  
  // Fallback for unknown roles
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl mb-4">Access Denied</h1>
      <p className="text-slate-400">Your account role is not recognized.</p>
    </div>
  )
}