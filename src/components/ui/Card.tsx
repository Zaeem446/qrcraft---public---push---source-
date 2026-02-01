interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', padding = true, hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        padding ? 'p-6' : ''
      } ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
