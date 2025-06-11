"use client"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export const LandingPage = () => {
    const { data: session } = useSession()

    if (session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20">
                {/* Hero */}
                <div className="text-center mb-20">
                    <div className="inline-block mb-6">
                        <span className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            TicketFlow
                        </span>
                        <div className="text-lg text-slate-400 font-mono mt-2">
                            AI-powered support
                        </div>
                    </div>
                    
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Stop drowning in support tickets. Let AI handle the routing, 
                        analysis, and assignment while you focus on solving real problems.
                    </p>
                    
                    <Button 
                        onClick={() => signIn('google')}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="group p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</div>
                        <h3 className="text-xl font-bold mb-3 text-cyan-400">Smart Analysis</h3>
                        <p className="text-slate-400 leading-relaxed">
                            AI instantly reads, understands, and categorizes every ticket. 
                            No more manual sorting through hundreds of requests.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                        <h3 className="text-xl font-bold mb-3 text-purple-400">Auto-Assignment</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Match tickets to the right experts based on skills, workload, 
                            and complexity. Your team works smarter, not harder.
                        </p>
                    </div>

                    <div className="group p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                        <h3 className="text-xl font-bold mb-3 text-pink-400">Priority Magic</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Critical issues get flagged instantly. Less important stuff waits. 
                            Your customers get help when they need it most.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20">
                    <div className="text-slate-500 font-mono text-sm mb-4">
                         Ready to upgrade your support game?
                    </div>
                    <div className="text-slate-600 text-xs">
                        No setup fees • No monthly limits • Just better support
                    </div>
                </div>
            </div>
        </div>
    )
}