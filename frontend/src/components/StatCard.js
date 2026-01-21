export default function StatCard({ title, value, change, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} bg-white shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm mt-1 text-gray-500">
              <span className={change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {change}
              </span>{' '}
              from last month
            </p>
          )}
        </div>
        <div className={`text-4xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
