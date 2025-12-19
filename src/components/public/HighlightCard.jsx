import { Link } from 'react-router-dom'
import { colors, components } from '../../utils/designTokens'

const accentColors = {
  pink: colors.accent.pink,
  lightGreen: colors.accent.lightGreen,
  yellow: colors.accent.yellow,
  cyan: colors.accent.cyan,
}

export default function HighlightCard({ icon, title, description, link, accentColor = 'pink' }) {
  const bgColor = accentColors[accentColor] || accentColors.pink

  return (
    <Link
      to={link}
      className="group block bg-white rounded-card p-6 md:p-8 shadow-card hover:shadow-card-highlighted hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon */}
      <div 
        className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        {icon && (
          <div className="text-neutral-gray900 text-3xl md:text-4xl">
            {icon}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-h2 font-semibold text-neutral-gray900 mb-3 group-hover:text-primary-blue-main transition-colors">
        {title}
      </h3>
      <p className="text-body text-neutral-gray600 mb-4 line-clamp-2">
        {description}
      </p>
      
      {/* Link */}
      <div className="flex items-center text-primary-blue-main font-medium text-small group-hover:underline">
        <span>Pelajari lebih lanjut</span>
        <svg
          className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

