import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function TabsSection({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'layanan', label: 'Layanan' },
    { id: 'agenda', label: 'Agenda Kota' },
    { id: 'wisata', label: 'Wisata' }
  ]

  const [clickedTab, setClickedTab] = useState(null)
  const sectionRef = useRef(null)
  
  // Intersection Observer for scroll animation
  const isInView = useInView(sectionRef, { 
    once: true,
    amount: 0.2 
  })
  
  // Animation variant for buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.45, delay: 0.4, ease: "easeOut" }
    }
  }

  const handleTabClick = (tabId) => {
    onTabChange(tabId)
    setClickedTab(tabId)
    setTimeout(() => {
      setClickedTab(null)
    }, 600)
  }

  return (
    <>
      <style>{`
        .btn-group {
          border-radius: 1rem;
          box-shadow:
            -2.3px -2.3px 3.8px rgba(255,255,255, 0.2),
            -6.3px -6.3px 10.6px rgba(255,255,255, 0.3),
            -15.1px -15.1px 25.6px rgba(255,255,255, 0.4),
            -50px -50px 85px rgba(255,255,255, 0.07),
            2.3px 2.3px 3.8px rgba(0, 0, 0, 0.024),
            6.3px 6.3px 10.6px rgba(0, 0, 0, 0.035),
            15.1px 15.1px 25.6px rgba(0, 0, 0, 0.046),
            50px 50px 85px rgba(0, 0, 0, 0.07);
        }
        .btn-group__item {
          border: none;
          min-width: 6rem;
          padding: 1rem 2rem;
          background-color: #eee;
          cursor: pointer;
          margin: 0;
          box-shadow: inset 0px 0px 0px -15px #2563EB;
          transition: all 300ms ease-out;
          position: relative;
          font-size: 1rem;
          font-weight: 500;
          color: #333;
        }
        .btn-group__item:last-child {
          border-top-right-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
        .btn-group__item:first-child {
          border-top-left-radius: 1rem;
          border-bottom-left-radius: 1rem;
        }
        .btn-group__item:hover,
        .btn-group__item:focus {
          color: #2563EB;
          box-shadow: inset 0px -20px 0px -15px #2563EB;
        }
        .btn-group__item:focus {
          outline: none;
        }
        .btn-group__item:after {
          content: '✔️';
          margin-left: 0.5rem;
          display: inline-block;
          color: #2563EB;
          position: absolute;
          transform: translatey(10px);
          opacity: 0;
          transition: all 200ms ease-out;
        }
        .btn-group__item--clicked:after {
          opacity: 1;
          transform: translatey(-2px);
        }
        .btn-group__item--active {
          color: #2563EB;
          box-shadow: inset 0px -20px 0px -15px #2563EB;
        }
      `}</style>
      <div className="py-4" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <motion.div 
              className="btn-group"
              variants={buttonVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`btn-group__item ${activeTab === tab.id ? 'btn-group__item--active' : ''} ${clickedTab === tab.id ? 'btn-group__item--clicked' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

