# Glasc Mobile - User Stories & Engineering Tasks

## Project Overview
**Project:** Glasc Mobile Skincare App
**Timeline:** 1 month
**Deliverables:** Mobile app, API integration

---

## Iteration 1 (Week 1-2) - Core Authentication & Product Scanning

### User Story 1: User Registration (Keshia)
**As a** new user
**I want to** create an account with my personal skin information
**So that** I can receive personalized skincare recommendations

**Engineering Tasks:**
- Set up authentication system
- Create user registration form with skin type fields
- Implement user data storage
- Design onboarding flow

### User Story 2: User Login (Keshia)
**As a** returning user
**I want to** log into my account
**So that** I can access my personalized skincare data

**Engineering Tasks:**
- Implement login functionality
- Add session management
- Create login UI/UX
- Handle authentication errors

### User Story 3: Product Barcode Scanning
**As a** user
**I want to** scan a skincare product's barcode
**So that** I can quickly identify the product

**Engineering Tasks:**
- Integrate camera/barcode scanner
- Connect to skincare API for product lookup
- Handle scan errors and fallbacks
- Create scanning interface

### User Story 4: Manual Product Search
**As a** user
**I want to** manually search for products
**So that** I can find products when scanning isn't available

**Engineering Tasks:**
- Build search functionality
- Implement product database queries
- Create search results UI
- Add search filters

### User Story 5: Product Details Display
**As a** user
**I want to** view detailed product information (ingredients, brand, price)
**So that** I can make informed purchasing decisions

**Engineering Tasks:**
- Design product detail screens
- Parse and display API data
- Format ingredient lists
- Add product images and pricing

---

## Iteration 2 (Week 2-3) - AI Features & Recommendations

### User Story 6: Ingredient Analysis
**As a** user
**I want to** see ingredient analysis and warnings
**So that** I can avoid harmful or incompatible ingredients

**Engineering Tasks:**
- Implement ingredient parsing logic
- Create warning system for overclaims/conflicts
- Design ingredient analysis UI
- Add ingredient education content

### User Story 7: Skin Condition Recognition
**As a** user
**I want to** upload photos for skin analysis
**So that** I can understand my current skin condition

**Engineering Tasks:**
- Integrate skin analysis API
- Implement photo capture/upload
- Process AI analysis results
- Display skin condition insights

### User Story 8: Product Compatibility Check
**As a** user
**I want to** check if a new product is compatible with my current routine
**So that** I can avoid adverse reactions

**Engineering Tasks:**
- Build compatibility algorithm
- Compare product formulations
- Create compatibility scoring system
- Design compatibility results UI

### User Story 9: Similar Product Recommendations
**As a** user
**I want to** see similar or dupe products
**So that** I can find alternatives that fit my budget

**Engineering Tasks:**
- Implement recommendation engine
- Create product similarity matching
- Design recommendation cards
- Add price comparison features

### User Story 10: Personal Skincare Routine
**As a** user
**I want to** create and manage my skincare routine
**So that** I can track my daily skincare regimen

**Engineering Tasks:**
- Build routine creation interface
- Implement routine storage and editing
- Create morning/evening routine views
- Add product ordering within routines

---

## Iteration 3 (Week 3-4) - Advanced Features & Polish

### User Story 11: Routine Reminders
**As a** user
**I want to** receive notifications for my skincare routine
**So that** I can maintain consistency in my regimen

**Engineering Tasks:**
- Implement push notification system
- Create reminder scheduling
- Design notification settings
- Add reminder customization options

### User Story 12: Skincare Shopping Integration
**As a** user
**I want to** purchase recommended products
**So that** I can easily buy items that suit my skin

**Engineering Tasks:**
- Integrate shopping APIs or affiliate links
- Create in-app purchase flow
- Add price tracking features
- Implement wishlist functionality

### User Story 13: Product Updates & Alerts
**As a** user
**I want to** receive updates about product changes or recalls
**So that** I can stay informed about my skincare products

**Engineering Tasks:**
- Create product monitoring system
- Implement alert notifications
- Design update notification UI
- Add product change tracking

### User Story 14: Routine Progress Tracking
**As a** user
**I want to** track my skin improvement over time
**So that** I can see the effectiveness of my routine

**Engineering Tasks:**
- Build progress tracking system
- Create before/after photo comparison
- Implement skin condition timeline
- Design progress visualization charts

### User Story 15: Profile & Settings Management
**As a** user
**I want to** manage my profile and app preferences
**So that** I can customize my experience

**Engineering Tasks:**
- Create profile management interface
- Implement settings configuration
- Add data export/import features
- Build account deletion functionality

---

## Technical Architecture

### APIs to Integrate:
- Skincare Product API: https://github.com/LauraAddams/skincareAPI
- Skin Analysis API: https://www.perfectcorp.com/business/blog/ai-skincare/skin-analysis-api

### Key Technologies:
- Mobile: React Native
- Backend: Node.js
- Database: PostgreSQL (NeonDB)
- Authentication: Firebase Auth / Auth0
- Notifications:

### Success Metrics:
- User registration completion rate
- Product scan success rate
- Routine adherence tracking
- User engagement with recommendations