# FellahSouq (سوق الفلاح)

## Overview

**FellahSouq** (Arabic: سوق الفلاح, meaning "Farmer's Market") is a comprehensive **Moroccan agricultural marketplace platform** that connects farmers, buyers, investors, and agricultural service providers across Morocco.

---

## Purpose

The platform serves as an online hub for trading:
- Agricultural land (sales, rentals, partnerships)
- Farm equipment (sales, rentals, spare parts)
- Livestock (cattle, sheep, goats, poultry)
- Farm products (vegetables, fruits, olive oil, honey)
- Agricultural supplies (seeds, fertilizers, pesticides)
- Investment opportunities in agriculture
- Agricultural services (plowing, irrigation, harvesting)
- Auction listings
- Agricultural job postings

---

## Target Audience

| Audience | Description |
|----------|-------------|
| **Farmers** | Primary users selling land, products, equipment, or seeking services |
| **Buyers** | Individuals/businesses purchasing agricultural products and land |
| **Investors** | Domestic and international investors seeking agricultural opportunities |
| **Service Providers** | Workers offering plowing, irrigation, harvesting, and repair services |
| **Consumers** | End consumers buying fresh farm products directly |

**Geographic Focus:** Morocco  
**Languages:** Arabic (primary, RTL) and French (secondary)

---

## Key Features

### 1. Bilingual Support
- Full Arabic/French localization
- Automatic RTL/LTR switching
- Locale-based routing (`/ar/*` and `/fr/*`)

### 2. Nine Main Categories

| Category | Arabic | French | Examples |
|----------|--------|--------|----------|
| Agricultural Lands | الأراضي الزراعية | Terrains agricoles | Farms, investment land, partnerships |
| Farm Equipment | المعدات الزراعية | Équipements agricoles | Tractors, harvesters, spare parts |
| Farm Supplies | المستلزمات الزراعية | Fournitures agricoles | Seeds, fertilizers, irrigation systems |
| Livestock | الماشية | Bétail | Cattle, sheep, goats, poultry, bees |
| Agricultural Investment | الاستثمار الزراعي | Investissement agricole | Project funding, partnerships |
| Farm Services | الخدمات الزراعية | Services agricoles | Plowing, spraying, harvesting, repair |
| Farm Products | منتجات الفلاح | Produits du fermier | Vegetables, fruits, olive oil, honey, dates |
| Auctions | المزادات | Enchères | Equipment, land, livestock auctions |
| Agricultural Jobs | وظائف زراعية | Emplois agricoles | Job offers and requests |

### 3. User Roles

| Role | Arabic | Capabilities |
|------|--------|--------------|
| Buyer | مشتري | Browse, contact sellers, save favorites |
| Seller | بائع | Post listings, manage inventory |
| Investor | مستثمر | Browse investment opportunities |
| Worker | عامل | Offer agricultural services |
| Admin | مدير | Full platform management |

### 4. Core Functionality

- **Category Browsing**: Filter listings by category and subcategory
- **Listing Details**: View full listing with images, price, location, contact info
- **Search**: Global search across all listings
- **Role-based Dashboards**: Personalized dashboard for each user type
- **Contact System**: Direct contact via phone/messaging
- **Favorites/Wishlist**: Save listings for later
- **Featured Listings**: Highlighted premium listings on homepage
- **Responsive Design**: Mobile-first approach

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| Internationalization | next-intl |
| UI Components | Headless UI, Heroicons |
| Fonts | Cairo (Arabic), Montserrat (Latin) |
| Containerization | Docker-ready (standalone output) |

### Design System

| Element | Value |
|---------|-------|
| Primary Color | `#1E4D2B` (Deep Green) |
| Accent Color | `#C9A227` (Gold) |
| Arabic Font | Cairo |
| Latin Font | Montserrat |

---

## User Flows

### Buyer Flow
1. Visit homepage → Browse categories
2. Filter by category/subcategory
3. View listing details
4. Contact seller via phone or messaging
5. Negotiate and complete transaction

### Seller/Farmer Flow
1. Register as seller
2. Login to dashboard
3. Create new listing with images and details
4. Manage listings and respond to inquiries
5. Track views and statistics

### Investor Flow
1. Browse investment opportunities
2. View detailed agricultural investment listings
3. Contact for partnership and funding details

---

## Data Models

### Listing
```typescript
{
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  price: number
  categorySlug: string
  subcategorySlug: string
  location: string
  locationAr: string
  images: string[]
  createdAt: string
  featured: boolean
  type: 'sale' | 'rent'
  contactName: string
  contactPhone: string
}
```

### User
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  role: 'buyer' | 'seller' | 'investor' | 'worker' | 'admin'
  verified: boolean
  createdAt: string
}
```

### Category
```typescript
{
  id: string
  slug: string
  nameAr: string
  nameFr: string
  icon: string
  descriptionAr: string
  descriptionFr: string
  subcategories: Subcategory[]
}
```

---

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Or connect GitHub repository at [vercel.com](https://vercel.com)

### Option 2: Docker
```bash
docker-compose up -d
```

### Option 3: Manual
```bash
npm install
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing (ar, fr)
│   │   ├── page.tsx        # Homepage
│   │   ├── listings/       # All listings page
│   │   ├── category/       # Category browsing
│   │   ├── listing/        # Single listing detail
│   │   ├── dashboard/     # User dashboard
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── lands/         # Lands marketplace
│   │   ├── equipment/     # Equipment marketplace
│   │   └── investment/    # Investment opportunities
│   └── layout.tsx         # Root layout
├── components/
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
├── data/
│   ├── categories.ts      # Category definitions
│   └── listings.ts        # Sample listings
├── store/
│   └── index.ts           # Zustand state
├── types/
│   └── index.ts           # TypeScript interfaces
├── messages/
│   ├── ar.json            # Arabic translations
│   └── fr.json            # French translations
├── i18n/                  # i18n configuration
└── middleware.ts          # Locale routing middleware
```

---

## Sample Cities Covered

- Marrakech (مراكش)
- Safi (آسفي)
- Fes (فاس)
- Meknes (مكناس)
- Agadir (أكادير)
- And other Moroccan cities

---

## Future Enhancements

- Real user authentication system
- Messaging system between users
- Payment integration for transactions
- Location-based listing filtering
- Push notifications
- Mobile app (React Native)
- Multi-currency support
- Price negotiation system
- Review and rating system
