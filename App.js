import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Entry from './src/Entry';
import Login from './src/Login';
import SignUp from './src/SignUp';
import Route from './src/Route';
import Home from './src/Home';
import Music from './src/Music';
import Interview from './src/Interview';
import Catalog from './src/Catalog';
import Event from './src/Event';
import Profile from './src/Profile';
import Cart from './src/Cart';
import Edit from './src/Edit';
import Item from './src/Item';
import VideoPlay from './src/Video';
import BlogIndex from './src/BlogIndex';
import BlogShow from './src/BlogShow';
import BlogFirst from './src/Blog1';
import BlogSecond from './src/Blog2';
import EventShow from './src/EventShow';
import ProductView from './src/ProductView';

const MainNavigator = createStackNavigator(
  {
    Entry: {screen: Entry},
    Login: {screen: Login},
    SignUp: {screen: SignUp},
    Home: {screen: Home},
    Music: {screen: Music},
    Interview: {screen: Interview},
    Catalog: {screen: Catalog},
    Event: {screen: Event},
    Profile: {screen: Edit},
    Profile: {screen: Profile},
    Cart: {screen: Cart},
    Edit: {screen: Edit},
    Item: {screen: Item},
    VideoPlay: {screen: VideoPlay},
    BlogIndex: {screen: BlogIndex},
    BlogShow: {screen: BlogShow},
    BlogFirst: {screen: BlogFirst},
    BlogSecond: {screen: BlogSecond},
    EventShow: {screen: EventShow},
    ProductView: {screen: ProductView}
  },
  {
    headerMode: 'none',
    initialRouteName: 'Entry'
  }
);

const App = createAppContainer(MainNavigator);


export default App;
