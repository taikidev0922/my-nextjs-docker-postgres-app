import { ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
}) => (
  <a
    href={href}
    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-500"
  >
    <div className="flex items-center mb-4">
      <div className="p-3 bg-blue-100 rounded-full mr-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="flex items-center text-blue-600 font-medium">
      <span>管理画面へ</span>
      <ArrowRight className="ml-2 h-4 w-4" />
    </div>
  </a>
);
