import { Link } from 'react-router-dom'

export default function FeatureCardsSection({ 
  items = [],
  title = "Akses Cepat",
  backgroundColor = "bg-white",
  columns = 3,
  scrollable = false
}) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="max-w-container mx-auto px-6 md:px-24">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-darkGray">
            {title}
          </h2>
        )}
        
        {scrollable ? (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {items.map((item, index) => (
                <FeatureCard key={index} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${gridCols[columns] || gridCols[3]} gap-6 lg:gap-8`}>
            {items.map((item, index) => (
              <FeatureCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FeatureCard({ item }) {
  return (
    <Link
      to={item.link || '#'}
      className="group block bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-neutral-gray200"
    >
      {/* Icon */}
      {item.icon && (
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-neutral-lightGray flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
          {typeof item.icon === 'string' && item.icon.startsWith('http') ? (
            <img
              src={item.icon}
              alt={item.title}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          ) : (
            <div className="text-3xl md:text-4xl">{item.icon}</div>
          )}
        </div>
      )}
      
      {/* Content */}
      <h3 className="text-xl md:text-2xl font-semibold text-neutral-darkGray mb-3 group-hover:text-primary-blue transition-colors">
        {item.title}
      </h3>
      {item.description && (
        <p className="text-base text-neutral-gray600 line-clamp-2">
          {item.description}
        </p>
      )}
    </Link>
  )
}

