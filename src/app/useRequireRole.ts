import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Role, roleAtLeast } from '../auth/roles'

// NOTE: This assumes you'll later expose a session via an auth provider/hook.
// For now, this is a placeholder that redirects when no session/role exists.
type Session = { uid: string; role: Role | null } | null
function useSession(): Session {
  // TODO: replace with real auth hook once AuthGateway is added
  return null
}

export function useRequireRole(min: Role) {
  const nav = useNavigate()
  const session = useSession()
  useEffect(() => {
    if (!session || !roleAtLeast(session.role, min)) {
      nav('/login')
    }
  }, [session, min, nav])
}
