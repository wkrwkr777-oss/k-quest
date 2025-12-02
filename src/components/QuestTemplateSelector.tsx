'use client'

import { QUEST_TEMPLATES, QuestTemplate } from '@/lib/questTemplates'

interface QuestTemplateSelectorProps {
    onSelect: (template: QuestTemplate) => void
}

export default function QuestTemplateSelector({ onSelect }: QuestTemplateSelectorProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {QUEST_TEMPLATES.map((template) => (
                <button
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all group text-center h-full"
                >
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        {template.id === 'guide' ? '🚶' : template.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                        {template.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {template.description}
                    </p>
                </button>
            ))}
        </div>
    )
}
