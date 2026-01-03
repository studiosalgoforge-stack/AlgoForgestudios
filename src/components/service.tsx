
import { Clock, ArrowRight, AlertTriangle } from "lucide-react";



export default function ServicePage() {
  

    
    
      

  return (
    <div 
      className="min-h-screen bg-black flex items-center justify-center p-4"
      
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative">
          {/* Glitch effect overlay */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 blur-xl"></div>

          {/* Main content */}
          <div className="relative bg-black border-2 border-red-600/50 rounded-lg p-8 md:p-12 shadow-2xl shadow-red-900/50">
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4 tracking-wider">
              SERVICE TEMPORARILY UNAVAILABLE
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 mb-8">
              This website is currently offline due to a security incident
            </p>

            {/* Security notice */}
            <div 
              className="bg-red-950/20 border border-red-500/50 rounded-lg p-5 mb-10 text-left"
              
            >
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-mono">Security Notice</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                This site has been <span className="text-red-400 font-semibold">compromised</span> by{" "}
                <span className="text-purple-400 font-semibold">
                  PhantomRoot Crew
                </span>
                .
                <br />
                <br />
                Site owner: Contact us immediately at{" "}
                <span className="text-cyan-400 font-mono">phantom@securemail.ch</span>{" "}
                to discuss terms for restoration of access.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-400 mb-10">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Site access has been restricted until further notice</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-red-900/50">
              <p className="text-xs text-red-500/70 font-mono">
                ACCESS DENIED • SYSTEM COMPROMISED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}