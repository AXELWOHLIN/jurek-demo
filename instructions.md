# Jurek Recruitment Data Lake - Product Requirements Document

## Overview
A modern web application to aggregate and visualize job listings from multiple providers (Meritmind, Poolia, and Arbetsförmedlingen) in a unified interface. The application will provide different views of the job data and allow configuration of email notifications.

## Technical Stack
- Next.js
- shadcn/ui component library
- Vercel deployment
- CSV data sources

## Data Structure
The application will combine data from three sources:
1. Meritmind jobs (CSV with direct links)
2. Poolia jobs (CSV with direct links) 
3. Arbetsförmedlingen jobs (CSV with IDs, links constructed as https://arbetsformedlingen.se/platsbanken/annonser/{id})

Common fields across sources:
- Title
- Link/URL
- Date Added
- Source/Provider

## Pages & Features

### 1. Today's Listings Page
**Purpose:** Show newest job listings and previous day's listings
**Components:**
- Two tab panels: "Today" and "Yesterday"
- Job cards displaying:
  - Job title
  - Company/Source
  - Direct link to listing
  - Time posted
- Filtering options by source
- Modern card grid layout
- Loading states
- Empty states

### 2. Weekly Listings Page  
**Purpose:** Display current week's listings and previous week's listings
**Components:**
- Two tab panels: "This Week" and "Last Week"
- Same job card components as Today's page
- Date grouping by day
- Filtering and sorting options
- Pagination for large result sets

### 3. All Listings Page
**Purpose:** Complete searchable database of all listings
**Components:**
- Advanced search bar
- Filter panel with:
  - Date ranges
  - Sources
  - Keywords
- Sortable data table with:
  - Title
  - Source
  - Date
  - Link
- Pagination
- Export functionality

### 4. Email Configuration Page
**Purpose:** Allow users to manage email notification settings
**Components:**
- Email address input form
- Email list management
  - Add/remove emails
  - Validation
- Notification preferences
  - Frequency (daily/weekly)
  - Sources to include
- Save/update functionality

## UI/UX Requirements
- Clean, modern interface using shadcn components
- Consistent styling across all pages
- Responsive design for all screen sizes
- Dark/light mode support
- Loading states and error handling
- Toast notifications for user actions
- Smooth transitions between views

## Navigation
- Persistent top navigation bar
- Clear active state indicators
- Mobile-friendly menu
- Breadcrumb navigation where appropriate

## Data Handling
- Regular CSV data imports
- Data normalization across sources
- Caching strategy
- Error handling for missing/malformed data
- Link validation

## Future Considerations
- Authentication system
- User preferences storage
- Additional job sources
- Analytics dashboard
- API endpoint for external consumption

## Success Metrics
- Page load times under 2 seconds
- Successful data aggregation from all sources
- Email configuration system readiness
- UI/UX satisfaction through user testing
- Responsive design verification

## Development Phases
1. Data ingestion and normalization
2. Core UI components development
3. Page layout and navigation
4. Email configuration interface
5. Testing and optimization
6. Deployment preparation
