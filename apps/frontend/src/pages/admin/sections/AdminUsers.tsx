import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'

interface User {
  id: number
  name: string
  email: string
  created_at: string
  roles: { name: string }[]
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/users?page=${page}`)
      setUsers(res.data.data || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRole = (user: User) => user.roles?.[0]?.name || 'Sin rol'

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'background:#ffdad6;color:#93000a',
      worker: 'background:#bdebbd;color:#436c47',
      client: 'background:#e9e8e4;color:#434841',
    }
    return styles[role] || styles.client
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Usuarios</h2>
          <p style={{ color: '#737971', fontSize: 14 }}>{total} usuarios registrados en total</p>
        </div>
        <motion.button
          onClick={fetchUsers}
          style={{
            padding: '10px 20px', background: '#061a07', color: 'white',
            border: 'none', borderRadius: 9999, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em'
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ↻ Actualizar
        </motion.button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,47,26,0.05)' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#737971' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 32, height: 32, border: '3px solid #bdebbd', borderTopColor: '#3f6743', borderRadius: '50%', margin: '0 auto 12px' }}
            />
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#737971' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
              person_off
            </span>
            No hay usuarios registrados aún.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f3ef' }}>
                {['Usuario', 'Email', 'Rol', 'Fecha Registro', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: 11,
                    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid rgba(195,200,191,0.2)' }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#bdebbd', color: '#436c47',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 700, color: '#061a07', fontSize: 15 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 9999,
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      ...Object.fromEntries(getRoleBadge(getRole(u)).split(';').map(s => s.split(':').map(v => v.trim())).filter(([k]) => k))
                    }}>
                      {getRole(u)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{formatDate(u.created_at)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <motion.button
                      style={{
                        padding: '6px 14px', background: 'none', border: '1.5px solid #c3c8bf',
                        borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        color: '#434841', fontFamily: 'Inter, sans-serif'
                      }}
                      whileHover={{ borderColor: '#061a07', color: '#061a07' }}
                    >
                      Ver Perfil
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <motion.button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px', background: page === 1 ? '#efeeea' : '#061a07',
              color: page === 1 ? '#737971' : 'white', border: 'none',
              borderRadius: 9999, fontSize: 12, fontWeight: 700,
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif'
            }}
            whileHover={page > 1 ? { scale: 1.05 } : {}}
          >
            ← Anterior
          </motion.button>
          <span style={{ padding: '8px 16px', fontSize: 13, color: '#737971', display: 'flex', alignItems: 'center' }}>
            Página {page}
          </span>
          <motion.button
            onClick={() => setPage(p => p + 1)}
            disabled={users.length < 20}
            style={{
              padding: '8px 16px', background: users.length < 20 ? '#efeeea' : '#061a07',
              color: users.length < 20 ? '#737971' : 'white', border: 'none',
              borderRadius: 9999, fontSize: 12, fontWeight: 700,
              cursor: users.length < 20 ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif'
            }}
            whileHover={users.length >= 20 ? { scale: 1.05 } : {}}
          >
            Siguiente →
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

export default AdminUsers