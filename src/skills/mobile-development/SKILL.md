---
name: mobile-development
description: React Native and Flutter patterns for cross-platform mobile apps. Use for mobile UI, navigation, and platform-specific code.
---

# 📱 Mobile Development Skill

## React Native

### Component Pattern
```jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function Card({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
```

### Navigation (React Navigation)
```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## Flutter

### Widget Pattern
```dart
class MyCard extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const MyCard({required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
            ),
          ],
        ),
        child: Text(
          title,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
```

### Navigation (go_router)
```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/details/:id',
      builder: (context, state) => DetailsScreen(id: state.params['id']!),
    ),
  ],
);
```

---

## Platform-Specific Code

### React Native
```jsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    ...Platform.select({
      ios: { shadowColor: 'black' },
      android: { elevation: 4 },
    }),
  },
});
```

### Flutter
```dart
if (Platform.isIOS) {
  // iOS specific code
} else if (Platform.isAndroid) {
  // Android specific code
}
```

---

## State Management

| Library | React Native | Flutter |
|---------|--------------|---------|
| Built-in | useState, Context | setState, InheritedWidget |
| Popular | Redux, Zustand | Riverpod, Bloc |
| Simple | Jotai, Recoil | Provider |

---

## Checklist

- [ ] Set up project (Expo/CLI/Flutter)
- [ ] Configure navigation
- [ ] Implement state management
- [ ] Handle platform differences
- [ ] Add splash screen/icon
- [ ] Test on both platforms
- [ ] Build & deploy (App Store/Play Store)
