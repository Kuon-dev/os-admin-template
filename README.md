# Admin Dashboard

A comprehensive, demo admin dashboard built with Next.js, React, TypeScript, and modern UI libraries.

## 🎯 Overview

This is a **dummy project** created for demonstration and learning purposes. It showcases common admin dashboard patterns with beautiful animations and meaningful, non-redundant metrics.

## ✨ Features

### Dashboard Components
- **StatCard** - Animated statistics with NumberFlow transitions
- **LiveMetric** - Real-time updating metrics
- **ProgressRing** - Circular progress indicators
- **MiniChart** - Line/bar sparkline visualizations
- **ActivityFeed** - Timeline-style event feed
- **DataTable** - Flexible tables with custom renderers

### Dashboard Sections
- **Live Operational Metrics** - Real-time system health monitoring
- **Key Business Metrics** - Strategic performance indicators (Revenue, Customers, Retention, Conversion, AOV, LTV)
- **Performance Trends** - 7-day visualizations
- **Quarterly Objectives** - Strategic goal tracking
- **Activity Feed** - Recent system events
- **System Health** - Infrastructure monitoring
- **Top Products** - Revenue stream rankings
- **Transactions Table** - Recent orders
- **Platform Health** - Scale and quality KPIs

### Additional Modules
- **Employee Dashboard** - Employee portal with time tracking, leave management, and schedule viewing
- **Leave Management** - Request and track leave balances
- **Payroll** - View payslips and payment history
- **Schedule** - Team schedule management
- **Timesheet** - Time entry tracking
- **CMS Page Builder** - Visual page builder with drag-and-drop components
- **User Management** - User CRUD operations
- **Product Management** - Product catalog management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm/bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Motion (Framer Motion) + NumberFlow
- **State Management:** Zustand
- **Internationalization:** next-intl
- **Date Handling:** date-fns
- **Icons:** Lucide React

## 📦 Project Structure

```
app/(dashboard)/app/        # Dashboard pages
components/                 # Reusable components
  ├── dashboard/           # Dashboard-specific components
  ├── employees/           # Employee module components
  ├── cms/                 # CMS page builder components
  └── ui/                  # shadcn/ui components
lib/                       # Utilities and helpers
  └── mock-data/          # Mock data generators
stores/                    # Zustand state stores
types/                     # TypeScript type definitions
```

## 🎨 Design Principles

### Metric Organization
All dashboard metrics are strategically categorized to avoid redundancy:

- **Live Operational Metrics** - Real-time system health (sessions, response time, server load, error rate)
- **Key Business Metrics** - Strategic performance (revenue, customers, retention, conversion, AOV, LTV)
- **Performance Trends** - Momentum indicators (revenue, conversion, orders, signups)
- **Quarterly Objectives** - Strategic goals with progress tracking
- **Platform Health** - Infrastructure KPIs (users, uptime, data processed, CSAT)

### Animation Strategy
- NumberFlow for all numeric transitions
- Staggered entrance animations
- Scroll-triggered reveals (Intersection Observer)
- Smooth hover effects
- Chart path drawing animations

## 🎯 Key Features

- ✅ **No Redundancy** - Every metric serves a unique purpose
- ✅ **Clear Categorization** - Operational vs Business vs Strategic metrics
- ✅ **Actionable Insights** - Each metric drives decisions
- ✅ **Coherent Narrative** - Metrics tell complete business story
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Mock Data** - No backend required
- ✅ **Production Ready** - Clean, maintainable code

## 📝 Important Notes

- **No API Integration Required** - This project uses mock data only
- All data is static or generated at runtime
- Focus on UI/UX implementation and frontend functionality
- Not intended for production use - demo purposes only

## 🤝 Contributing

This is a demo project. Feel free to fork and experiment!

## 📄 License

MIT
