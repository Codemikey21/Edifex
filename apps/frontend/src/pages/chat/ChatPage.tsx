import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function ChatPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) { navigate('/login'); return }
    setUser(JSON.parse(storedUser))
    fetchConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations')
      setConversations(res.data.data || [])
    } catch (error) {
      console.error('Error cargando conversaciones')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convId: number) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}/messages`)
      setMessages(res.data.data || [])
    } catch (error) {
      console.error('Error cargando mensajes')
    }
  }

  const handleSelectConv = (conv: any) => {
    setActiveConv(conv)
    fetchMessages(conv.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return
    try {
      const res = await api.post('/chat/messages', {
        conversation_id: activeConv.id,
        content: newMessage,
        type: 'text',
      })
      setMessages([...messages, res.data.data])
      setNewMessage('')
    } catch (error) {
      console.error('Error enviando mensaje')
    }
  }

  const getOtherUser = (conv: any) => {
    if (!user) return null
    return user.id === conv.client_id ? conv.worker : conv.client
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col">
      {/* Header */}
      <div className="bg-[#1A2F1A] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Edifex" className="w-12 h-12 object-contain" />
          <span className="text-white font-bold text-lg tracking-widest">EDIFEX</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-white/70 text-sm hover:text-white transition-colors"
        >
          Volver
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>

        {/* Lista de conversaciones */}
        <div className="w-72 bg-white border-r border-[#E8E4DA] flex flex-col">
          <div className="px-5 py-4 border-b border-[#E8E4DA]">
            <h2 className="font-medium text-[#1A2F1A] text-sm">Conversaciones</h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-[#F5F2ED] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-gray-400 text-xs">No tienes conversaciones aun</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => {
                const other = getOtherUser(conv)
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full px-5 py-4 flex items-center gap-3 hover:bg-[#F5F2ED] transition-colors border-b border-[#F0EBE0] ${
                      activeConv?.id === conv.id ? 'bg-[#F5F2ED]' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1A2F1A] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {other?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-medium text-[#1A2F1A] truncate">{other?.name || 'Usuario'}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {conv.last_message?.content || 'Sin mensajes aun'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Selecciona una conversacion</p>
                <p className="text-gray-300 text-xs mt-1">para ver los mensajes</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header conversacion */}
              <div className="bg-white px-6 py-4 border-b border-[#E8E4DA] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A2F1A] flex items-center justify-center text-white text-xs font-medium">
                  {getOtherUser(activeConv)?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-[#1A2F1A] text-sm">{getOtherUser(activeConv)?.name}</p>
                  <p className="text-xs text-gray-400">En linea</p>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender_id === user?.id
                          ? 'bg-[#1A2F1A] text-white rounded-br-sm'
                          : 'bg-white text-[#1A2F1A] border border-[#E8E4DA] rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                      <div className={`text-xs mt-1 ${
                        msg.sender_id === user?.id ? 'text-white/50' : 'text-gray-400'
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input mensaje */}
              <form onSubmit={handleSendMessage} className="bg-white border-t border-[#E8E4DA] px-6 py-4 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-[#F5F2ED] border border-[#E8E4DA] rounded-xl px-4 py-2.5 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] placeholder-gray-300"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#1A2F1A] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2D4A2D] transition-colors disabled:opacity-50"
                >
                  Enviar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage