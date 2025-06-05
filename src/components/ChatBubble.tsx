import { Avatar, AvatarFallback } from './ui/avatar'
import { User, Bot } from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'} text-sm`}>
            {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={`${message.isUser ? 'mr-3' : 'ml-3'} space-y-1`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              message.isUser
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-black/40 text-white border border-white/10 rounded-bl-md'
            } shadow-lg`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className={`text-xs text-white/50 ${message.isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  )
}