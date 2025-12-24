import { motion } from 'framer-motion'
import { 
  Instagram, 
  Facebook, 
  Youtube,
  ExternalLink
} from 'lucide-react'
import { FaTiktok } from 'react-icons/fa'

// Custom X Logo Component (mengikuti logo X yang baru)
const XIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: XIcon,
  youtube: Youtube,
  tiktok: FaTiktok,
}

const platformLabels = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

// Platform-specific color schemes
const platformColors = {
  instagram: {
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
    bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
    iconBg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
    hoverBg: 'hover:from-purple-600 hover:via-pink-600 hover:to-orange-600',
    text: 'text-white',
  },
  facebook: {
    gradient: 'from-blue-600 to-blue-700',
    bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
    iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
    hoverBg: 'hover:from-blue-700 hover:to-blue-800',
    text: 'text-white',
  },
  twitter: {
    gradient: 'from-gray-900 to-gray-800',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    iconBg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    hoverBg: 'hover:from-gray-800 hover:to-gray-700',
    text: 'text-white',
  },
  youtube: {
    gradient: 'from-red-600 to-red-700',
    bg: 'bg-gradient-to-br from-red-600 to-red-700',
    iconBg: 'bg-gradient-to-br from-red-600 to-red-700',
    hoverBg: 'hover:from-red-700 hover:to-red-800',
    text: 'text-white',
  },
  tiktok: {
    gradient: 'from-gray-900 via-gray-800 to-pink-500',
    bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-pink-500',
    iconBg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-pink-500',
    hoverBg: 'hover:from-gray-800 hover:via-gray-700 hover:to-pink-600',
    text: 'text-white',
  },
}

export default function SocialMediaCard({ platform, url, ikon_url, index = 0 }) {
  // Pilih icon berdasarkan platform
  const IconComponent = platformIcons[platform]
  const platformLabel = platformLabels[platform] || platform.charAt(0).toUpperCase() + platform.slice(1)
  const colors = platformColors[platform] || {
    gradient: 'from-primary-blue to-blue-600',
    bg: 'bg-gradient-to-br from-primary-blue to-blue-600',
    iconBg: 'bg-gradient-to-br from-primary-blue to-blue-600',
    hoverBg: 'hover:from-blue-600 hover:to-blue-700',
    text: 'text-white',
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-highlighted hover:-translate-y-2 transition-all duration-300 group relative"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
    >
      {/* Gradient accent bar at top */}
      <div className={`h-1 ${colors.bg} ${colors.hoverBg} transition-all duration-300`} />
      
      <div className="flex flex-col items-center text-center p-6 lg:p-8 space-y-5">
        {/* Icon Container with Platform Colors */}
        <motion.div
          className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl ${colors.iconBg} ${colors.hoverBg} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-2xl ${colors.bg} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
          
          {ikon_url ? (
            <img
              src={ikon_url}
              alt={platformLabel}
              width={56}
              height={56}
              loading="lazy"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain relative z-10 filter brightness-0 invert"
            />
          ) : IconComponent ? (
            <IconComponent className={`w-12 h-12 lg:w-14 lg:h-14 ${colors.text} relative z-10`} />
          ) : (
            <div className={`w-12 h-12 lg:w-14 lg:h-14 ${colors.text} rounded-full relative z-10`} />
          )}
        </motion.div>

        {/* Platform Name and Description */}
        <div className="space-y-2">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-primary-blue transition-colors duration-300">
            {platformLabel}
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            <span>Kunjungi Profil</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-blue/20 rounded-card transition-all duration-300 pointer-events-none" />
    </motion.a>
  )
}

