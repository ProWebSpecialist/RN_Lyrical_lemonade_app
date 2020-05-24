import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { SimpleAnimation } from 'react-native-simple-animations';
import SidebarComponent from './components/SidebarComponent';
import CarouselComponent from './components/CarouselComponent';
import { StackView } from 'react-navigation-stack';
import ImageOverlay from 'react-native-image-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemComponent from './components/ItemComponent';
import YouTube from 'react-native-youtube';
import Video from 'react-native-video';

// You can then use your `FadeInView` in place of a `View` in your components:
class VideoPlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      status: null,
      quality: null,
      error: null,
      isPlaying: true,
      isLooping: true,
      duration: 0,
      currentTime: 0,
      fullscreen: false,
      containerMounted: false,
      containerWidth: null,
    }
  }

  render(){
    const title = this.props.navigation.getParam('title');
    const videoId = this.props.navigation.getParam('videoId');
    const playlistId = this.props.navigation.getParam('playlistId');
    const releasedAt = this.props.navigation.getParam('releasedAt');
    const description = this.props.navigation.getParam('description');

    var titleArr = title.split('(');
    if(titleArr.length > 1) {
      var videoTitle = titleArr[0];
      var tmpArr1 = titleArr[1];
      var tmpArr2 = tmpArr1.split('@_');
      if(tmpArr2.length > 1) {
        var tmpArr3 = tmpArr2[1].split('_');
        var author = tmpArr3[0];
      }
    }else{
      var videoTitle = title;
    }

    const link = this.props.navigation.getParam('link');

    return (
      <View style={styles.container}>
       
        <Spinner
            visible={this.state.spinnerState}
        />
        <View style={[styles.contentContainer]}>
          <View style={styles.content}>
            <View style={styles.bodyContainer}>
            <ScrollView>
                <View style={{height:35, backgroundColor: '#000'}}></View>
                <View style={styles.playContainer}> 
                    <YouTube
                      ref={component => {
                        this._youTubeRef = component;
                      }}
                      apiKey = "AIzaSyDatqaJO9Q6EdeJXPJ7whIE1Kbya3AeFN8"
                      // playlistId={playlistId}
                      videoId={videoId}
                      showinfo={true}
                      onError={e => this.setState({'error':e.error})}
                      style={{ alignSelf: 'stretch', height: 300 }}
                    />
                    <View style={styles.group1}>   
                    </View>
                </View>

                <View style={styles.videoTitleGroup}>
                    <View style={styles.videoTitle}>
                        <Text style={styles.title1}>{videoTitle}</Text>
                        <Text style={styles.title2}>KEY!</Text>
                        
                    </View>
                    <View style={styles.videoShare}>
                        <Image style={styles.share} resizeMode="contain" source={require('../images/share.png')} /> 
                    </View>
                </View>

                <View style={styles.content1}>
                    <TouchableOpacity onPress={() => Linking.openURL("https://www.youtube.com/watch?v="+{videoId}+"")}>
                    {/* <TouchableOpacity onPress={() => Linking.openURL("https://www.youtube.com/watch?v=MX4JDNoVFn0&list=PLfvpqdsXvlf4vqsRWglvSPplpKkEsBI7E&index=2&t=0s")}> */}
                      <Image style={styles.youtube} resizeMode="contain" source={require("../images/youtube.png")} />
                    </TouchableOpacity>
                    <Text style={styles.youtubeTitle}>
                        Released on {releasedAt}
                    </Text>
                    
                    <Text style={styles.youtubeDesc}>
                    {description}
                    </Text>
                </View>
            </ScrollView>
            </View>

            <View style={styles.headerContainer}>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                  <Image resizeMode="contain" style={styles.sidebarMenuImage} source={require('../images/arrow.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.homeLogo}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.homeLogoImage} source={require('../images/homeLogo.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.tvIcon}>
                <TouchableOpacity>
                  <Image resizeMode="contain" style={styles.tvIconImage} source={require('../images/tvIcon.png')} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default VideoPlay;

const { width: viewportWidth } = Dimensions.get('window');

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
      // position: 'absolute',
      height: '100%',
      width: '100%'
    },
      headerContainer: {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '3%',
        borderBottomColor: '#E2E2E2',
        borderBottomWidth: 0.5,
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
          homeLogoImage: {
            width: 110,
            height: 35
          },
          tvIconImage: {
            width: 17,
            height: 17
          },
        homeLogo: {
          flex: 1,
          alignItems: 'center',
          // marginTop: '17%'
          marginTop: hp('6%')
        },
        tvIcon: {
          flex: 1,
          alignItems: 'flex-end',
          // marginTop: '18%'
          marginTop: hp('7%')
        },

      bodyContainer: {
        flex: 7,
      },

      userInfo: {
        borderBottomWidth: 3,
        borderBottomColor: '#888',
        paddingBottom: '8%'
      },

      user: {
        flexDirection: 'row',
        marginTop: '8%'
      },
      userImage: {
        flex: 1
      },
      userImgContainer: {
        height: 80,
        width: 80,
        backgroundColor: '#ddd',
        borderWidth: 3,
        borderRadius: 200
      },
      userName: {
        flex: 3,
        marginTop: '5%'
      },
      userNameBig: {
        fontSize: 20,
        fontWeight: 'bold'
      },
      userNameSmall: {
        fontSize: 16,
        color: '#8f8f8f'
      },
      userTitle: {
        marginTop: '5%'
      },
      userTitleText: {
        fontSize: 38,
        fontWeight: 'bold'
      },
      userBtn: {
        flexDirection: 'row',
        marginTop: '5%'
      },
      roundBtn: {
        backgroundColor: '#A6DBFB',
        borderRadius: 50,
        justifyContent: 'center'
      },
      roundText: {
        color: '#fff',
        fontSize: 25,
        paddingBottom: '1%',
        paddingLeft: '8%',
        paddingRight: '8%',
      },
      blogContainer: {
        marginTop: '10%'
      },
      blogContent: {
        fontSize: 20,
        lineHeight: 30
      },
      videoPlay: {
        width: viewportWidth,
        height: 230
      },
      group1: {
        flexDirection: 'row',
        position: 'absolute',
        // top: '-3%',
        left: '7%',
        bottom: '4%'
      },
      arrowImage: {
        width: 10,
        height: 16
      },
      dots: {
        // marginLeft: '77%',
        marginLeft: wp('75%'),
        height: 5,
        marginTop: '2%'
      },
      playBtn: {
          position: 'absolute',
          top: '20%',
          left: '45%'
      },
      whitePlay: {
          width: 36
      },
      timeGroup: {
        position: 'absolute',
        flexDirection: 'row',
        top: '80%'
      },
      start: {
        color: "#fff",
        fontSize: 16,
        marginLeft: wp('5%')
      },
      end: {
        color: "#fff",
        fontSize: 16,
        // marginLeft: '71%'
        marginLeft: wp('66%')
      },
      rect: {
        height: 19
      },
      bar: {
        width: viewportWidth,
        position: 'absolute',
        top: '87%'
      },
      videoTitleGroup: {
          // paddingTop: '2%',
          paddingTop: hp('2%'),
          paddingRight: '5%',
          paddingLeft: '5%',
          flexDirection: 'row',
          justifyContent: 'space-between'
      },
      videoTitle: {
        flex: 10
      },
        title1: {
            fontSize: 21,
            // width: "60%"
        },
        title2: {
            fontSize: 21,
            color: '#ccc',
            marginTop: hp('1%'),
            
        },
      videoShare: {
        marginTop: '2%',
        flex: 2,
      },
      share: {
        height: 24,
        marginLeft: wp('7%')
      },
      content1: {
          paddingLeft: '5%',
          paddingRight: '5%',
      },
      youtube: {
          height: 55,
          width: '100%',
          marginTop: '5%',
          marginBottom: '5%',
      },
      youtubeTitle: {
          fontSize: 20,
          marginBottom: '5%'
      },
      youtubeDesc: {
          fontSize: 16
      }
});
