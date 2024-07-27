import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Keyboard, StyleSheet } from 'react-native';
import { BASE_URL } from '../../config';
import styles from './_styles'; 

export default function Signup({ navigation }) {
    const [fname, setFirstName] = useState('');
    const [lname, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // const navigation = useNavigation();

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
                setFirstName('');
                setLastName('');
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
                        <Text style={styles.title}>Sign Up</Text>
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
                            <Text style={styles.linkText}>
                                Already have an account?{' '}
                                <Text onPress={() => navigation.navigate('Login')}>Login</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
