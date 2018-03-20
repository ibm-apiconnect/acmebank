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
import { fetchCustomerInfo, fetchNotifications, fetchAccounts } from '../data/actions';
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
});

class BillPayScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      transferType: 'oneTime',
      assetAccounts: [],
      creditCardAccounts: [],
      selectedDate: new Date(),
    };

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
    let newState = {};
    if (nextProps.accounts && nextProps.accounts.length) {
      newState.assetAccounts = nextProps.accounts.filter(account => {
        return account.type === 'checking' || account.type === 'savings';
      });
      newState.creditCardAccounts = nextProps.accounts.filter(account => {
        return account.type === 'credit';
      });
    }
    this.setState(Object.assign(newState, nextProps));
  }

  componentDidMount() {
    this.props.requestAccounts(config.get('customerId'));
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
            <Title>Bill Pay</Title>
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
          <Grid style={{ backgroundColor: '#ffffff', padding: 20, alignItems: 'center' }}>
            <Row style={CommonStyles.toggle}>
              <Col style={state.transferType === 'oneTime' ? CommonStyles.toggleButtonSelected : CommonStyles.toggleButton} onPress={() => this.handleToggle('oneTime')}>
                <Text> One time </Text>
              </Col>
              <Col style={state.transferType === 'scheduled' ? CommonStyles.toggleButtonSelected : CommonStyles.toggleButton} onPress={() => this.handleToggle('scheduled')}>
                <Text> Scheduled </Text>
              </Col>
            </Row>
          </Grid>
          <Grid style={{ backgroundColor: '#ffffff', marginTop: 10, padding: 20 }}>
            <Row>
              <Text style={CommonStyles.conentHeader}>From where?</Text>
            </Row>
            <Row>
              <Form>
                <Picker
                  mode="dropdown"
                  placeholder="Select an account"
                  selectedValue={this.state.selectedFromAccount}
                  onValueChange={this.handleFromChange.bind(this)}
                >
                  {state.assetAccounts.map(account => (
                    <Item key={account.id} label={`${account.name}        ${this.currencyFormatter.format(account.balance)}`} value={account.id} />
                  ))}
                </Picker>
              </Form>
            </Row>
            <Row>
              <Text style={CommonStyles.conentHeader}>Which bill?</Text>
            </Row>
            <Row>
              <Picker
                mode="dropdown"
                placeholder="Select an account"
                selectedValue={this.state.selectedToAccount}
                onValueChange={this.handleToChange.bind(this)}
              >
                {state.creditCardAccounts.map(account => (
                  <Item key={account.id} label={`${account.name}        ${this.currencyFormatter.format(account.balance)}`} value={account.id} />
                ))}
              </Picker>
            </Row>
            <Row>
              <Text style={CommonStyles.conentHeader}>How much?</Text>
            </Row>
            <Row>
              <Item style={{ width: '80%', marginLeft: 20 }} >
                <Input placeholder="Amount" onChangeText={(selectedAmount) => this.setState({ selectedAmount })} value={state.selectedAmount} />
              </Item>
            </Row>
            {state.transferType === 'scheduled' &&
              <Row>
                <Text style={CommonStyles.conentHeader}>When?</Text>
              </Row>
            }
            {state.transferType === 'scheduled' &&
              <Row>
                <DatePickerIOS
                  style={{ width: '100%', height: 200 }}
                  mode='date'
                  date={state.selectedDate}
                  minimumDate={new Date(Date.now())}
                  onDateChange={(selectedDate) => this.setState({ selectedDate })}
                />
              </Row>
            }
          </Grid>
        </Content>
        <Footer>
          <Button
            style={(state.selectedToAccount && state.selectedFromAccount && state.selectedAmount) ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => this.handleNextClick()}
            disabled={!(state.selectedToAccount && state.selectedFromAccount && state.selectedAmount)}
          >
            <Text>
              PAY
                </Text>
          </Button>
        </Footer>
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.customerData.accounts,
    notifications: state.customerData.notifications,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  requestAccounts: (customerId, accountTypeFilters) => dispatch(fetchAccounts(customerId, accountTypeFilters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BillPayScreen);