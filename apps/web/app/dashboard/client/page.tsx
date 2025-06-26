'use client'

import { RoleGuard } from '@/components/role-based/role-guard'

export default function ClientDashboard() {
  return (
    <RoleGuard allowedRoles={['client_admin', 'client_member', 'guest']}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
            <p className="text-3xl font-bold text-orange-600">12</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Team Messages</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
            <div className="space-y-3">
              {[
                { name: 'Footlocker CGI Production', status: 'In Progress', client: 'Footlocker' },
                { name: 'Marathon Video Campaign', status: 'Review', client: 'Marathon' },
                { name: 'Brand Identity Project', status: 'Draft', client: 'TechCorp' }
              ].map((project, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.status === 'In Progress' 
                      ? 'bg-blue-100 text-blue-800'
                      : project.status === 'Review'
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { user: 'Glenn', action: 'commented on Marathon Project', time: '2h ago' },
                { user: 'Sarah', action: 'uploaded new assets', time: '4h ago' },
                { user: 'Mike', action: 'completed milestone review', time: '1d ago' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {activity.user[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
