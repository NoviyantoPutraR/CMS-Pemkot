import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [], homeHref = '/' }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" role="navigation">
      <ul className="flex flex-wrap items-center my-1">
        {/* Home icon */}
        <li className="inline-flex items-center">
          <Link
            to={homeHref}
            aria-label="home"
            className="inline-flex items-center font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mx-2 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isCurrent = item.current || isLast

          return (
            <li key={index} className="flex items-center" {...(isCurrent && { 'aria-current': 'page' })}>
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              {isCurrent ? (
                <span className="font-medium text-gray-600">{item.label}</span>
              ) : (
                <Link
                  to={item.href}
                  className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

