import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-ember-500/40 text-8xl font-bold mb-4">404</p>
        <h1 className="font-display font-black text-4xl text-cream mb-4">Page Not Found</h1>
        <p className="text-muted font-body text-lg mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-ghost flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
