
export const INTELLIGENT_FILTER_CONFIGS = {
  hotels: {
    spa: {
      keywords: {
        primary: ['spa', 'relajación', 'masaje', 'bienestar', 'terapéutico', 'hidroterapia', 'jacuzzi', 'wellness'],
        secondary: ['sauna', 'vapor', 'calor', 'aromaterapia', 'meditación', 'yoga', 'pilates'],
        amenities: ['spa', 'wellness center', 'massage', 'jacuzzi', 'sauna', 'steam room', 'relaxation']
      },
      weight: 1.0,
      category: 'wellness'
    },
    sauna: {
      keywords: {
        primary: ['sauna', 'vapor', 'calor', 'steam', 'sudoración'],
        secondary: ['relajación', 'bienestar', 'terapéutico', 'spa', 'wellness'],
        amenities: ['sauna', 'steam room', 'vapor', 'wellness', 'spa']
      },
      weight: 1.0,
      category: 'wellness'
    },
    cocina: {
      keywords: {
        primary: ['cocina', 'kitchen', 'chef', 'gastronomía', 'culinario', 'cooking'],
        secondary: ['restaurante', 'comida', 'dining', 'menu', 'platos', 'recetas'],
        amenities: ['kitchen', 'cooking facilities', 'restaurant', 'dining', 'chef', 'culinary']
      },
      weight: 1.0,
      category: 'dining'
    },
    gym: {
      keywords: {
        primary: ['gym', 'gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'workout'],
        secondary: ['musculación', 'cardio', 'pesas', 'máquinas', 'deporte', 'atletismo'],
        amenities: ['gym', 'fitness center', 'workout', 'exercise', 'training', 'weights', 'cardio']
      },
      weight: 1.0,
      category: 'fitness'
    },
    rest: {
      keywords: {
        primary: ['restaurante', 'restaurant', 'comida', 'dining', 'gastronomía'],
        secondary: ['chef', 'culinario', 'menu', 'platos', 'cocina', 'kitchen'],
        amenities: ['restaurant', 'dining', 'food', 'kitchen', 'chef', 'culinary', 'bar']
      },
      weight: 1.0,
      category: 'dining'
    }
  },
  beaches: {
    surf: {
      keywords: {
        primary: ['surf', 'surfing', 'olas', 'tabla', 'wave', 'surfista', 'surfboard'],
        secondary: ['océano', 'mar', 'costa', 'playa', 'deporte', 'acuático', 'aventura'],
        amenities: ['surf', 'surfing', 'waves', 'ocean', 'beach', 'water sports']
      },
      weight: 1.0,
      category: 'sports'
    },
    pesca: {
      keywords: {
        primary: ['pesca', 'fishing', 'pescar', 'pescador', 'caña', 'anzuelo', 'pescado'],
        secondary: ['mar', 'océano', 'río', 'lago', 'agua', 'naturaleza', 'tranquilo'],
        amenities: ['fishing', 'fishing spot', 'water', 'nature', 'quiet']
      },
      weight: 1.0,
      category: 'nature'
    },
    camping: {
      keywords: {
        primary: ['camping', 'campamento', 'tienda', 'carpa', 'campista', 'acampada'],
        secondary: ['naturaleza', 'aire libre', 'aventura', 'montaña', 'bosque', 'estrellas'],
        amenities: ['camping', 'tent', 'nature', 'outdoor', 'adventure', 'wilderness']
      },
      weight: 1.0,
      category: 'nature'
    },
    favoritas: {
      keywords: {
        primary: ['favorito', 'favorite', 'preferido', 'mejor', 'destacado', 'recomendado'],
        secondary: ['popular', 'visitado', 'conocido', 'famoso', 'turístico', 'atractivo'],
        amenities: ['popular', 'favorite', 'recommended', 'tourist', 'attraction']
      },
      weight: 1.0,
      category: 'popular'
    }
  },
  restaurants: {
    comida_rapida: {
      keywords: {
        primary: ['comida rápida', 'fast food', 'hamburguesa', 'pizza', 'sandwich', 'rápido'],
        secondary: ['delivery', 'takeout', 'para llevar', 'casual', 'informal'],
        amenities: ['fast food', 'delivery', 'takeout', 'casual dining']
      },
      weight: 1.0,
      category: 'dining'
    },
    fine_dining: {
      keywords: {
        primary: ['fine dining', 'gourmet', 'chef', 'alta cocina', 'elegante', 'sofisticado'],
        secondary: ['lujo', 'premium', 'exclusivo', 'refinado', 'culinario'],
        amenities: ['fine dining', 'gourmet', 'chef', 'premium', 'luxury']
      },
      weight: 1.0,
      category: 'dining'
    },
    local: {
      keywords: {
        primary: ['local', 'tradicional', 'auténtico', 'regional', 'típico', 'nativo'],
        secondary: ['cultura', 'tradición', 'historia', 'autóctono', 'vernáculo'],
        amenities: ['local', 'traditional', 'authentic', 'regional', 'cultural']
      },
      weight: 1.0,
      category: 'culture'
    }
  },
  parks: {
    nacional: {
      keywords: {
        primary: ['parque nacional', 'national park', 'naturaleza', 'protegido', 'conservación'],
        secondary: ['biodiversidad', 'ecosistema', 'vida silvestre', 'flora', 'fauna'],
        amenities: ['national park', 'nature', 'wildlife', 'conservation', 'biodiversity']
      },
      weight: 1.0,
      category: 'nature'
    },
    urbano: {
      keywords: {
        primary: ['parque urbano', 'city park', 'ciudad', 'urbano', 'recreación', 'ejercicio'],
        secondary: ['jardín', 'verde', 'aire libre', 'actividades', 'deporte'],
        amenities: ['city park', 'urban', 'recreation', 'green space', 'activities']
      },
      weight: 1.0,
      category: 'urban'
    },
    tematico: {
      keywords: {
        primary: ['parque temático', 'theme park', 'diversión', 'atracciones', 'entretenimiento'],
        secondary: ['familia', 'niños', 'aventura', 'emocionante', 'divertido'],
        amenities: ['theme park', 'attractions', 'entertainment', 'family', 'fun']
      },
      weight: 1.0,
      category: 'entertainment'
    }
  }
};

export const getFilterConfig = (category: string, filterId: string) => {
  const categoryConfig = INTELLIGENT_FILTER_CONFIGS[category as keyof typeof INTELLIGENT_FILTER_CONFIGS];
  return categoryConfig?.[filterId as keyof typeof categoryConfig] || null;
};

export const getAvailableFilters = (category: string) => {
  const categoryConfig = INTELLIGENT_FILTER_CONFIGS[category as keyof typeof INTELLIGENT_FILTER_CONFIGS];
  return categoryConfig ? Object.keys(categoryConfig) : [];
};

export const hasFilter = (category: string, filterId: string): boolean => {
  const categoryConfig = INTELLIGENT_FILTER_CONFIGS[category as keyof typeof INTELLIGENT_FILTER_CONFIGS];
  return categoryConfig ? filterId in categoryConfig : false;
};
