import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import ItemComponent from './components/ItemComponent';
import { StackView } from 'react-navigation-stack';
import SmallItemComponent from './components/SmallItemComponent';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { PROFILE_IMAGE_UPLOAD_URL, LOGIN_URL, PUBLIC_FOLDER, DELETE_PROFILE_IMAGE } from './constants/constants';
import base64 from 'react-native-base64';
import Spinner from 'react-native-loading-spinner-overlay';

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

// You can then use your `FadeInView` in place of a `View` in your components:
class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebar: false,
      firstName: '',
      lastName: '',
      image: '',
      photo: {
        uri: ''
      },
      error: 'no error',
      orders: [],
      imageArr: [],
      spinnerState: false
    }
  }

  _animationView() {
    return (
      <SimpleAnimation delay={0} duration={1000} direction="right" style={{flex: 4}}>
        <SidebarComponent navigation={this.props.navigation}  pageName="Profile" hideAgain={() => this._hideSidebar()}></SidebarComponent>
      </SimpleAnimation>
    );
  }

  _showSidebar() {
    this.setState(prev => ({
      isSidebar: true
    }));
  }

  _hideSidebar() {
    this.setState(prev => ({
      isSidebar: false
    }));
  }

  async componentDidMount() {
    this.setState({spinnerState: true});
    storage.load({
        key: 'loginState',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
        extraFetchOptions: {},
        someFlag: true
        }
    })
    .then(ret => {
      // this.setState({error: JSON.stringify(ret)});
        this.setState({storageTmp: ret});
        this.setState({"firstName": ret.first_name});
        this.setState({"lastName": ret.last_name});
        this.setState({"image": ret.image});
        this.setState({photo: {uri: PUBLIC_FOLDER + ret.image}});   
    });

    storage.load({
      key: 'customer',
      autoSync: true,
      syncInBackground: true,
      syncParams: {
      extraFetchOptions: {
          
      },
      someFlag: true
      }
    })
    .then(async ret => {
      var customerTmp = ret.customer.customer;
      var _id = customerTmp.id;
      var headers = new Headers();
      headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
      headers.append('Content-Type', 'application/json');
  
      const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/customers/"+ _id +"/orders.json", {method: 'GET', headers: headers});
      // const response = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/customers/3016408432745/orders.json", {method: 'GET', headers: headers});
      const json = await response.json();
      var orders = json.orders;
      this.setState({orders: orders});
    });
    // get product images
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + base64.encode('8c1ecb52c850c9e05c2eeca3c2bffdba' + ':' + '793cb4efe34466cca7cf9e15bfbf3c6a'));
    const response1 = await fetch("https://shop-lyrical-lemonade.myshopify.com/admin/api/2020-01/products.json", {method: 'GET', headers: headers});
    const json1 = await response1.json();
    var products = json1.products;
    var imageArr = [];
    products.map(product => {
      // this is for getting image
      const imageObj = product.image;
      if(imageObj == null) {
        var imageUrl = "no";
      }else{
        var imageTmp = new Object(imageObj);
        var imageOrigin = imageTmp.src;
        var tmp = imageOrigin.split('.png');
        var imageUrl = tmp[0] + '_medium.png' + tmp[1];
      }
      imageArr.push({
        id: product.id,
        imageUrl: imageUrl
      });
    });
    this.setState({imageArr: imageArr});
    this.setState({spinnerState: false});
  }

  render(){
    const isSidebar = this.state.isSidebar;
    const img = this.props.navigation.getParam('profileImg') || "";
    const firstN = this.props.navigation.getParam('firstName') || "";
    const lastN = this.props.navigation.getParam('lastName') || "";
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const image = this.state.image;
    const photo = this.state.photo;
    const error = this.state.error;
    const imageArr = this.state.imageArr;
    const orders = this.state.orders;
    const orderLen = orders.length;
    var pastProducts = [];
    orders.map(order => {
      pastProducts = pastProducts.concat(order.line_items);
    });
    const orderList = pastProducts.map(product => {
      var productImg = "no";
      imageArr.map(img => {
        if(product.product_id == img.id) {
          productImg = img.imageUrl;
        }
      });
      return <View style={styles.smallItemContainer} key={product.product_id}>
              <View style={styles.smallItemSubContainer}>
                <Image style={styles.smallItem} resizeMode="contain" source={{'uri':""+productImg+""}} />
                <View style={styles.titleGroup}>
                    <Text style={styles.sitemTitle}>{product.title}</Text>
                    <Text style={styles.sitemSubTitle}>${product.price}</Text>
                </View>
              </View>
            </View>
    });
    
    const additionalStyle = isSidebar ? StyleSheet.create({
      sidebarStyle: {
        // opacity: 0.3
      }
    }) : StyleSheet.create({
      sidebarStyle: {
        opacity: 1
      }
    });

    return (
      <View style={styles.container}>
        <Spinner
            visible={this.state.spinnerState}
        />
        {isSidebar ? this._animationView() : null}
        {/* <TouchableWithoutFeedback onPress={() => this._hideSidebar()}> */}
          <View style={[styles.contentContainer, additionalStyle.sidebarStyle]}>
          <View style={styles.content}>
            <View style={styles.headerContainer}>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => {this._showSidebar()}}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/navIcon.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                <Text style={styles.homeLogoText}>{firstN == "" ? firstName : firstN} {lastN == "" ? lastName : lastN}</Text>
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Edit")}>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/pencil.png')} />
                </TouchableOpacity>
              </View>

            </View>

            <View style={styles.bodyContainer}>

                <View style={styles.profileContainer}>
                  {
                    img == "" ? <Image style={{borderRadius: 100, width: 160, height: 160, borderWidth: 3, marginTop: '3%'}} resizeMode="" source={{ uri: photo.uri }} /> : <Image style={{borderRadius: 100, width: 160, height: 160, borderWidth: 3, marginTop: '3%'}} resizeMode="" source={{ uri: img }} />
                  }
                    <Image style={{position: 'absolute', width: 70, height: 50, top: '65%', left: '55.5%'}} resizeMode="contain" source={require("../images/logo.png")} />
                </View>

                <ScrollView style={styles.productList}>
                  {
                    orderLen != 0 ? orderList : <Text style={{fontSize: 20, width: '100%', textAlign: 'center', marginTop: '5%'}}>No Past Products</Text>
                  }
                </ScrollView>
                {/* <View style={styles.btnGroup}>
                  <TouchableOpacity style={styles.favoriteTouch}>
                    <View style={styles.favoritesBtn}>
                        <Text style={styles.favoritesText}>FAVORITES</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.orderTouch}>
                      <View style={styles.orderBtn}>
                          <Text style={styles.orderText}>PAST ORDERS</Text>
                      </View>
                  </TouchableOpacity>
                </View> */}
            </View>
          </View>
          <ImageOverlay containerStyle={isSidebar ? {position: 'absolute', height: '100%', opacity: 0.7} : {position: 'absolute', height: '0%', opacity: 0.7}} resizeMode="contain" source={require("../images/blur.png")} />
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  contentContainer: {
    flex: 21,
    backgroundColor: "#fff",
    flexDirection: "row"
  },
    content: {
      position: 'absolute',
      height: '100%',
      width: '100%'
    },
      headerContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
        backgroundColor: '#FAFC00'
      },
      searchContainer: {
        // marginBottom: '5%'
      },
      sidebarMenu: {
        flex: 1,
        // marginTop: '20%'
        marginTop: hp('8%')
      },
        sidebarMenuImage: {
          width: 20,
          height: 15
        },
        homeLogoText: {
          fontWeight: 'bold',
          fontSize: wp('4%')
        },
        tvIconImage: {
          width: 17,
          height: 17
        },
      homeLogo: {
        flex: 4,
        alignItems: 'center',
        marginTop: hp('8%'),
      },
      tvIcon: {
        flex: 1,
        alignItems: 'flex-end',
        // marginTop: '18%'
        marginTop: hp('8%')
      },

      bodyContainer: {
        flex: 7,
        flexDirection: 'column'
        // backgroundColor: "green"
      },
        profileContainer: {
            backgroundColor: '#FAFC00',
            alignItems: 'center',
            paddingTop: '3%',
            // paddingBottom: '13%'
            // paddingBottom: hp('8%')
            height: hp('23%')
        },
        userImage: {
          width: '100%', 
          height: '100%',
          borderRadius: 220,
          backgroundColor: '#f00'
        },
        btnGroup: {
            position: 'absolute',
            flexDirection: 'row',
            width: '100%',
            top: hp('22.8%'),
            justifyContent: 'space-between',
            paddingLeft: '3%',
            paddingRight: '3%',
        },
            favoriteTouch: {
              flex: 1,
            },
            favoritesBtn: {
                borderWidth: 2,
                borderRadius: 5,
                backgroundColor: '#000',
                paddingLeft: wp('10%'),
                paddingRight: wp('10%'),

                // marginRight: wp('4%'),
            },
            favoritesText: {
                color: '#fafc00',
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: '9%',
                marginBottom: '9%'
            },
            orderTouch: {
              flex: 1
            },
            orderBtn: {
                borderWidth: 2,
                borderRadius: 5,
                backgroundColor: '#fff',
                paddingLeft: '7%',
                paddingRight: '7%',
                marginLeft: '2.5%',
                justifyContent: 'center',
                alignItems:'center'
            },
            orderText: {
                color: '#000',
                fontWeight: 'bold',
                fontSize: 16,
                marginTop: '5.5%',
                marginBottom: '5.5%',
            },
        productList: {
            backgroundColor: '#fff',
            // paddingLeft: '3%',
            // paddingRight: '3%',
            // paddingTop: '5%'
        },

        // this is for small item style
        smallItemContainer: {
          paddingLeft: '3%'
        },
        smallItemSubContainer: {
          borderBottomColor: '#ccc',
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          paddingTop: '5%',
          paddingBottom: '5%',
          marginLeft: '3%',
          marginRight: '3%',
        },
        smallItem: {
            width: 100,
            height: 100,
            borderRadius: 5,
        },
        titleGroup: {
            marginLeft: '3%',
            width: '85%'
        },
        sitemTitle: {
            fontSize: 18,
            marginTop: '6%',
            width: '85%',
        },
        sitemSubTitle: {
          fontSize: 18,
            color: '#a5a5a5',
            marginTop: '3%',
            width: '85%'
        },
        sItemPlayImage: {
            position: 'absolute',
            top: '38%',
            left: 0,
            height: '45%'
        },
        sItemPlayImage2: {
            position: 'absolute',
            top: '35%',
            left: 0,
            height: '40%'
        },
        heartIcon: {
            position: 'absolute',
            width: '3%',
            marginLeft: '3%'
        }
});


const images = {
    carouselImage1: require('../images/carousel1.png'),
    carouselImage2: require('../images/carousel2.png'),
    playIcon1: require('../images/playIcon1.png'),
    productImage1: require('../images/productImage1.png'),
    smallItemImage: require('../images/smallItemImage1.png'),
    sItemPlayImage: require('../images/playIcon2.png'),
};