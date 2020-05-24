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
import InputComponent from './components/InputComponent';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import base64 from 'react-native-base64';

import { SIGNUP_URL, LOGIN_URL } from './constants/constants';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

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

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isKeyboard: false,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            signupSuccess: 0,
            tmp: '',
            spinnerState: false,
            error: 'no error'
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

    _inputFirstName(param) {
        this.setState({firstName: param});
    }

    _inputLastName(param) {
        this.setState({lastName: param});
    }

    _inputEmail(param) {
        this.setState({email: param});
    }

    _inputPassword(param) {
        this.setState({password: param});
    }

    async _signup() {
        var body = {
            "first_name" : this.state.firstName,
            "last_name" : this.state.lastName,
            "email" : this.state.email,
            "password" : this.state.password
        }

        var body1 = {
            "customer": {
                "first_name": this.state.firstName,
                "last_name": this.state.lastName,
                "email": this.state.email,
                "phone": "",
                "verified_email": false,
                "addresses": [
                    {
                        "address1": "",
                        "city": "",
                        "province": "",
                        "phone": "",
                        "zip": "",
                        "last_name": "",
                        "first_name": "",
                        "country": ""
                    }
                ]
            }
        }

        var param = JSON.stringify(body1);

        this.setState({spinnerState: true});

        var headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
        headers.append('Content-Type', 'application/json');

        const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/customers.json", {method: 'POST', headers: headers, body: param});
        const json = await response.json();

        storage.save({
            key: 'customer', // Note: Do not use underscore("_") in key!
            data: {
                customer: json
            },
            expires: null
        });

        fetch(SIGNUP_URL, {
            method: "post",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(body),
        }).then(res => res.json()).then(resJson => {
            this.setState({error: JSON.stringify(resJson)});
            this.setState({spinnerState: false});
            if(resJson.success) {
                this.setState({"signupSuccess": 1});
            }else{
                this.setState({"signupSuccess": -1});
            }

            if(resJson.success) {
                this.props.navigation.navigate('Login');
            }else{
                console.log("Signup failed.")
            }
        }).catch(error => {
            this.setState({"error": error});
        });
    }

    render() {
        const isKeyboard = !this.state.isKeyboard;
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const email = this.state.email;
        const password = this.state.password;
        const signupSuccess = this.state.signupSuccess;

        return (
            <View style={styles.container}>
                <View style={isKeyboard ? styles.logoImageContainer : styles1.logoImageContainer}>
                <Spinner visible={this.state.spinnerState } />
                    <Image
                        resizeMode={"contain"}
                        style={isKeyboard ? styles.logoImage : styles1.logoImage}
                        source={isKeyboard ? require('../images/logo.png') : require('../images/homeLogo.png')}
                    /> 
                </View>
                {this._logoText()}
                <View style={isKeyboard ? styles.signupForm : styles1.signupForm}>
                    <Text style={{textAlign: 'center', color: '#f00'}}>{signupSuccess == 1 ? "Successfully Signup!" : signupSuccess == -1 ? "Signup Failed!" : ""}</Text>
                    <View style={styles.multiInput}>
                        <InputComponent width="100%" label="First Name" secure={false} place="ex: Danny" flexNum={1} mTop={isKeyboard ? "2%" : "0%"} inputFunc={(param) => this._inputFirstName(param)} initValue={firstName}></InputComponent>
                        <InputComponent width="100%" label="Last Name" secure={false} place="ex: Phantom" flexNum={1} mLeft="10%" mTop={isKeyboard ? "2%" : "0%"} inputFunc={(param) => this._inputLastName(param)} initValue={lastName}></InputComponent>
                    </View>
                    <InputComponent width="100%" label="Email" secure={false} place="ex: danny.phantom@jmail.com" mTop="2%" inputFunc={(param) => this._inputEmail(param)} initValue={email}> </InputComponent>
                    <InputComponent width="100%" label="Password" secure={true} place="" mTop="2%" inputFunc={(param) => this._inputPassword(param)} initValue={password}></InputComponent>
                    {/* <Text>{this.state.error}</Text> */}
                </View>
        
                <View style={isKeyboard ? styles.bottom : styles1.bottom}>
                    <TouchableOpacity style={styles.logoContainer} onPress={() => {this.props.navigation.navigate("Login")}}>
                        <Text style={isKeyboard ? styles.signUpText : styles1.signUpText}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
                <View style={isKeyboard ? styles.signIn : styles1.signIn}>
                    <TouchableOpacity style={styles.signInTouch} onPress={() => {
                        this._signup();
                    }}>
                        <View style={styles.signInBtn}>
                            <Text style={styles.signInText}>GET STARTED</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default SignUp;

const styles1 = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImageContainer: {
        flex: 3,
        alignItems: 'center',
        // backgroundColor: '#fafc00',
    },
        logoImage: {
            width: 150
        },
    signupForm: {
        flex: 6,
        // backgroundColor: '#FAFC00',
        paddingRight: '10%',
        paddingLeft: '10%',
    },
        multiInput: {
            flexDirection: 'row'
        },
    signIn: {
        position: 'absolute',
        // top: '51%',
        top: '51%',
        marginBottom: '34%',
        width: '100%',
        alignItems: 'center',
    },
    signInTouch: {
        paddingLeft: '4%',
        paddingRight: '4%'
    },
    signInBtn: {
        paddingLeft: '30%',
        paddingRight: '30%',
        backgroundColor: '#000000',
        borderRadius: 5,
        justifyContent: 'center',
        height: 45,
    },
    signInText: {
        color: '#FAFC00',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },  
    bottom: {
        flex: 8,     
    },
        signUpText: {
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: '15%'
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
        paddingTop: hp('5%')
    },
        logoImage: {
            width: 55, 
            height: 100,
            // marginTop: '12.5%'
            marginTop: hp('1.5%')
        },
    logoTextContainer: {
        flex: 6,
        alignItems: 'center',
        // backgroundColor: '#FAFC00'
    },
        logoText: {
            height: 65,
            // marginTop: '10%'
            // marginTop: hp('3%')
        },
    signupForm: {
        flex: 18,
        // backgroundColor: '#FAFC00',
        paddingRight: '10%',
        paddingLeft: '10%',
    },
        multiInput: {
            flexDirection: 'row'
        },
    signIn: {
        position: 'absolute',
        bottom: 0,
        // marginBottom: '34%',
        marginBottom: hp('16%'),
        width: '100%',
        alignItems: 'center',
    },
    signInTouch: {
        paddingLeft: '4%',
        paddingRight: '4%'
    },
    signInBtn: {
        paddingLeft: '30%',
        paddingRight: '30%',
        backgroundColor: '#000000',
        borderRadius: 5,
        justifyContent: 'center',
        height: 45,
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