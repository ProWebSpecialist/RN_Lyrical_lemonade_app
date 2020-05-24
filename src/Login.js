import React from 'react';
import {
    Platform,
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    Button,
    Keyboard
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

import { LOGIN_URL } from './constants/constants';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { initialMode } from 'react-native-dark-mode';
 
const storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,
 
  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage
 
  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,
 
  // cache data in the memory. default is true.
  enableCache: true,
 
  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  }
});
  

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboard: false,
            email: '',
            password: '',
            invalidEmail: false,
            emptyInput: false,
            loginSuccess: 0,
            error: 'no error',
            parmas: '',
            spinnerState: false
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide.bind(this),
        );
    }

    componentWillMount() {
        
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.setState(prevS => ({
            isKeyboard: true
        }));
    }

    _keyboardDidHide() {
        this.setState(prevS => ({
            isKeyboard: false
        }));
    }

    _logoText() {
        if(!this.state.isKeyboard) {
            return (
                <View style={styles.logoTextContainer}>
                    <Image
                        resizeMode={"contain"}
                        style={styles.logoText}
                        source={require('../images/logoText.png')}
                    /> 
                </View>
            );
        }else{
            return null;
        }
    }

    _login() {
        this.setState({spinnerState: true});
        var body = {
            "email" : this.state.email,
            "password" : this.state.password
        }
        
        fetch(LOGIN_URL, {
            method: "post",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then(resJson => {
            if(resJson.success) {
                this.setState({spinnerState: false});
                this.setState({"loginSuccess": 1});
            }else{
                this.setState({spinnerState: false});
                this.setState({"loginSuccess": -1});
            }

            if(resJson.success) {
                storage.save({
                    key: 'loginState', // Note: Do not use underscore("_") in key!
                    data: {
                        loginSuccess: true,
                        id: resJson.detail.id,
                        email: resJson.detail.email,
                        password: this.state.password,
                        token: resJson.token,
                        first_name: resJson.detail.first_name,
                        last_name: resJson.detail.last_name,
                        image: resJson.detail.image
                    },
                   
                    // if expires not specified, the defaultExpires will be applied instead.
                    // if set to null, then it will never expire.
                    expires: null
                });
                
                this.props.navigation.navigate('Home');
            }else{
                console.log("login failed.")
            }
        }).catch(error => {
            this.setState({"error": error});
        });
    }

    _validEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    render() {
        const isKeyboard = !this.state.isKeyboard;
        const emailInput = this.state.email;
        const pwdInput = this.state.password;
        const invalidEmail = this.state.invalidEmail;
        const emptyInput = this.state.emailInput;
        const error = this.state.error;
        const loginSuccess = this.state.loginSuccess;

        return (
            <View style={isKeyboard ? styles.container : styles1.container}>
                <View style={isKeyboard ? styles.logoImageContainer : styles1.logoImageContainer}>
                    <Image
                        resizeMode={"contain"}
                        style={styles.logoImage}
                        source={require('../images/logo.png')}
                    /> 
                </View>
                {this._logoText()}
                <Spinner
                    visible={this.state.spinnerState}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={isKeyboard ? styles.loginForm : styles1.loginForm}>
                    <Text style={{color: '#f00', marginLeft: '10%', marginRight: '10%', marginBottom: '5%', textAlign: 'center'}}>{invalidEmail ? 'You must fill input or Email is invalid format.' : emptyInput ? 'You must fill inputs.' : null}</Text>

                    {/* <Text style={{textAlign: 'center', color: '#f00'}}>{loginSuccess == 1 ? "Successfully Signin!" : loginSuccess == -1 ? "Signin Failed!" : ""}</Text> */}

                    <View style={isKeyboard ? styles.loginInput1 : styles1.loginInput1}>
                        <View style={styles.leftIcon}>
                            <Image
                                resizeMode={"contain"}
                                style={styles.leftIconImage}
                                source={require('../images/email_prefix.png')}
                            />
                        </View>
                        <TextInput style={styles.loginInputForm1} placeholder="" placeholderTextColor="#000000" onChangeText={ text => {
                            this.setState({"email" : text});
                        }} value={emailInput} />
                    </View>
                    <View style={styles.loginInput2}>
                        <View style={styles.leftIcon}>
                            <Image
                                resizeMode={"contain"}
                                style={styles.leftIconImage}
                                source={require('../images/lock.png')}
                            />
                        </View>
                        <TextInput style={styles.loginInputForm2} secureTextEntry={true} onChangeText={ text => {
                            this.setState({"password" : text});
                        }} value={pwdInput}/>
                    </View>
                    
                    <View style={styles.forgotPassword}>
                        <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("SignUp")}}>
                            <Text >Forgot Password</Text>
                    {/* <Text>{this.state.error}</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={isKeyboard ? styles.bottom : styles1.bottom}>
                    <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("SignUp")}}>
                        <Text style={isKeyboard ? styles.signUpText : styles1.signUpText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
                <View style={isKeyboard ? styles.signIn : styles1.signIn}>
                    {/* <View style={styles.signInBtn}>
                        <Text style={styles.signInText}>SIGN IN</Text>
                    </View> */}
                    <TouchableOpacity style={styles.signInBtn} onPress={() => {
                        if(!this._validEmail(emailInput)) {
                            this.setState({"invalidEmail" : true});
                            return ;
                        }else{
                            this.setState({"invalidEmail" : false});
                        }

                        if(emailInput == '' || pwdInput == '') {
                            this.setState({"emptyInput" : true});
                            return ;
                        }
                        this._login();
                    }}>
                        <Text style={styles.signInText}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Login;

const styles1 = StyleSheet.create({
    container: {
        flex: 1
    },
    spinnerTextStyle: {
        color: '#fff'
    },
    logoImageContainer: {
        flex: 4,
        alignItems: 'center',
        // backgroundColor: '#FAFC00',
        paddingTop: '15%'
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: '25%'
        },
    loginForm: {
        flex: 5,
        // backgroundColor: '#FAFC00'
    },
        leftIcon: {
            flex: 1,
            backgroundColor: '#000000',
            height: 42,
            width:42,
            justifyContent: 'center'
        },
        leftIconImage: {
            height: 20
        },  
        loginInput1: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            // height: 45,
            // marginTop: '5%',
            marginRight: '10%',
            marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInput2: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            // marginTop: '5%',
            marginRight: '10%',
            marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInputForm1: {
            flex: 6,
            justifyContent: 'center',
            color: '#000'
        },
        loginInputForm2: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        forgotPassword: {
            flexDirection:'row-reverse',
            marginLeft: '10%',
            marginTop: '5%'
        },
    signIn: {
        position: 'absolute',
        top: '53%',
        marginBottom: '40%',
        width: '100%',
        alignItems: 'center'
    },
    signInBtn: {
        backgroundColor: '#000000',
        width: '80%',
        height: '40%',
        borderRadius: 5,
        justifyContent: 'center'
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },  
    bottom: {
        flex: 8,
        // justifyContent: 'center'
        
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: '13%'
        }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImageContainer: {
        flex: 8,
        alignItems: 'center',
        // backgroundColor: '#FAFC00',
        // paddingTop: '20%'
        paddingTop: hp('10%')
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: hp('1%')
            // marginTop: '12.5%'
        },
    logoTextContainer: {
        flex: 6,
        alignItems: 'center',
        // backgroundColor: '#FAFC00'
    },
        logoText: {
            height: 65,
            // marginTop: '10%'
            marginTop: hp('2%')
        },
    loginForm: {
        flex: 18,
        // backgroundColor: '#FAFC00'
    },
        leftIcon: {
            flex: 1,
            backgroundColor: '#000000',
            height: 42,
            width:42,
            justifyContent: 'center'
        },
        leftIconImage: {
            height: 20
        },  
        loginInput1: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            marginTop: hp('10%'),
            marginRight: wp('10%'),
            marginLeft: wp('10%'),
            // marginTop: '25%',
            // marginRight: '10%',
            // marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInput2: {
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: 1.5,
            borderRadius: 5,
            height: 45,
            marginTop: hp('3%'),
            marginRight: wp('10%'),
            marginLeft: wp('10%'),
            // marginTop: '5%',
            // marginRight: '10%',
            // marginLeft: '10%',
            flexDirection: 'row'
        },
        loginInputForm1: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        loginInputForm2: {
            flex: 6,
            justifyContent: 'center',
            marginLeft: 20,
            color: '#000'
        },
        forgotPassword: {
            flexDirection:'row-reverse',
            marginLeft: '10%',
            // marginTop: '5%'
            marginTop: hp('2%')
        },
    signIn: {
        position: 'absolute',
        bottom: 0,
        // marginBottom: '40%',
        marginBottom: hp('15%'),
        width: '100%',
        alignItems: 'center'
    },
    signInBtn: {
        backgroundColor: '#000000',
        // width: '80%',
        // height: '40%',
        width: wp('80%'),
        height: hp('6%'),
        borderRadius: 5,
        justifyContent: 'center'
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },  
    bottom: {
        flex: 8,
        justifyContent: 'center'        
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold'
        }
});