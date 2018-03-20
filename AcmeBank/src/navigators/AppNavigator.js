/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, DrawerNavigator } from 'react-navigation';

import config from 'react-global-configuration';

import SideMenu from '../components/SideMenu';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import NotificationsScreen from '../components/NotificationsScreen';
import MortgageScreen from '../components/MortgageScreen';
import BillPayScreen from '../components/BillPayScreen';
import DepositScreen from '../components/DepositScreen';
import HelpScreen from '../components/HelpScreen';
import TransferScreen from '../components/TransferScreen';

import AccountDetailsScreen from '../components/AccountDetailsScreen';
import DocumentViewerScreen from '../components/DocumentViewerScreen';

import GTMIntroScreen from '../components/GTM/IntroScreen';
import GTMLocationScreen from '../components/GTM/LocationScreen';
import GTMHomeDetailsScreen from '../components/GTM/HomeDetailsScreen';
import GTMLoanLengthScreen from '../components/GTM/LoanLengthScreen';
import GTMCalculatingScreen from '../components/GTM/CalculatingScreen';
import GTMFinancesScreen from '../components/GTM/FinancesScreen';
import GTMInvestmentsScreen from '../components/GTM/InvestmentsScreen';
import GTMStatusScreen from '../components/GTM/StatusScreen';

import CarInvestmentScreen from '../components/FutureInvestments/CarInvestmentScreen';
import CollegeInvestmentScreen from '../components/FutureInvestments/CollegeInvestmentScreen';
import VacationInvestmentScreen from '../components/FutureInvestments/VacationInvestmentScreen';

import { addListener } from '../utils/redux';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  DrawerNav: {
    screen: DrawerNavigator({
      Accounts: {
        screen: MainScreen,
      },
      'Mortgage': {
        screen: MortgageScreen,
      },
      'My Home': {
        screen: GTMStatusScreen,
      },
      Notifications: {
        screen: NotificationsScreen,
      },
      DocumentViewer: {
        screen: DocumentViewerScreen
      },
      BillPay: {
        screen: BillPayScreen,
      },
      Deposit: {
        screen: DepositScreen,
      },
      Help: {
        screen: HelpScreen,
      },
      Transfer: {
        screen: TransferScreen,
      },
    }, {
        contentComponent: SideMenu,
      }),
  },
  AccountDetails: { screen: AccountDetailsScreen },
  GTM: {
    screen: StackNavigator({
      Intro: { screen: GTMIntroScreen },
      Location: { screen: GTMLocationScreen },
      HomeDetails: { screen: GTMHomeDetailsScreen },
      LoanLength: { screen: GTMLoanLengthScreen },
      Calculating: { screen: GTMCalculatingScreen },
      Finances: { screen: GTMFinancesScreen },
      Investments: { screen: GTMInvestmentsScreen },
    })
  },
  CarInvestment: { screen: CarInvestmentScreen },
  CollegeInvestment: { screen: CollegeInvestmentScreen },
  VacationInvestment: { screen: VacationInvestmentScreen },
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
        })} screenProps={this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav,
    customer: state.customerData,
    home: state.homeData,
    document: state.documentData,
  };
}

export default connect(mapStateToProps)(AppWithNavigationState);