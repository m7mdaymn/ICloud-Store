import { environment } from '@env/environment';

const API_BASE = environment.apiUrl;

export const API_ENDPOINTS = {
  // Auth Endpoints
  auth: {
    login: `${API_BASE}/Auth/login`,
    register: `${API_BASE}/Auth/register`,
    refreshToken: `${API_BASE}/Auth/refresh-token`,
    revokeToken: `${API_BASE}/Auth/revoke-token`,
    changePassword: `${API_BASE}/Auth/change-password`,
    me: `${API_BASE}/Auth/me`,
  },

  // Brands Endpoints
  brands: {
    getAll: `${API_BASE}/Brands`,
    create: `${API_BASE}/Brands`,
    getById: (id: number) => `${API_BASE}/Brands/${id}`,
    update: (id: number) => `${API_BASE}/Brands/${id}`,
    delete: (id: number) => `${API_BASE}/Brands/${id}`,
    getBySlug: (slug: string) => `${API_BASE}/Brands/slug/${slug}`,
    uploadLogo: (id: number) => `${API_BASE}/Brands/${id}/logo`,
    reorder: `${API_BASE}/Brands/reorder`,
  },

  // Categories Endpoints
  categories: {
    getAll: `${API_BASE}/Categories`,
    create: `${API_BASE}/Categories`,
    getRoot: `${API_BASE}/Categories/root`,
    getById: (id: number) => `${API_BASE}/Categories/${id}`,
    update: (id: number) => `${API_BASE}/Categories/${id}`,
    delete: (id: number) => `${API_BASE}/Categories/${id}`,
    getBySlug: (slug: string) => `${API_BASE}/Categories/slug/${slug}`,
    uploadImage: (id: number) => `${API_BASE}/Categories/${id}/image`,
    reorder: `${API_BASE}/Categories/reorder`,
  },

  // Home Sections Endpoints
  homeSections: {
    getAll: `${API_BASE}/HomeSections`,
    create: `${API_BASE}/HomeSections`,
    getActive: `${API_BASE}/HomeSections/active`,
    getById: (id: number) => `${API_BASE}/HomeSections/${id}`,
    update: (id: number) => `${API_BASE}/HomeSections/${id}`,
    delete: (id: number) => `${API_BASE}/HomeSections/${id}`,
    reorder: `${API_BASE}/HomeSections/reorder`,
    items: {
      getById: (id: number) => `${API_BASE}/HomeSections/items/${id}`,
      create: `${API_BASE}/HomeSections/items`,
      update: (id: number) => `${API_BASE}/HomeSections/items/${id}`,
      delete: (id: number) => `${API_BASE}/HomeSections/items/${id}`,
      uploadDesktopImage: (id: number) => `${API_BASE}/HomeSections/items/${id}/image-desktop`,
      uploadMobileImage: (id: number) => `${API_BASE}/HomeSections/items/${id}/image-mobile`,
    },
  },

  // Leads Endpoints
  leads: {
    create: `${API_BASE}/Leads`,
    getAll: `${API_BASE}/Leads`,
    getTodayStats: `${API_BASE}/Leads/stats/today`,
  },

  // Products Endpoints
  products: {
    getAll: `${API_BASE}/Products`,
    create: `${API_BASE}/Products`,
    getById: (id: number) => `${API_BASE}/Products/${id}`,
    update: (id: number) => `${API_BASE}/Products/${id}`,
    delete: (id: number) => `${API_BASE}/Products/${id}`,
    getBySlug: (slug: string) => `${API_BASE}/Products/slug/${slug}`,
    restore: (id: number) => `${API_BASE}/Products/${id}/restore`,
    stock: {
      get: (id: number) => `${API_BASE}/Products/${id}/stock`,
      update: (id: number) => `${API_BASE}/Products/${id}/stock`,
    },
    attributes: {
      getAll: (id: number) => `${API_BASE}/Products/${id}/attributes`,
      create: (id: number) => `${API_BASE}/Products/${id}/attributes`,
      update: (attrId: number) => `${API_BASE}/Products/attributes/${attrId}`,
      delete: (attrId: number) => `${API_BASE}/Products/attributes/${attrId}`,
    },
    paymentInfo: {
      get: (id: number) => `${API_BASE}/Products/${id}/payment-info`,
      save: (id: number) => `${API_BASE}/Products/${id}/payment-info`,
    },
    installmentPlans: {
      getAll: (id: number) => `${API_BASE}/Products/${id}/installment-plans`,
      create: (id: number) => `${API_BASE}/Products/${id}/installment-plans`,
      update: (planId: number) => `${API_BASE}/Products/installment-plans/${planId}`,
      delete: (planId: number) => `${API_BASE}/Products/installment-plans/${planId}`,
    },
  },

  // Recently Viewed Endpoints
  recentlyViewed: {
    getAll: `${API_BASE}/RecentlyViewed`,
    addUnit: (unitId: number) => `${API_BASE}/RecentlyViewed/units/${unitId}`,
    addProduct: (productId: number) => `${API_BASE}/RecentlyViewed/products/${productId}`,
    clear: `${API_BASE}/RecentlyViewed/clear`,
  },

  // Settings Endpoints
  settings: {
    getStoreInfo: `${API_BASE}/Settings/store-info`,
    theme: {
      get: `${API_BASE}/Settings/theme`,
      update: `${API_BASE}/Settings/theme`,
      uploadLogoLight: `${API_BASE}/Settings/theme/logo-light`,
      uploadLogoDark: `${API_BASE}/Settings/theme/logo-dark`,
      uploadFavicon: `${API_BASE}/Settings/theme/favicon`,
    },
    store: {
      getAll: `${API_BASE}/Settings/store`,
      getByKey: (key: string) => `${API_BASE}/Settings/store/${key}`,
      update: (key: string) => `${API_BASE}/Settings/store/${key}`,
    },
    socialLinks: {
      getAll: `${API_BASE}/Settings/social-links`,
      create: `${API_BASE}/Settings/social-links`,
      update: (id: number) => `${API_BASE}/Settings/social-links/${id}`,
      delete: (id: number) => `${API_BASE}/Settings/social-links/${id}`,
      reorder: `${API_BASE}/Settings/social-links/reorder`,
    },
  },

  // Units Endpoints
  units: {
    getAll: `${API_BASE}/Units`,
    create: `${API_BASE}/Units`,
    getAvailable: `${API_BASE}/Units/available`,
    getNewArrivals: `${API_BASE}/Units/new-arrivals`,
    getFeatured: `${API_BASE}/Units/featured`,
    getById: (id: number) => `${API_BASE}/Units/${id}`,
    update: (id: number) => `${API_BASE}/Units/${id}`,
    delete: (id: number) => `${API_BASE}/Units/${id}`,
    duplicate: (id: number) => `${API_BASE}/Units/${id}/duplicate`,
    restore: (id: number) => `${API_BASE}/Units/${id}/restore`,
    updateStatus: (id: number) => `${API_BASE}/Units/${id}/status`,
    media: {
      getAll: (id: number) => `${API_BASE}/Units/${id}/media`,
      add: (id: number) => `${API_BASE}/Units/${id}/media`,
      setCover: (unitId: number, mediaId: number) => `${API_BASE}/Units/${unitId}/media/${mediaId}/cover`,
      delete: (mediaId: number) => `${API_BASE}/Units/media/${mediaId}`,
      reorder: (id: number) => `${API_BASE}/Units/${id}/media/reorder`,
    },
    paymentInfo: {
      get: (id: number) => `${API_BASE}/Units/${id}/payment-info`,
      save: (id: number) => `${API_BASE}/Units/${id}/payment-info`,
    },
    installmentPlans: {
      getAll: (id: number) => `${API_BASE}/Units/${id}/installment-plans`,
      create: (id: number) => `${API_BASE}/Units/${id}/installment-plans`,
      update: (planId: number) => `${API_BASE}/Units/installment-plans/${planId}`,
      delete: (planId: number) => `${API_BASE}/Units/installment-plans/${planId}`,
    },
  },

  // Wishlist Endpoints
  wishlist: {
    getAll: `${API_BASE}/Wishlist`,
    addUnit: (unitId: number) => `${API_BASE}/Wishlist/units/${unitId}`,
    addProduct: (productId: number) => `${API_BASE}/Wishlist/products/${productId}`,
    remove: (id: number) => `${API_BASE}/Wishlist/${id}`,
    checkUnit: (unitId: number) => `${API_BASE}/Wishlist/check/unit/${unitId}`,
    checkProduct: (productId: number) => `${API_BASE}/Wishlist/check/product/${productId}`,
  },
} as const;