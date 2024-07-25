// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { Button, View, Text } from 'react-native';
import { Button, View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Keyboard, StyleSheet } from 'react-native';
import { BASE_URL } from './config';

const Stack = createStackNavigator();


function SignupScreen({ navigation }) {
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateForm = () => {
    if (!fname || !fname || !mobile || !email || !password) {
      Alert.alert('Error', 'Fill All fields are required');
      return false;
    }

    return true;
  };

  const handleInputChange = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case 'fname':
        if (!value) newErrors[field] = 'This field is required';
        else delete newErrors[field];
        setFirstName(value);
        break;
      case 'lname':
        if (!value) newErrors[field] = 'This field is required';
        else delete newErrors[field];
        setLastName(value);
        break;
      case 'mobile':
        if (!/^\d{10}$/.test(value)) newErrors.mobile = 'Invalid mobile number';
        else delete newErrors.mobile;
        setMobile(value);
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email address';
        else delete newErrors.email;
        setEmail(value);
        break;
      case 'password':
        if (value.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        else delete newErrors.password;
        setPassword(value);
        break;
    }

    setErrors(newErrors);
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname,
          lname,
          mobile,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!data.error) {
        Alert.alert('Success', data.message || 'You have successfully signed up!');
        // Clear input fields
        setFname('');
        setLname('');
        setMobile('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Error', data.message || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.container}>
          <Image
            source={{ uri: 'https://www.bootdey.com/image/280x280/20B2AA/20B2AA' }}
            style={styles.background}
          />
          {/* <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar7.png' }}
              style={styles.logo}
            />
          </View> */}
          <View style={[styles.formContainer, keyboardVisible && styles.formContainerWithKeyboard]}>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={fname}
                  onChangeText={(value) => handleInputChange('fname', value)}
                  placeholder="First Name"
                  placeholderTextColor="#999"
                />
                {errors.fname && <Text style={styles.errorText}>{errors.fname}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lname}
                  onChangeText={(value) => handleInputChange('lname', value)}
                  placeholder="Last Name"
                  placeholderTextColor="#999"
                />
                {errors.lname && <Text style={styles.errorText}>{errors.lname}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile</Text>
                <TextInput
                  style={styles.input}
                  value={mobile}
                  onChangeText={(value) => handleInputChange('mobile', value)}
                  keyboardType="numeric"
                  placeholder="Mobile"
                  placeholderTextColor="#999"
                />
                {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Email"
                  placeholderTextColor="#999"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LoginScreen() {
  return (
    <View style={stylesl.container}>
      <Image
        source={{ uri: 'https://www.bootdey.com/image/280x280/20B2AA/20B2AA' }}
        style={stylesl.background}
      />
      <View style={stylesl.logoContainer}>
        <Image
          source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar7.png' }}
          style={stylesl.logo}
        />
      </View>
      <View style={stylesl.formContainer}>
        <View style={stylesl.card}>
          <View style={stylesl.inputContainer}>
            <Text style={stylesl.label}>Email</Text>
            <TextInput
              style={stylesl.input}
              placeholder="Email"
              placeholderTextColor="#999"
            />
          </View>
          <View style={stylesl.inputContainer}>
            <Text style={stylesl.label}>Password</Text>
            <TextInput
              style={stylesl.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={stylesl.button}>
            <Text style={stylesl.buttonText}>Login</Text>
          </TouchableOpacity>
          <Button
            title="Login"
            onPress={() => navigation.navigate('signup')}
          />
        </View>
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Default padding
  },
  formContainerWithKeyboard: {
    paddingBottom: 40, // Increased padding when keyboard is visible
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  createAccountButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#20B2AA',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const stylesl = {
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },

  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    paddingLeft: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#00BFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  createAccountButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#20B2AA',
    fontSize: 12,
    fontWeight: 'bold',
  },
};

export default App;
