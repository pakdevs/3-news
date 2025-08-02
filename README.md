# NewsApp - React Native News Application

A comprehensive mobile news application built with React Native and Expo, featuring a modern UI, offline reading, personalization, and all the features you'd expect from a world-class news app like The New York Times or Wall Street Journal.

## 🚀 Features

### 📰 Core News Features

- **Home Feed** with top stories and breaking news
- **Category Browsing** (Technology, Business, Sports, Politics, Health, Science, Entertainment)
- **Advanced Search** with filters and trending topics
- **Article Detail View** with clean, readable formatting
- **Breaking News Alerts** with visual indicators

### 🔖 Personalization & Accounts

- **Bookmark Articles** for later reading
- **Read Later** functionality
- **Follow Topics** and authors for personalized content
- **User Profiles** with reading statistics
- **Sign Up/Login** with email or social authentication
- **Reading History** tracking

### 🎨 User Experience

- **Dark/Light Mode** toggle with system preference support
- **Responsive Design** optimized for all screen sizes
- **Pull-to-Refresh** for latest content
- **Smooth Animations** and transitions
- **Intuitive Navigation** with drawer menu and bottom tabs

### 📱 Advanced Features

- **Offline Reading** support with article caching
- **Push Notifications** for breaking news and personalized alerts
- **Social Sharing** to various platforms
- **Font Size Adjustment** for better readability
- **Search History** and trending topics
- **Reading Time Estimates**
- **Article Engagement** (likes, shares, comments)

### 🛠️ Technical Features

- **React Navigation** for seamless navigation
- **Context API** for state management
- **AsyncStorage** for local data persistence
- **Expo Notifications** for push notifications
- **Gesture Handler** for smooth interactions
- **Vector Icons** for consistent iconography

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **Expo CLI** installed globally
- **Expo Go** app on your mobile device (for testing)

## 🔧 Installation

1. **Clone or extract the project**

   ```bash
   cd 3-news
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on your device**
   - Install **Expo Go** app on your phone
   - Scan the QR code from the terminal/browser
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📱 How to Use

### Navigation

- **Bottom Tabs**: Home, Sections, Bookmarks, Profile
- **Drawer Menu**: Access categories, settings, and more
- **Search**: Tap the search icon in the header

### Reading Articles

- **Tap any article** to read the full content
- **Bookmark**: Tap the bookmark icon to save articles
- **Share**: Use the share button to share on social media
- **Font Size**: Adjust text size in article view
- **Read Later**: Save articles for later reading

### Personalization

- **Follow Topics**: Go to Sections → Follow/unfollow categories
- **Follow Authors**: Tap "Follow" on any author in article view
- **Dark Mode**: Toggle in Settings or drawer menu
- **Notifications**: Customize in Settings

### Offline Reading

- Articles are automatically cached when viewed
- Use "Save Offline" in article detail for manual saving
- Access offline articles even without internet

## 🎯 Key Screens

1. **Home Screen**: Latest news with category filters and breaking news
2. **Sections Screen**: Browse by categories with follow options
3. **Bookmarks Screen**: Saved articles and read later list
4. **Profile Screen**: User info, statistics, and account management
5. **Article Detail**: Full article with engagement and sharing options
6. **Search Screen**: Advanced search with filters and history
7. **Settings Screen**: Comprehensive app configuration
8. **Login Screen**: User authentication with social options

## 🔄 State Management

The app uses React Context API for state management:

- **ThemeContext**: Manages dark/light mode
- **AppContext**: Handles bookmarks, user data, and preferences

## 📊 Data Structure

### News Articles

```javascript
{
  id: string,
  title: string,
  summary: string,
  content: string,
  author: string,
  publishDate: string,
  category: string,
  imageUrl: string,
  readTime: string,
  tags: array,
  isBreaking: boolean,
  likes: number,
  shares: number
}
```

### User Data

```javascript
{
  id: string,
  name: string,
  email: string,
  avatar: string,
  preferences: object
}
```

## 🎨 Themes

The app supports both light and dark themes with:

- Automatic system preference detection
- Manual toggle option
- Consistent color schemes across all components

### Light Theme Colors

- Primary: #2563eb
- Background: #ffffff
- Text: #1e293b
- Secondary: #64748b

### Dark Theme Colors

- Primary: #3b82f6
- Background: #0f172a
- Text: #f1f5f9
- Secondary: #94a3b8

## 📚 Dummy Data

The app includes comprehensive dummy data:

- **8 News Categories** with sample articles
- **Multiple Authors** with profiles
- **Breaking News** samples
- **Trending Topics** for search
- **User Engagement** data (likes, shares)

## 🔧 Customization

### Adding New Categories

1. Update `src/data/newsData.js`
2. Add category to the `categories` array
3. Update icons in components as needed

### Modifying Themes

1. Edit `src/context/ThemeContext.js`
2. Update `lightTheme` and `darkTheme` objects
3. Colors will automatically apply across the app

### Adding New Features

1. Create components in `src/components/`
2. Add screens to `src/screens/`
3. Update navigation in `src/navigation/AppNavigator.js`

## 🚀 Deployment

### Building for Production

1. **Configure app.json**

   ```bash
   expo build:android
   expo build:ios
   ```

2. **Generate APK/IPA**
   Follow Expo's build documentation

### Publishing Updates

```bash
expo publish
```

## 🔮 Future Enhancements

- **Audio Articles**: Text-to-speech functionality
- **Video Content**: Embedded video player
- **Live News**: Real-time updates
- **Comments System**: User discussions
- **Location-based News**: Local news integration
- **AI Recommendations**: Machine learning suggestions
- **Multiple Languages**: Internationalization
- **Podcast Integration**: Audio news content

## 🐛 Known Issues

- Push notifications require physical device testing
- Some animations may be slower on older devices
- Offline images require additional caching logic

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:

- Email: support@newsapp.com
- GitHub Issues: Create an issue in the repository

---

**Built with ❤️ using React Native and Expo**

_Stay informed, stay connected_ 📰
