# Glasc Mobile 🧴✨

A personalized skincare companion app that helps users make informed decisions about their skincare routine through AI-powered analysis, product scanning, and personalized recommendations.
Web: https://glasc-api.netlify.app/

## 🌟 Features

### Core Functionality
- **Product Scanning**: Scan barcodes to instantly identify skincare products
- **Manual Search**: Search for products when scanning isn't available
- **Ingredient Analysis**: Get detailed breakdowns of product ingredients with safety warnings
- **Skin Analysis**: Upload photos for AI-powered skin condition assessment
- **Compatibility Check**: Verify if new products work with your current routine
- **Smart Recommendations**: Discover similar products and budget-friendly alternatives

### Personal Care Management
- **Custom Routines**: Create and manage morning/evening skincare routines
- **Progress Tracking**: Monitor skin improvement over time with photo comparisons
- **Reminder System**: Get notifications to maintain routine consistency
- **Shopping Integration**: Purchase recommended products directly through the app

### User Experience
- **Personalized Onboarding**: Register with your specific skin type and concerns
- **Secure Authentication**: Safe login and profile management
- **Product Updates**: Stay informed about product changes and recalls
- **Settings Management**: Customize your app experience and preferences

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **Database**: PostgreSQL (AWS RDS)
- **State Management**: React Native AsyncStorage
- **Camera**: Expo Camera for barcode scanning
- **HTTP Client**: Axios
- **UI Components**: React Native Elements, Lucide React Native

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd glasc_mobile
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local` and configure your database connection
   - Ensure your PostgreSQL database is running

4. Initialize the database:
```bash
# Run the setup script in db/setup.sql
```

5. Start the development server:
```bash
npm start
```

6. Run on your preferred platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 📱 App Structure

```
app/
├── api/           # API endpoints and data handling
├── login/         # Authentication screens
├── signup/        # User registration
├── scan/          # Product scanning functionality
├── search/        # Product search features
├── settings/      # User preferences and profile
└── personal_form/ # Skin type and preference forms

components/        # Reusable UI components
model/            # Data models and types
util/             # Helper functions and validation
db/               # Database setup and migrations
```

## 🔗 API Integrations

- **Skincare Product API**: Product information and ingredient data
- **Skin Analysis API**: AI-powered skin condition assessment
- **Shopping APIs**: Product purchasing and price tracking

## 📊 Development Roadmap

### ✅ Iteration 1 (Weeks 1-2)
- User authentication and registration
- Product barcode scanning
- Manual product search
- Product details display

### 🔄 Iteration 2 (Weeks 2-3)
- Ingredient analysis and warnings
- Skin condition recognition
- Product compatibility checking
- Recommendation engine
- Personal routine management

### 📋 Iteration 3 (Weeks 3-4)
- Push notifications and reminders
- Shopping integration
- Product update alerts
- Progress tracking
- Advanced profile management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License.

## 📞 Support

For questions or support, please refer to the user stories documentation in `user-stories.md` for detailed feature specifications and engineering tasks.
