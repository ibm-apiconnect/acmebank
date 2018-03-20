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
import { Image, StyleSheet, DatePickerIOS, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
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
  checkCaptureButton: {
    width: '75%',
    backgroundColor: ThemeColors.buttonBackground,
    justifyContent: 'center',
    borderRadius: 0,
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
    justifyContent: 'center'
  },
  toggleButtonSelected: {
    backgroundColor: ThemeColors.altBackground,
    alignItems: 'center',
    justifyContent: 'center'
  }

});

class DepositScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      assetAccounts: [],
    };

    this.interval = null;

    this.promptedNotifications = [];

    this.formatTime = (time) => moment(time).format('LL');

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    this.camera = null;
    this.checkImage = null;
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
    }
    this.setState(Object.assign(newState, nextProps));
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    this.props.requestAccounts(config.get('customerId'));
    this.setState({
      checkImageAttached: false,
    })
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
      })
    }
  }

  handleNextClick() {
    this.props.navigation.dispatch({ type: 'Home' });
  }

  handleCheckCapture = async () => {
    let checkImage = await this.camera.takePictureAsync();

    this.setState({
      checkImageAttached: true,
      checkImage,
    })
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

    let cameraSection = state.checkImageAttached ? (<Row>
      <Image
        style={{height: 250, width: '100%', marginTop: 20}}
        source={{ uri: state.checkImage.uri }}
      />
    </Row>) :
      (state.hasCameraPermission ? (<Row style={{ marginTop: 20, height: 225 }}>
        <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: ThemeColors.buttonBackground,
                opacity: 0.8,
              }}
              onPress={() => this.handleCheckCapture()}>
              <Text
                style={{ fontSize: 18, marginVertical: 10, color: ThemeColors.white }}>
                {' '}Capture{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </Row>) :
        (<Row>
          <Text> No access to camera </Text>
        </Row>));
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
            <Title>Deposit</Title>
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
          <Grid style={{ backgroundColor: '#ffffff', marginTop: 10, padding: 20 }}>
            <Row>
              <Text style={CommonStyles.conentHeader}>To where?</Text>
            </Row>
            <Row>
              <Picker
                mode="dropdown"
                placeholder="Select an account"
                selectedValue={this.state.selectedToAccount}
                onValueChange={this.handleToChange.bind(this)}
              >
                {state.assetAccounts.map(account => (
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
          </Grid>
          <Grid style={{ backgroundColor: '#ffffff', marginTop: 10, padding: 20 }}>
            <Row>
              <Text style={CommonStyles.conentHeader}>Check</Text>
            </Row>
            {cameraSection}
          </Grid>
        </Content>
        <Footer>
          <Button
            style={state.checkImageAttached ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => this.handleNextClick()}
            disabled={!state.checkImageAttached}
          >
            <Text>
              DEPOSIT
                </Text>
          </Button>
        </Footer>
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(DepositScreen);