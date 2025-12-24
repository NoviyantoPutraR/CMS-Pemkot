import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { gsap } from 'gsap'
import './Gallery.scss'

interface IUnsplashPhotoUrls {
  full: string;
  regular: string;
  small: string;
  thumbnail: string;
}

interface IUnsplashPhoto {
  actor: string;
  color: string;
  id: string;
  urls: IUnsplashPhotoUrls;
  width?: number;
  height?: number;
}

interface IPosition {
  left: number;
  top: number;
}

interface ISize {
  height: number;
  width: number;
}

interface IPhotoBar {
  backgroundPosition: IPosition;
  position: IPosition;
  rect: DOMRect;
  size: ISize;
}

interface IPhotoBarProps {
  backgroundImage: string;
  bar: IPhotoBar;
  index: number;
  photoId: string;
}

interface IAppContext {
  count: number;
  setCountTo: (count: number) => void;
}

const AppContext = createContext<IAppContext>({ count: 0, setCountTo: () => {} })

const getPhotoStyles = (photo: IUnsplashPhoto): React.CSSProperties => {
  const backgroundImage: string = `url(${photo.urls.regular})`
  const styles: React.CSSProperties = { backgroundImage }
  
  if (photo.width && photo.height && photo.width > photo.height) {
    styles.width = "100%"
  } else {
    styles.height = "100%"
  }
  
  return styles
}

const mapBarStyles = (bar: IPhotoBar, backgroundImage: string): React.CSSProperties => {
  const { backgroundPosition, position, rect, size } = bar
  
  return {
    backgroundImage,
    backgroundPosition: `${backgroundPosition.left * -1}px ${backgroundPosition.top * -1}px`,
    backgroundSize: `${rect.width}px auto`,
    height: `${size.height}px`,
    transform: `translate(${position.left}px, ${position.top}px)`,
    width: `${size.width}px`,
    zIndex: gsap.utils.random(1, 10, 1)
  }
}

const PhotoBar: React.FC<IPhotoBarProps> = ({ backgroundImage, bar, index, photoId }) => {
  const { count, setCountTo } = useContext(AppContext)
  const hasTriggeredRef = useRef<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    // Reset trigger flag when photo changes
    hasTriggeredRef.current = false
    
    const orientation: "horizontal" | "vertical" = bar.size.height > bar.size.width ? "vertical" : "horizontal"
    
    const inDuration: number = 4
    const sizeDuration: number = gsap.utils.random(2, inDuration, 1)
    
    const t1 = gsap.timeline()
    const t2 = gsap.timeline()
    
    if (orientation === "vertical") {
      const getOffsetY = (): number => {
        const signY: number = gsap.utils.random(0, 1, 1)
        const maxOffset = Math.min(bar.size.height * 0.3, bar.position.top * 0.5, (bar.rect.height - bar.position.top - bar.size.height) * 0.5)
        
        if (signY === 0) {
          return gsap.utils.random(0, Math.max(0, maxOffset), 1) * -1
        }
        
        return gsap.utils.random(0, Math.max(0, maxOffset), 1)
      }
      
      const offsetY: number = getOffsetY()
      const initialY: number = bar.position.top + offsetY
      const initialBackgroundY: number = bar.backgroundPosition.top + offsetY
        
      t1.fromTo(ref.current, {
        height: gsap.utils.random(bar.size.height * 0.2, bar.size.height * 0.8, 1),
        opacity: 0
      }, {
        duration: sizeDuration,
        height: bar.size.height,
        opacity: 1
      }).repeatDelay(inDuration - sizeDuration + 1).yoyo(true).repeat(1)
      
      t2.fromTo(ref.current, {
        backgroundPosition: `${(bar.backgroundPosition.left * -1)}px ${initialBackgroundY * -1}px`,
        y: initialY
      }, {
        backgroundPosition: `${bar.backgroundPosition.left * -1}px ${bar.backgroundPosition.top * -1}px`,
        duration: inDuration,
        y: bar.position.top
      }).repeatDelay(1).yoyo(true).repeat(1)
    } else {
      const getOffsetX = (): number => {
        const signX: number = gsap.utils.random(0, 1, 1)
        const maxOffset = Math.min(bar.size.width * 0.3, bar.position.left * 0.5, (bar.rect.width - bar.position.left - bar.size.width) * 0.5)
        
        if (signX === 0) {
          return gsap.utils.random(0, Math.max(0, maxOffset), 1) * -1
        }
        
        return gsap.utils.random(0, Math.max(0, maxOffset), 1)
      }
      
      const offsetX: number = getOffsetX()
      const initialX: number = bar.position.left + offsetX
      const initialBackgroundX = bar.backgroundPosition.left + offsetX
      
      t1.fromTo(ref.current, {
        opacity: 0,
        width: gsap.utils.random(bar.size.width * 0.2, bar.size.width * 0.8, 1)
      }, {
        duration: sizeDuration,
        opacity: 1,
        width: bar.size.width
      }).repeatDelay(inDuration - sizeDuration + 1).yoyo(true).repeat(1)
        
      t2.fromTo(ref.current, {
        backgroundPosition: `${initialBackgroundX * -1}px ${(bar.backgroundPosition.top * -1)}px`,
        x: initialX
      }, {
        backgroundPosition: `${bar.backgroundPosition.left * -1}px ${bar.backgroundPosition.top * -1}px`,
        duration: inDuration,
        x: bar.position.left
      }).repeatDelay(1).yoyo(true).repeat(1)
    }
    
    return () => {
      t1.kill()
      t2.kill()
      if (ref.current) {
        gsap.killTweensOf(ref.current)
      }
    }
  }, [bar, index, photoId])
  
  // Separate effect untuk reset trigger flag ketika photoId berubah
  useEffect(() => {
    hasTriggeredRef.current = false
  }, [photoId])
  
  // Handle count increment setelah animasi selesai (hanya untuk bar pertama)
  useEffect(() => {
    if (index !== 0) return
    
    // Set timeout untuk trigger count setelah animasi selesai (sekitar 8-9 detik total)
    const timeout = setTimeout(() => {
      if (!hasTriggeredRef.current && count === 0) {
        hasTriggeredRef.current = true
        setCountTo(1)
      }
    }, 8000) // 8 detik untuk memastikan animasi bars selesai
    
    return () => clearTimeout(timeout)
  }, [index, photoId, count, setCountTo])
  
  return (
    <div ref={ref} className="photo-bar" style={mapBarStyles(bar, backgroundImage)} />
  )
}

interface ICastMemberProps {
  actor: string;
}

const CastMember: React.FC<ICastMemberProps> = ({ actor }) => {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    // Reset to initial state
    gsap.set(ref.current, {
      opacity: 0,
      x: -300
    })
    
    const tweenIn = gsap.fromTo(ref.current, {
      opacity: 0,
      x: -300
    }, {
      delay: 1,
      duration: 3,
      ease: "power3.out",
      opacity: 1,
      x: 0
    })
    
    const tweenOut = gsap.to(ref.current, {
      delay: 5,
      duration: 4,
      ease: "power3.in",
      opacity: 0,
      x: 300
    })
    
    return () => {
      tweenIn.kill()
      tweenOut.kill()
      if (ref.current) {
        gsap.killTweensOf(ref.current)
      }
    }
  }, [actor])
  
  return (
    <div ref={ref} id="gallery-cast-member">
      <h1>{actor}</h1>
    </div>
  )
}

interface IGalleryState {
  bars: IPhotoBar[];
  loaded: boolean;
}

interface IGalleryProps {
  photo: IUnsplashPhoto;
}

const Gallery: React.FC<IGalleryProps> = ({ photo }) => {
  const [state, setStateTo] = useState<IGalleryState>({ bars: [], loaded: false })
  const photoStyles: React.CSSProperties = getPhotoStyles(photo)
  const photoRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Reset state when photo changes
    setStateTo({ bars: [], loaded: false })
    // Clear any ongoing animations dan pastikan image opacity 0
    if (photoRef.current) {
      gsap.killTweensOf(photoRef.current)
      // Image tetap opacity 0, akan di-reveal oleh bars
      gsap.set(photoRef.current, { opacity: 0, clearProps: "all" })
    }
  }, [photo.id])
  
  // Intersection Observer untuk memastikan bars tetap berjalan ketika kembali ke viewport
  // Image tetap opacity 0, akan di-reveal oleh bars
  useEffect(() => {
    if (!wrapperRef.current || !state.loaded) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hanya memastikan component tetap aktif, tidak mengubah opacity image
          // Image akan terlihat melalui bars yang bergerak
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    
    observer.observe(wrapperRef.current)
    
    return () => {
      observer.disconnect()
    }
  }, [state.loaded, photo.id])
  
  useEffect(() => {
    const image: HTMLImageElement = new Image()
    image.src = photo.urls.regular

    image.onload = () => {
      setStateTo(prev => ({ ...prev, loaded: true }))
      // Image tetap opacity 0, akan di-reveal oleh bars
    }
  }, [photo])
  
  useEffect(() => {
    if (state.loaded && photoRef.current && frameRef.current) {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        if (!photoRef.current || !frameRef.current) return
        
        const bars: IPhotoBar[] = []
        const photoRect: DOMRect = photoRef.current.getBoundingClientRect()
        const frameRect: DOMRect = frameRef.current.getBoundingClientRect()

        // Calculate relative positions
        const relativeLeft = photoRect.left - frameRect.left
        const relativeTop = photoRect.top - frameRect.top

        const base: IPosition = {
          left: relativeLeft + (photoRect.width * 0.2),
          top: relativeTop
        }
        
        while (base.left < (relativeLeft + (photoRect.width * 0.7))) {
          const height: number = gsap.utils.random(photoRect.height * 0.4, photoRect.height * 0.8, 1)
          const width: number = gsap.utils.random(photoRect.width * 0.05, photoRect.width * 0.25, 1)

          const left: number = gsap.utils.random(base.left + (width * 0.1), base.left + (width * 0.2), 1)
          const top: number = base.top + gsap.utils.random(0, photoRect.height - height, 1)

          base.left = left + width
          
          const backgroundPosition: IPosition = {
            left: left - relativeLeft,
            top: top - relativeTop
          }

          bars.push({
            backgroundPosition,
            position: { left, top },
            rect: photoRect,
            size: { height, width }
          })
        }

        base.left = relativeLeft
        base.top = relativeTop + (photoRect.height * 0.2)

        while (base.top < (relativeTop + (photoRect.height * 0.7))) {
          const height: number = gsap.utils.random(photoRect.height * 0.05, photoRect.height * 0.25, 1)
          const width: number = gsap.utils.random(photoRect.width * 0.4, photoRect.width * 0.8, 1)

          const left: number = base.left + gsap.utils.random(0, photoRect.width - width, 1)
          const top: number = gsap.utils.random(base.top + (height * 0.1), base.top + (height * 0.2), 1)

          base.top = top + height

          const backgroundPosition: IPosition = {
            left: left - relativeLeft,
            top: top - relativeTop
          }
          
          bars.push({
            backgroundPosition,
            position: { left, top },
            rect: photoRect,
            size: { height, width }
          })
        }
        
        setStateTo({ bars, loaded: true })
      }, 50)
      
      return () => clearTimeout(timeout)
    }
  }, [state.loaded, photo.id])
  
  const getBars = (): React.ReactElement[] => {
    return state.bars.map((bar: IPhotoBar, index: number) => (
      <PhotoBar 
        key={`bar-${photo.id}-${index}`}
        backgroundImage={photoStyles.backgroundImage as string} 
        bar={bar} 
        index={index}
        photoId={photo.id}
      />
    ))
  }

  return (
    <div key={photo.id} id="gallery-wrapper" ref={wrapperRef}>
      <div id="gallery-frame" ref={frameRef}>
        <div id="gallery-photo-wrapper">
          <img 
            key={photo.id}
            id="gallery-photo"
            ref={photoRef}
            src={photo.urls.regular}
            alt={photo.actor}
            width={photo.width}
            height={photo.height}
            loading="eager"
            fetchpriority="high"
            style={photoStyles}
          />
        </div>
      </div>
      <div id="gallery-photo-bars">
        {getBars()}
      </div>
      <CastMember key={photo.id} actor={photo.actor} />
    </div>
  )
}

interface IGalleryContainerProps {
  photos: IUnsplashPhoto[];
}

const GalleryContainer: React.FC<IGalleryContainerProps> = ({ photos }) => {
  const [index, setIndexTo] = useState<number>(0)
  const [count, setCountTo] = useState<number>(0)
  const [resizing, setResizingTo] = useState<boolean>(false)
  
  const photo: IUnsplashPhoto = photos[index]
  
  useEffect(() => {
    if (!resizing && count > 0 && photos.length > 0) {
      const timeout: NodeJS.Timeout = setTimeout(() => {
        const nextIndex = index + 1 > photos.length - 1 ? 0 : index + 1
        setIndexTo(nextIndex)
        setCountTo(0) // Reset count setelah pergantian foto
      }, 2000) // Delay 2 detik
      
      return () => clearTimeout(timeout)
    }
  }, [count, index, photos.length, resizing, setCountTo])
  
  useEffect(() => {
    const handleOnResize = (): void => {
      if (!resizing) {
        setResizingTo(true)
      }
    }
    
    const timeout: NodeJS.Timeout = setTimeout(() => {
      if (resizing) {
        setResizingTo(false)
      }
    }, 500)
    
    window.addEventListener("resize", handleOnResize)
    
    return () => {
      window.removeEventListener("resize", handleOnResize)
      clearTimeout(timeout)
    }
  }, [resizing])
  
  if (!photo || resizing) {
    return null
  }
  
  return (
    <AppContext.Provider value={{ count, setCountTo }}>
      <Gallery photo={photo} />
    </AppContext.Provider>
  )
}

export default GalleryContainer

