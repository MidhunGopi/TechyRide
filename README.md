# TechyRide - Carpooling Application

A cross-platform carpooling mobile application for Android and iOS, built with React Native. TechyRide connects employees within organizations to share rides, reduce commuting costs, and promote sustainable transportation.

## Features

### Core Functionality
- ✅ **Ride Creation**: Create rides with starting point, destination, and fare per km
- ✅ **Ride Search**: Find available rides from other users
- ✅ **Company Email Verification**: Secure authentication with company email validation
- ✅ **Google Maps Integration Ready**: Location services and navigation (API key required)
- ✅ **Points-Based Payment System**: Earn and spend points for rides
- ✅ **UPI Redemption**: Convert points to Indian Rupees via UPI transfer
- ✅ **User Profiles**: Manage your account and preferences
- ✅ **Ride History**: Track your past and upcoming rides
- ✅ **Wallet Management**: View transactions and manage your points

### User Roles
- **Driver**: Create rides, set fares, earn points from passengers
- **Passenger**: Book rides, pay with points, track ride history

## Technology Stack

- **Framework**: React Native 0.72.6
- **Navigation**: React Navigation 6.x
- **Maps**: React Native Maps (Google Maps)
- **Storage**: AsyncStorage
- **State Management**: React Context API
- **Icons**: React Native Vector Icons

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 16.x)
- npm or yarn
- React Native development environment
  - For Android: Android Studio, Android SDK, Java JDK
  - For iOS: Xcode (macOS only), CocoaPods

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MidhunGopi/TechyRide.git
   cd TechyRide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Maps API Key**
   
   For Android:
   - Open `android/app/src/main/AndroidManifest.xml`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps API key
   
   For iOS:
   - Open `ios/TechyRide/AppDelegate.m`
   - Add Google Maps API key configuration
   
   Get your API key from: https://console.cloud.google.com/google/maps-apis/

4. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the Application

### Android
```bash
npm run android
```

### iOS (macOS only)
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
TechyRide/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js  # Authentication state management
│   │   └── PaymentContext.js # Payment and points management
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js # Main app navigation
│   ├── screens/            # Application screens
│   │   ├── auth/           # Login and registration
│   │   ├── home/           # Home and ride listing
│   │   ├── ride/           # Ride creation and details
│   │   ├── wallet/         # Wallet and redemption
│   │   └── profile/        # User profile
│   ├── components/         # Reusable components (future)
│   ├── services/           # API services (future)
│   ├── utils/              # Utility functions (future)
│   └── App.js              # Root component
├── package.json
├── babel.config.js
└── README.md
```

## Usage Guide

### For Drivers

1. **Register/Login** with your company email
2. **Create a Ride**:
   - Navigate to Home screen
   - Tap "Create Ride" button
   - Fill in starting point, destination, distance, and fare per km
   - Set date, time, and available seats
   - Submit to publish your ride

3. **Earn Points**: When passengers book your ride, you earn points equal to the fare

### For Passengers

1. **Register/Login** with your company email
2. **Find Rides**:
   - Browse available rides on the Home screen
   - View ride details by tapping on a ride card
   - Check route, fare, and driver information

3. **Book a Ride**:
   - Tap "Book Ride" on the ride details screen
   - Confirm booking (points will be deducted)
   - View booked rides in "My Rides" tab

4. **Redeem Points**:
   - Go to Wallet tab
   - Tap "Redeem via UPI"
   - Enter amount and UPI ID
   - Confirm redemption (₹10 minimum)

## Payment System

- **1 Point = ₹1 INR**
- **Fare Calculation**: Distance (km) × Fare per km
- **Point Transfer**: Instant transfer between driver and passenger
- **UPI Redemption**: Convert points to INR (minimum ₹10)

## Security Features

- Company email validation
- Secure authentication
- Transaction history tracking
- Email verification system (integration ready)

## Future Enhancements

- [ ] Real-time Google Maps integration with route selection
- [ ] Push notifications for ride updates
- [ ] In-app chat between drivers and passengers
- [ ] Rating and review system
- [ ] Advanced search filters (time, price range, route)
- [ ] Backend API integration
- [ ] Real payment gateway integration
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Social features (share rides on social media)

## Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Building for Production

#### Android
```bash
cd android
./gradlew assembleRelease
```
The APK will be available at: `android/app/build/outputs/apk/release/`

#### iOS
1. Open `ios/TechyRide.xcworkspace` in Xcode
2. Select your device or simulator
3. Product > Archive
4. Follow App Store submission process

## API Integration (Production Ready)

The app is structured to easily integrate with a backend API. Key integration points:

1. **Authentication**: `src/context/AuthContext.js`
   - Replace mock login/register with API calls
   - Implement token-based authentication

2. **Rides**: `src/screens/ride/`
   - Connect to rides API endpoints
   - Real-time ride updates

3. **Payments**: `src/context/PaymentContext.js`
   - Integrate payment gateway
   - UPI payment verification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@techyride.com or create an issue in the repository.

## Inspiration

This app is inspired by Quick Ride and other successful carpooling platforms, focusing on enterprise carpooling solutions.

## Acknowledgments

- React Native community
- Google Maps Platform
- All contributors and testers

---

**Note**: This is a proof-of-concept application. For production use, please implement proper backend services, security measures, and comply with local regulations for ride-sharing services.
