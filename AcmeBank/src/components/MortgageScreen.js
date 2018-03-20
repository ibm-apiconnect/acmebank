/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import config from 'react-global-configuration';
import moment from 'moment';
import { connect } from 'react-redux';
import { Image, StyleSheet } from 'react-native';
import { Container, Left, Icon, Body, Title, Right, Content, Header, Text, Button, Footer, Form, Input, Item, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Notification from 'react-native-in-app-notification';
import { fetchCustomerInfo, getHomeSavingsProgramStatus, fetchNotifications, fetchAccounts } from '../data/actions';
import SVGIcon from './SVGIcon';
import ThemeColors from './ThemeColors';
import CommonStyles from './CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.greyBackground,
  },
  paymentAmount: {
    fontSize: 24,
  },
  paymentAmountNegative: {
    fontSize: 24,
    color: ThemeColors.badRed,
  },
  paymentInfo: {
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  AmountNegative: {
    color: ThemeColors.badRed,
  },
});

class MortgageScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.interval = null;

    this.promptedNotifications = [];

    this.formatTime = (time) => moment(time).format('LL');

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.checkForNewNotifications(nextProps.notifications);
    }
    // let newState = nextProps;
    if (nextProps.accounts) {
      this.setPaymentValues(nextProps.accounts);
    }
    this.setState(nextProps);
  }

  componentDidMount() {
    this.props.requestAccounts(config.get('customerId'));
    this.props.getHomeSavingsProgramStatus(config.get('customerId'));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setPaymentValues(accounts) {
    let mortgageAccount = this.props.accounts.find(account => {
      return account.type === 'mortgage';
    });
    let paymentAmount = mortgageAccount ? (mortgageAccount.balance / (15 * 12)) : 0;
    this.setState({
      mortgageAccount,
      paymentAmount,
    });
  }

  checkForNewNotifications(notifications) {
    let threshold = Date.now() - 10000; // 10 seconds ago
    let newNotification = notifications.find(notification => {
      let timestamp = new Date(notification.timestamp);
      return timestamp.getTime() >= threshold;
    });
    if (newNotification && !this.promptedNotifications.includes(newNotification.id)) {
      if (newNotification.title === 'Sign your closing documents') {    // Ignore closing doc notification
        return;
      }
      this.promptedNotifications.push(newNotification.id);
      this.notification.show({
        title: `New Notification from ${newNotification.from}`,
        message: newNotification.title,
        onPress: () => this.props.navigation.dispatch({ type: 'Notifications' }),
      });
    }
  }

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('DrawerToggle')}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>My Mortgage</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => props.navigation.dispatch({ type: 'Logout' })}
            >
              <Text style={CommonStyles.logoutText}> Log Out </Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Grid style={CommonStyles.content}>
            <Col style={{ width: 100 }}>
              <SVGIcon height='40' width='96' name={'HouseSolo'} />
            </Col>
            <Col>
              <Row>
                <Text> 1174 W Treasure Cove </Text>
              </Row>
              <Row>
                <Text> Opened on {state.mortgageAccount && this.formatTime(state.mortgageAccount.openDate)} </Text>
              </Row>
            </Col>
          </Grid>
          <Grid style={[CommonStyles.content, CommonStyles.additionalContent]}>
            <Row>
              <Text style={state.paymentAmount >= 0 ? styles.paymentAmount : styles.paymentAmountNegative} > {this.currencyFormatter.format(Math.abs(state.paymentAmount))} </Text>
            </Row>
            <Row style={styles.paymentInfo}>
              <Text> Payment Due April 1, 2018</Text>
            </Row>
            <Row>
              <Text style={state.mortgageAccount && state.mortgageAccount.balance >= 0 ? styles.paymentAmount : styles.paymentAmountNegative} > {state.mortgageAccount && this.currencyFormatter.format(Math.abs(state.mortgageAccount.balance))} </Text>
            </Row>
            <Row style={styles.paymentInfo}>
              <Text> Mortgage Balance </Text>
            </Row>
            <Row>
              <Text style={props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.data && props.homeSavingsProgramStatus.data.homeValue >= 0 ? styles.paymentAmount : styles.paymentAmountNegative}> {props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.data && this.currencyFormatter.format(Math.abs(props.homeSavingsProgramStatus.data.homeValue))} </Text>
            </Row>
            <Row style={styles.paymentInfo}>
              <Text> Home Value </Text>
            </Row>
          </Grid>
        </Content>
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    homeSavingsProgramStatus: state.customerData.homeSavingsProgramStatus,
    accounts: state.customerData.accounts,
    notifications: state.customerData.notifications,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  requestAccounts: (customerId, accountTypeFilters) => dispatch(fetchAccounts(customerId, accountTypeFilters)),
  getHomeSavingsProgramStatus: (customerId) => dispatch(getHomeSavingsProgramStatus(customerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MortgageScreen);