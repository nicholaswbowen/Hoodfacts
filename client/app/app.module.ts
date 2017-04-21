import * as angular from 'angular';
import config from './app.config';
import run from './app.run';
import core from './core/core.module';
import 'angular-ui-router';
import 'angular-ui-bootstrap';
import {SessionServiceModule} from './services/session.service';

import LayoutComponent from './layout/layout.module';
import HomeComponent from './home/home.module';
import AuthComponent from './auth/auth.module';
import gMapComponent from './gMap/gMap.module';
import Profile from './profile/profile.module';
import UsersIndex from './usersIndex/usersIndex.module';
import Sidebar from './sidebar/sidebar.module';
import SplashPage from './splashPage/splashPage.module';

const name = 'app';
const dependencies = [
  'ui.bootstrap',
  'ui.router',
  SessionServiceModule,
  core, // YOUR CORE DEPENDENCIES
  HomeComponent,
  LayoutComponent,
  AuthComponent,
  gMapComponent,
  Profile,
  UsersIndex,
  Sidebar,
  SplashPage
];

angular.module(name, dependencies)
  .config(config)
  .run(run);

angular.bootstrap(document.body, [name], { strictDi: true });
