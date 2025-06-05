import { useState, useEffect } from 'react'
import { Plus, ArrowUp, Globe, MessageCircle, Settings, History, Sparkles } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Switch } from './components/ui/switch'
import { Card } from './components/ui/card'
import { Label } from './components/ui/label'
import { Textarea } from './components/ui/textarea'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import toast from 'react-hot-toast'

import ChatBubble from './components/ChatBubble'
import ProjectCard from './components/ProjectCard'
import { getAIResponse, quickSuggestions } from './utils/aiResponses'

interface Project {
  id: string
  title: string
  description: string
  isPublic: boolean
  createdAt: Date
  status: 'completed' | 'in-progress' | 'draft'
}

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

function App() {
  const [inputValue, setInputValue] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentView, setCurrentView] = useState<'home' | 'chat' | 'projects' | 'settings'>('home')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  // تحميل المشاريع المحفوظة
  useEffect(() => {
    const savedProjects = localStorage.getItem('lovable-projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // حفظ المشاريع
  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('lovable-projects', JSON.stringify(updatedProjects))
    setProjects(updatedProjects)
  }

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast.error('الرجاء إدخال وصف المشروع')
      return
    }

    setIsLoading(true)
    
    // إضافة رسالة المستخدم للمحادثة
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    
    // محاكاة عملية إنشاء المشروع
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        title: currentInput.slice(0, 50) + (currentInput.length > 50 ? '...' : ''),
        description: currentInput,
        isPublic,
        createdAt: new Date(),
        status: 'in-progress'
      }
      
      const updatedProjects = [...projects, newProject]
      saveProjects(updatedProjects)
      
      // إضافة رد الـ AI الذكي
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(currentInput),
        isUser: false,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      toast.success('تم إنشاء المشروع بنجاح!')
      setCurrentView('chat')
    }, 2000)
  }

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id)
    saveProjects(updatedProjects)
    toast.success('تم حذف المشروع')
  }

  const handleEditProject = (project: Project) => {
    setInputValue(project.description)
    setCurrentView('home')
    toast('تم تحميل المشروع للتعديل', { icon: '✏️' })
  }

  const handleViewProject = () => {
    toast('فتح المشروع...', { icon: '🚀' })
    // هنا يمكن إضافة منطق فتح المشروع في نافذة جديدة
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    toast('تم إضافة الاقتراح', { icon: '💡' })
  }

  const handleAddProject = () => {
    setCurrentView('projects')
    toast('عرض جميع المشاريع', { icon: '📁' })
  }

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-pink-600 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* الحاوية الرئيسية */}
      <div className="w-full max-w-sm mx-auto space-y-8 relative z-10">
        
        {/* الأيقونة والعنوان */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Build something Lovable
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Create apps and websites by<br />
            chatting with AI
          </p>
        </div>

        {/* مربع الإدخال */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {/* مربع النص */}
            <div className="relative">
              <Textarea
                placeholder="Ask Lovable to create an internal tool that..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-transparent border-none text-white placeholder:text-white/60 text-base min-h-[80px] resize-none pr-4 pl-4 rounded-2xl focus:ring-2 focus:ring-white/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
            </div>

            {/* الأزرار السفلية */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4">
                {/* زر المشاريع */}
                <Button
                  onClick={handleAddProject}
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                </Button>

                {/* مفتاح Public */}
                <div className="flex items-center space-x-2 bg-white/5 rounded-full px-3 py-2">
                  <Globe className="h-4 w-4 text-white/80" />
                  <Label className="text-white/80 text-sm cursor-pointer">
                    Public
                  </Label>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="data-[state=checked]:bg-white/30"
                  />
                </div>
              </div>

              {/* زر الإرسال */}
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* الاقتراحات السريعة */}
        <div className="space-y-3">
          <h3 className="text-white/80 text-sm font-medium text-center">اقتراحات سريعة</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickSuggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                variant="ghost"
                className="bg-white/5 hover:bg-white/10 text-white/80 text-sm h-auto py-2 px-3 rounded-lg border border-white/10 justify-start"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-sm text-white/60 leading-relaxed">مشاريع</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-sm text-white/60 leading-relaxed">إمكانيات</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-white/60 leading-relaxed">متاح</div>
          </div>
        </div>
      </div>

      {/* شريط التنقل السفلي */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 rounded-full p-2">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentView('home')}
              size="icon"
              variant={currentView === 'home' ? 'default' : 'ghost'}
              className="h-12 w-12 rounded-full text-white"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setCurrentView('chat')}
              size="icon"
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              className="h-12 w-12 rounded-full text-white"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setCurrentView('projects')}
              size="icon"
              variant={currentView === 'projects' ? 'default' : 'ghost'}
              className="h-12 w-12 rounded-full text-white"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setCurrentView('settings')}
              size="icon"
              variant={currentView === 'settings' ? 'default' : 'ghost'}
              className="h-12 w-12 rounded-full text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderChatView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-pink-600 flex flex-col">
      {/* رأس المحادثة */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-white/20 text-white">AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-white font-semibold">Lovable AI</h2>
            <p className="text-white/60 text-sm">مساعدك في بناء التطبيقات</p>
          </div>
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-white/40 mb-4">
              <MessageCircle className="w-12 h-12 mx-auto mb-2" />
              <p>ابدأ محادثة جديدة مع Lovable AI</p>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-white/60 text-sm">جاري الكتابة...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* مربع الإدخال السفلي */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="اكتب رسالتك..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-black/40 border-white/10 text-white placeholder:text-white/60"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderProjectsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-pink-600 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">مشاريعي</h2>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6 text-center">
              <div className="text-white/40 mb-4">
                <History className="w-12 h-12 mx-auto mb-2" />
                <p>لا توجد مشاريع بعد</p>
              </div>
              <Button
                onClick={() => setCurrentView('home')}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white"
              >
                إنشاء مشروع جديد
              </Button>
            </Card>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
                onEdit={handleEditProject}
                onView={handleViewProject}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )

  const renderSettingsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-pink-600 p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">الإعدادات</h2>
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">المشاريع العامة بشكل افتراضي</Label>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-white">الإشعارات</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-white">الوضع المظلم</Label>
            <Switch defaultChecked />
          </div>
          <Button
            onClick={() => {
              localStorage.clear()
              setProjects([])
              toast.success('تم مسح جميع البيانات')
            }}
            variant="destructive"
            className="w-full"
          >
            مسح جميع البيانات
          </Button>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="font-sans min-h-screen">
      {currentView === 'home' && renderWelcomeScreen()}
      {currentView === 'chat' && renderChatView()}
      {currentView === 'projects' && renderProjectsView()}
      {currentView === 'settings' && renderSettingsView()}
    </div>
  )
}

export default App