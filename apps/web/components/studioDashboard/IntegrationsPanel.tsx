'use client'

import React from 'react'
import {
  Database,
  MessageSquare,
  HardDrive,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
}

interface IntegrationsPanelProps {
  className?: string
}

export default function IntegrationsPanel({
  className,
}: IntegrationsPanelProps) {
  const integrations: Integration[] = [
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Database and authentication',
      icon: Database,
      status: 'connected',
      lastSync: '2 minutes ago',
    },
    {
      id: 'chat',
      name: 'Chat Integration',
      description: 'Real-time messaging',
      icon: MessageSquare,
      status: 'connected',
      lastSync: '1 minute ago',
    },
    {
      id: 'storage',
      name: 'File Storage',
      description: 'Asset management',
      icon: HardDrive,
      status: 'connected',
      lastSync: '5 minutes ago',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 ${
        className || ''
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Manage external service connections
        </p>
      </div>

      {/* Integration Cards */}
      <div className="p-6 space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {integration.description}
                  </p>
                  {integration.lastSync && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last sync: {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    integration.status
                  )}`}
                >
                  {integration.status}
                </span>
                {getStatusIcon(integration.status)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add New Integration */}
      <div className="p-6 border-t border-gray-100">
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
          + Add New Integration
        </button>
      </div>
    </div>
  )
}
