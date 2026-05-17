import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'
import '../../styles/chat.css'

interface Conversation {
  id: number
  other_user: { id: number; name: string; email: string }
  last_message?: string
  updated_at: string
  unread?: boolean
}

interface Message {
  id: number
  content: string
  sender_id: number
  created_at: string
}

function ChatPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConv) fetchMessages(activeConv.id)
  }, [activeConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations')
      setConversations(res.data.data || [])
      if (res.data.data?.length > 0) setActiveConv(res.data.data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convId: number) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages`)
      setMessages(res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return
    setSending(true)
    try {
      const res = await api.post('/chat/messages', {
        conversation_id: activeConv.id,
        content: newMessage.trim(),
      })
      setMessages(prev => [...prev, res.data.data])
      setNewMessage('')
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  const formatConvTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return formatTime(dateStr)
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} días`
    return date.toLocaleDateString('es-CO')
  }

  const getInitials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'

  const filteredConvs = conversations.filter(c =>
    c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="chat-layout">

      {/* LEFT SIDEBAR */}
      <motion.aside
        className="chat-sidebar"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="chat-sidebar-logo">
          <h1>EDIFEX</h1>
        </div>

        <div className="chat-search-wrap">
          <div className="chat-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-conversations">
          {loading ? (
            [1, 2, 3].map(i => (
              <motion.div
                key={i}
                style={{ height: 64, borderRadius: 12, background: 'rgba(180,206,175,0.1)', margin: '0 8px' }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              />
            ))
          ) : filteredConvs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(180,206,175,0.5)', fontSize: 13 }}
            >
              No hay conversaciones aún.
            </motion.div>
          ) : (
            filteredConvs.map((conv, i) => (
              <motion.button
                key={conv.id}
                className={`chat-conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                onClick={() => setActiveConv(conv)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="chat-conv-avatar">
                  {getInitials(conv.other_user?.name)}
                </div>
                <div className="chat-conv-info">
                  <div className="chat-conv-top">
                    <span className="chat-conv-name">{conv.other_user?.name}</span>
                    <span className="chat-conv-time">{formatConvTime(conv.updated_at)}</span>
                  </div>
                  <p className="chat-conv-preview">
                    {conv.last_message || 'Sin mensajes aún'}
                  </p>
                </div>
                {conv.unread && <div className="chat-unread-dot" />}
              </motion.button>
            ))
          )}
        </div>

        <div className="chat-sidebar-footer">
          <button
            className="chat-sidebar-footer-inner"
            onClick={() => navigate('/worker/dashboard')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver al Dashboard
          </button>
        </div>
      </motion.aside>

      {/* MAIN CHAT */}
      <main className="chat-main">
        {!activeConv ? (
          <motion.div
            className="chat-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <h3>Selecciona una conversación</h3>
            <p>Elige un contacto para comenzar a chatear</p>
          </motion.div>
        ) : (
          <>
            {/* HEADER */}
            <motion.header
              className="chat-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="chat-header-left">
                <div className="chat-header-avatar">
                  <div className="chat-header-avatar-inner">
                    {getInitials(activeConv.other_user?.name)}
                  </div>
                  <span className="chat-online-dot" />
                </div>
                <div>
                  <p className="chat-header-name">{activeConv.other_user?.name}</p>
                  <p className="chat-header-status">En línea</p>
                </div>
              </div>
              <div className="chat-header-actions">
                <motion.button
                  className="chat-header-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="material-symbols-outlined">videocam</span>
                </motion.button>
                <motion.button
                  className="chat-header-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="material-symbols-outlined">info</span>
                </motion.button>
              </div>
            </motion.header>

            {/* MESSAGES */}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <motion.div
                  style={{ textAlign: 'center', color: '#737971', marginTop: 40 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8, color: '#c3c8bf' }}>
                    waving_hand
                  </span>
                  Envía un mensaje para iniciar la conversación
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => {
                    const isSent = msg.sender_id === user.id
                    return (
                      <motion.div
                        key={msg.id}
                        className={`chat-msg ${isSent ? 'sent' : 'received'}`}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <div className="chat-msg-bubble">{msg.content}</div>
                          <p className="chat-msg-time">{formatTime(msg.created_at)}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR */}
            <motion.footer
              className="chat-input-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="chat-input-inner">
                <button className="chat-input-add">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <input
                  type="text"
                  placeholder="Escribe tu mensaje aquí..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="chat-input-emoji">
                  <span className="material-symbols-outlined">sentiment_satisfied</span>
                </button>
                <motion.button
                  className="chat-send-btn"
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="material-symbols-outlined">send</span>
                </motion.button>
              </div>
            </motion.footer>
          </>
        )}
      </main>
    </div>
  )
}

export default ChatPage