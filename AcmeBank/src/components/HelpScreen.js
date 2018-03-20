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
import { Image, StyleSheet, DatePickerIOS } from 'react-native';
import { Container, Left, Icon, Body, Title, Right, Content, Header, Text, Button, Footer, Form, Picker, Input, Item, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Notification from 'react-native-in-app-notification';
import { fetchCustomerInfo, fetchNotifications } from '../data/actions';
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
  toggle: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: ThemeColors.altText,
  },
  toggleButton: {
    backgroundColor: ThemeColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: ThemeColors.altBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

class HelpScreen extends React.Component {

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
    this.setState(nextProps);
  }

  componentDidMount() {
    this.props.fetchCustomerInfo(config.get('customerId'));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkForNewNotifications(notifications) {
    let threshold = Date.now() - 10000; // 10 seconds ago
    let newNotification = notifications.find(notification => {
      let timestamp = new Date(notification.timestamp);
      return timestamp.getTime() >= threshold;
    });
    if (newNotification && !this.promptedNotifications.includes(newNotification.id)) {
      this.promptedNotifications.push(newNotification.id);
      this.notification.show({
        title: `New Notification from ${newNotification.from}`,
        message: newNotification.title,
        onPress: () => this.props.navigation.dispatch({ type: 'Notifications' }),
      });
    }
  }

  handleNextClick() {
    this.props.navigation.dispatch({ type: 'Home' });
  }

  handleToggle(transferType) {
    this.setState({
      transferType,
    });
  }

  handleFromChange(accountId) {
    this.setState({
      selectedFromAccount: accountId,
    });
  }

  handleToChange(accountId) {
    this.setState({
      selectedToAccount: accountId,
    });
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
            <Title>Help</Title>
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
        <Grid style={[CommonStyles.content, CommonStyles.contentSpacer]}>
            <Row>
              <Text>We always strive to provide you with the best customer service. There are a number of ways you can reach us.</Text>
            </Row>
          </Grid>
          <Grid style={[CommonStyles.content, CommonStyles.contentSpacer]}>
            <Row>
              <Text style={CommonStyles.conentHeader}>Hours:</Text>
            </Row>
            <Row>
              <Text style={CommonStyles.contentInfo}>24 hours a day, 7 days a week</Text>
            </Row>
            <Row>
              <Text style={CommonStyles.conentHeader}>Phone Number:</Text>
            </Row>
            <Row>
              <Text style={CommonStyles.contentInfo}>+1 (800) GET-ACME</Text>
            </Row>
            <Row>
              <Text style={CommonStyles.conentHeader}>Email:</Text>
            </Row>
            <Row>
              <Text style={CommonStyles.contentInfo}>help@acmebank.com</Text>
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
    accounts: state.customerData.accounts,
    customerInfo: state.customerData.info,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchCustomerInfo: (customerId) => dispatch(fetchCustomerInfo(customerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpScreen);