import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MoreHorizontal, ExternalLink, Trash2, Edit } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface Project {
  id: string
  title: string
  description: string
  isPublic: boolean
  createdAt: Date
  status: 'completed' | 'in-progress' | 'draft'
}

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onEdit: (project: Project) => void
  onView: (project: Project) => void
}

export default function ProjectCard({ project, onDelete, onEdit, onView }: ProjectCardProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-4 hover:bg-black/50 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
          <div className="flex items-center space-x-2 mb-3">
            <Badge 
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className={project.status === 'completed' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}
            >
              {project.status === 'completed' ? 'مكتمل' : project.status === 'in-progress' ? 'قيد العمل' : 'مسودة'}
            </Badge>
            {project.isPublic && (
              <Badge variant="outline" className="border-white/20 text-white/80">
                عام
              </Badge>
            )}
          </div>
          <div className="text-white/40 text-xs">
            تم الإنشاء في {project.createdAt.toLocaleDateString('ar-SA')}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-sm border-white/10">
            <DropdownMenuItem 
              onClick={() => onView(project)}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              عرض المشروع
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onEdit(project)}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(project.id)}
              className="text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}