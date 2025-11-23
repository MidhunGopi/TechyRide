# TechyRide - Quick Start Guide

Get TechyRide up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 16+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)
- ✅ React Native environment set up
- ✅ Android Studio or Xcode installed

## 5-Minute Setup

### Step 1: Clone and Install (2 min)
```bash
git clone https://github.com/MidhunGopi/TechyRide.git
cd TechyRide
npm install
```

### Step 2: Google Maps API Key (1 min)
Get your API key from: https://console.cloud.google.com/

**Android:**
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_API_KEY_HERE"/>
```

**iOS (optional):**
Edit `ios/TechyRide/AppDelegate.m` and add your key.

### Step 3: Run the App (2 min)

**For Android:**
```bash
npm run android
```

**For iOS (macOS only):**
```bash
cd ios
pod install
cd ..
npm run ios
```

## First Time Use

### 1. Register an Account
- Open the app
- Tap "Register"
- Enter your name
- Use your company email (e.g., user@company.com)
- Create a password (min 6 characters)
- Tap "Register"

### 2. Create Your First Ride (As Driver)
- Login to your account
- Tap "Create Ride" button on Home screen
- Fill in:
  - Starting Point: "Electronic City, Bangalore"
  - Destination: "Koramangala, Bangalore"
  - Distance: "12.5" km
  - Date: "2024-12-25"
  - Time: "09:00"
  - Available Seats: "3"
  - Fare per km: "5" ₹/km
- Tap "Create Ride"
- Your ride is now live!

### 3. Book a Ride (As Passenger)
- Create another account or ask a friend
- Browse available rides on Home screen
- Tap on a ride to view details
- Review the route, fare, and driver info
- Tap "Book Ride"
- Confirm the booking
- Points are deducted automatically!

### 4. Check Your Wallet
- Tap "Wallet" tab
- View your current points balance
- See transaction history
- Try redeeming points:
  - Tap "Redeem via UPI"
  - Enter amount (minimum ₹10)
  - Enter UPI ID (e.g., user@upi)
  - Confirm redemption

## App Features Overview

### Home Tab
- Browse all available rides
- See ride details (route, fare, seats)
- Create new rides (drivers)
- Refresh to see latest rides

### My Rides Tab
- View your rides as driver
- View your rides as passenger
- See completed and upcoming rides
- Check ride status

### Wallet Tab
- View points balance (1 point = ₹1)
- See all transactions
- Redeem points via UPI
- Track earnings and spending

### Profile Tab
- View account information
- See verification status
- Access settings
- Logout option

## Common Tasks

### How to Earn Points
1. Create rides as a driver
2. When passengers book your ride, you earn points
3. Points = Distance × Fare per km

### How to Spend Points
1. Book rides as a passenger
2. Points are automatically deducted
3. Check your wallet for transaction history

### How to Redeem Points
1. Go to Wallet tab
2. Tap "Redeem via UPI"
3. Enter amount (min ₹10)
4. Enter your UPI ID
5. Confirm transaction
6. Money transferred instantly!

## Testing the App

### Test Scenario 1: Complete Ride Flow
1. **Account A (Driver)**:
   - Register as driver@company.com
   - Create a ride from A to B
   - Set fare ₹5/km, distance 10km
   - Wait for booking

2. **Account B (Passenger)**:
   - Register as passenger@company.com
   - Find the ride on Home screen
   - Book the ride
   - Pay ₹50 in points

3. **Verify**:
   - Driver account should have +50 points
   - Passenger account should have -50 points
   - Both see the ride in "My Rides"

### Test Scenario 2: UPI Redemption
1. Create a ride and earn some points
2. Go to Wallet tab
3. Tap "Redeem via UPI"
4. Enter amount: 100
5. Enter UPI: test@upi
6. Confirm
7. Check transaction history

## Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
watchman watch-del-all
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Android build fails?
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS build fails?
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Metro bundler port in use?
```bash
# Kill process on port 8081
npx react-native start --port=8082
```

### Maps not showing?
- Verify API key is correct
- Check API key has Maps SDK enabled
- Restart the app after adding key

## Next Steps

### For Development
1. Read `SETUP.md` for detailed setup
2. Review `FEATURES.md` for all features
3. Check `API_INTEGRATION.md` for backend setup

### For Production
1. Set up backend API
2. Configure real payment gateway
3. Set up push notifications
4. Add analytics
5. Deploy to app stores

## Getting Help

### Documentation
- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `FEATURES.md` - Feature documentation
- `API_INTEGRATION.md` - Backend guide
- `PROJECT_SUMMARY.md` - Complete summary

### Resources
- React Native Docs: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- Google Maps: https://developers.google.com/maps

### Support
- GitHub Issues: Create an issue for bugs
- Email: support@techyride.com
- Documentation: Read the guides above

## Tips for Success

### For Drivers
- Set competitive fares
- Provide accurate route information
- Be punctual
- Maintain good ratings

### For Passengers
- Book rides in advance
- Be ready on time
- Respect the driver
- Keep points balance topped up

### For Administrators
- Monitor ride activity
- Check transaction logs
- Review user feedback
- Update app regularly

## What's Next?

After getting familiar with the app:
1. Invite team members to join
2. Create regular commute rides
3. Build a carpooling community
4. Save money and reduce carbon footprint!

---

**Ready to start?** Run `npm run android` or `npm run ios` now!

**Need help?** Check the documentation files or create an issue.

**Happy Carpooling! 🚗💨**
