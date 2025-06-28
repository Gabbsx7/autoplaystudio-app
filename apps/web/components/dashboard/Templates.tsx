import React from 'react'

interface Template {
  id: string
  title: string
  description: string
  image?: string
}

interface TemplatesSectionProps {
  templates: Template[]
  onCreateTemplate: () => void
  onSelectTemplate: (template: Template) => void
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates,
  onCreateTemplate,
  onSelectTemplate,
}) => {
  if (!templates || templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <button
          className="px-6 py-2 bg-black text-white rounded-[99px] font-semibold text-base hover:bg-gray-900 transition-colors shadow"
          onClick={onCreateTemplate}
        >
          Criar novo template
        </button>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-xl overflow-hidden shadow-md relative flex flex-col justify-end min-h-[340px] cursor-pointer group"
            style={{
              background: `url('${
                template.image ||
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
              }') center center / cover no-repeat`,
            }}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all" />
            <div className="relative z-10 p-6 flex flex-col items-start justify-end h-full">
              <h3 className="text-white text-lg font-bold mb-2 drop-shadow-lg line-clamp-2">
                {template.title}
              </h3>
              <p className="text-white text-sm mb-4 drop-shadow-lg line-clamp-2 overflow-hidden text-ellipsis whitespace-normal break-words max-w-full">
                {template.description}
              </p>
              <button
                className="px-5 py-2 bg-white text-black border border-black rounded-[99px] font-semibold text-base hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectTemplate(template)
                }}
              >
                NEW PROJECT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
