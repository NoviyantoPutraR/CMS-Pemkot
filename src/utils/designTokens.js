import designSystem from '../../Design.json'

const tokens = designSystem.designSystem

// Colors
export const colors = {
  primary: {
    blue: tokens.colorPalette.primary.blue, // #0052FF
  },
  secondary: {
    yellow: tokens.colorPalette.secondary.yellow, // #FFD700
  },
  neutral: {
    white: tokens.colorPalette.neutral.white, // #FFFFFF
    lightGray: tokens.colorPalette.neutral.lightGray, // #F5F5F5
    darkGray: tokens.colorPalette.neutral.darkGray, // #333333
  },
}

// Spacing
export const spacing = {
  sections: '60px', // Large vertical spacing between major sections (60-100px)
  cards: '24px', // Consistent gap between cards (20-30px)
  padding: '32px', // Generous internal padding in cards and containers (20-40px)
}

// Typography
export const typography = {
  hero: {
    size: tokens.typography?.fontSizes?.hero?.size || '3.5rem',
    lineHeight: tokens.typography?.fontSizes?.hero?.lineHeight || '1.1',
    weight: tokens.typography?.fontSizes?.hero?.weight || '700',
    case: tokens.typography?.fontSizes?.hero?.case || 'Uppercase or Title Case',
  },
  headings: {
    h1: {
      size: tokens.typography?.fontSizes?.h1?.size || '2.5rem',
      lineHeight: tokens.typography?.fontSizes?.h1?.lineHeight || '1.2',
      weight: tokens.typography?.fontSizes?.h1?.weight || '700',
      case: tokens.typography?.fontSizes?.h1?.case || 'Title Case',
    },
    h2: {
      size: tokens.typography?.fontSizes?.h2?.size || '2rem',
      lineHeight: tokens.typography?.fontSizes?.h2?.lineHeight || '1.3',
      weight: tokens.typography?.fontSizes?.h2?.weight || '600',
      case: tokens.typography?.fontSizes?.h2?.case || 'Title Case',
    },
    h3: {
      size: tokens.typography?.fontSizes?.h3?.size || '1.5rem',
      lineHeight: tokens.typography?.fontSizes?.h3?.lineHeight || '1.4',
      weight: tokens.typography?.fontSizes?.h3?.weight || '600',
      case: tokens.typography?.fontSizes?.h3?.case || 'Title Case',
    },
  },
  body: {
    size: tokens.typography?.fontSizes?.body?.size || '1rem',
    lineHeight: tokens.typography?.fontSizes?.body?.lineHeight || '1.5',
    weight: tokens.typography?.fontSizes?.body?.weight || '400',
    case: tokens.typography?.fontSizes?.body?.case || 'Sentence case',
  },
  characteristics: tokens.typography?.characteristics || 'Modern, clean, highly readable sans-serif',
}

// Components
export const components = {
  buttons: {
    primary: {
      background: tokens.components?.uiComponents?.button?.variants?.default?.background || 'bg-primary',
      text: tokens.components?.uiComponents?.button?.variants?.default?.text || 'text-primary-foreground',
      shape: tokens.components?.uiComponents?.button?.shape || 'Rounded/pill-shaped (border-radius: 9999px)',
      hover: tokens.components?.uiComponents?.button?.variants?.default?.hover || 'hover:bg-primary/90',
    },
    secondary: {
      background: tokens.components?.uiComponents?.button?.variants?.secondary?.background || 'bg-secondary',
      text: tokens.components?.uiComponents?.button?.variants?.secondary?.text || 'text-secondary-foreground',
      shape: tokens.components?.uiComponents?.button?.shape || 'Rounded/pill-shaped (border-radius: 9999px)',
      hover: tokens.components?.uiComponents?.button?.variants?.secondary?.hover || 'hover:bg-secondary/80',
    },
    text: {
      text: tokens.components?.uiComponents?.button?.variants?.link?.text || 'text-primary',
      hover: tokens.components?.uiComponents?.button?.variants?.link?.hover || 'hover:underline',
    },
  },
  cards: {
    beritaCard: {
      structure: tokens.components?.publicComponents?.contentCards?.beritaCard?.structure || 'Vertical card with image top (aspect-video)',
      elements: tokens.components?.publicComponents?.contentCards?.beritaCard?.elements || [],
      hover: tokens.components?.publicComponents?.contentCards?.beritaCard?.hover || 'shadow-card-highlighted -translate-y-1 transition-all duration-300',
    },
    agendaCard: {
      structure: tokens.components?.publicComponents?.contentCards?.agendaCard?.structure || 'Horizontal or vertical with prominent date/time',
      elements: tokens.components?.publicComponents?.contentCards?.agendaCard?.elements || [],
    },
  },
  badges: {
    style: tokens.components?.badges?.style || 'Small rounded pill shapes (rounded-full)',
    usage: tokens.components?.badges?.usage || 'Category labels, status indicators',
    colors: tokens.components?.badges?.colors || 'Yellow, blue, or contextual colors',
    placement: tokens.components?.badges?.placement || 'Top of cards or inline with content',
  },
}

// Layout
export const layout = {
  structure: {
    type: tokens.layout.structure.type, // Full-width responsive layout
    maxWidth: tokens.layout.structure.maxWidth, // Container-based with full-width colored sections
    grid: tokens.layout.structure.grid, // Multi-column card grid system
  },
}

// Spacing Guidelines
export const spacingGuidelines = {
  sections: {
    vertical: tokens.spacing?.sections?.vertical || '60-100px between major sections',
    horizontal: tokens.spacing?.sections?.horizontal || 'Consistent margins for content containers',
  },
  cards: {
    gap: tokens.spacing?.cards?.gap || '20-30px between cards in grid layouts',
    internalPadding: tokens.spacing?.cards?.internalPadding || '20-40px internal padding in cards and containers',
  },
  patterns: {
    cardPadding: tokens.spacing?.patterns?.cardPadding || 'p-6 (1.5rem / 24px) standard card padding',
    sectionPadding: tokens.spacing?.patterns?.sectionPadding || 'px-4 sm:px-6 lg:px-8 responsive horizontal padding',
    containerMaxWidth: tokens.spacing?.patterns?.containerMaxWidth || '1280px maximum container width',
  },
}

export default {
  colors,
  spacing,
  typography,
  components,
  layout,
  spacingGuidelines,
}

