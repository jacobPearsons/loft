import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Search, Send, ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/AuthProvider'
import { useConversations } from '@/lib/api-hooks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatRelativeTime } from '@/lib/mappers'
import type { Conversation } from '@/lib/types'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function MessagesPage() {
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const { conversations, loading, error } = useConversations(user?.email)
  const [search, setSearch] = useState('')
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showList, setShowList] = useState(true)

  const filtered = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSend() {
    if (!text.trim() || !activeConv || !user) return
    setSending(true)
    try {
      await api.post('/messages', {
        email: user.email,
        receiverId: activeConv.participantId,
        content: text.trim(),
      })
      setText('')
      toast.success('Message sent')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  function selectConversation(conv: Conversation) {
    setActiveConv(conv)
    setShowList(false)
  }

  if (error) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-neutral-400 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
    )
  }

  if (loading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
    )
  }

  return (
      <div className="h-[calc(100vh-64px)] flex">
        <div className={`w-full lg:w-80 xl:w-96 border-r border-white/[0.05] flex flex-col ${showList ? 'flex' : 'hidden lg:flex'}`}>
          <div className="p-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              <h1 className="text-lg font-semibold text-white">Messages</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <img
                  src="/images/No%20Messages.png"
                  alt="No messages yet"
                  className="w-32 h-32 object-contain mb-3 opacity-40"
                />
                <p className="text-sm text-neutral-400">No conversations yet</p>
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full text-left p-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors min-h-[72px] ${
                    activeConv?.id === conv.id ? 'bg-white/[0.05] border-l-2 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-emerald-400">
                        {conv.participantName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white truncate">{conv.participantName}</p>
                        <span className="text-xs text-neutral-500 shrink-0">{formatRelativeTime(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${!showList ? 'flex' : 'hidden lg:flex'}`}>
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <img
                  src="/images/No%20Messages.png"
                  alt="Select a conversation"
                  className="w-40 h-40 object-contain mx-auto mb-4 opacity-30"
                />
                <p className="text-neutral-400">Select a conversation to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-white/[0.05]">
                <button
                  onClick={() => { setShowList(true); setActiveConv(null) }}
                  className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-400">
                    {activeConv.participantName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{activeConv.participantName}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence initial={false}>
                  {activeConv.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          msg.isOwn
                            ? 'bg-emerald-600 text-white rounded-br-md'
                            : 'bg-white/[0.06] text-neutral-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-emerald-200' : 'text-neutral-500'}`}>
                          {formatRelativeTime(msg.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-4 border-t border-white/[0.05]">
                <div className="flex gap-2">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!text.trim() || sending}
                    className="bg-emerald-600 hover:bg-emerald-700 min-w-[44px] min-h-[44px]"
                    aria-label="Send message"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  )
}
