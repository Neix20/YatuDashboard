/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from '@app/index.js';
import {name as appName} from './app.json';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Ignore all log notifications

AppRegistry.registerComponent(appName, () => App);
