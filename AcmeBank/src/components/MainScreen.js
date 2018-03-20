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
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Container, Left, Icon, Body, Title, Right, Content, Header, Text, Button, Footer, Form, Input, Item, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo';
import Notification from 'react-native-in-app-notification';
import RNShakeEvent from 'react-native-shake-event';
import { fetchCustomerInfo, getHomeSavingsProgramStatus, fetchNotifications } from '../data/actions';
import SVGIcon from './SVGIcon';
import ThemeColors from './ThemeColors';
import CommonStyles from './CommonStyles';

import AccountsView from './AccountsView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.greyBackground,
  },
  footer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    height: 120,
  },
  footerGradient: {
    height: 120,
    width: '100%',
  },
  footerText: {
    color: ThemeColors.white,
    fontSize: 18,
    paddingHorizontal: 20,
  },
  footerIcon: {
    color: ThemeColors.white,
    fontWeight: 'bold',
  },
  footerIcon: {
    color: ThemeColors.white,
    fontSize: 24,
    marginTop: 20,
  },
  carFooter: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    height: 120,
    backgroundColor: ThemeColors.futureInvestments[0].background,
  },
  vacationFooter: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    height: 120,
    backgroundColor: ThemeColors.futureInvestments[1].background,
  },
  collegeFooter: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    height: 120,
    backgroundColor: ThemeColors.futureInvestments[2].background,
  },
});

class MainScreen extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      investmentFooterId: 2,
    };

    this.interval = null;

    props.fetchCustomerInfo(config.get('customerId'));

    this.promptedNotifications = [];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.checkForNewNotifications(nextProps.notifications);
    }
    let newState = nextProps;
    this.setState(nextProps);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      let id = this.state.investmentFooterId;
      id++;
      if (id === 3) {
        id = 0;
      }
      this.setState({
        investmentFooterId: id,
      });
    }, 5000);
    setInterval(() => {
      this.props.fetchNotifications(this.props.customerInfo.id);
    }, 10000);
    this.props.getHomeSavingsProgramStatus(config.get('customerId'));
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
                <Title>Acme Bank</Title>
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
          <Grid>
            <Row>
              <AccountsView navigation={props.navigation} customerId={props.customerInfo && props.customerInfo.id} />
            </Row>
          </Grid>
        </Content>
        {props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.eligible && !props.homeSavingsProgramStatus.completed &&
          <Footer style={styles.footer}>
            <Grid style={{ width: '100%' }} onPress={() => props.navigation.dispatch({ type: 'GTM', step: 'Intro' })}>
              <LinearGradient style={styles.footerGradient} colors={ThemeColors.investmentBackgroundGradient}>
                <Row style={{ paddingTop: 20 }}>
                  <Text style={styles.footerText}>
                    Want to own your own home?
                </Text>
                </Row>
                <Row>
                  <Text style={styles.footerText}>
                    Let us help!
                </Text>
                </Row>
                <Row style={{ justifyContent: 'flex-end', paddingBottom: 20, paddingRight: 20 }}>
                  <SVGIcon name='Trees' />
                  <SVGIcon name='Cloud' height='20' />
                  <SVGIcon name='House' />
                </Row>
              </LinearGradient>
            </Grid>
          </Footer>
        }
        {props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.completed &&
          (state.investmentFooterId === 0 ? <Footer style={styles.carFooter}>
            <Grid style={{ width: '100%', paddingLeft: -100, paddingRight: -50 }} onPress={() => props.navigation.dispatch({ type: 'NextGoal', investment: 'Car' })}>
              <LinearGradient style={styles.footerGradient} colors={ThemeColors.futureInvestments[0].backgroundGradient}>
                <Row style={{ paddingTop: 20 }}>
                  <Text style={styles.footerText}>
                    Want to buy your dream car?
                </Text>
                </Row>
                <Row>
                  <Text style={styles.footerText}>
                    Let us help!
                </Text>
                </Row>
                <Row style={{ justifyContent: 'flex-end', paddingBottom: 20, paddingRight: 20 }}>
                  <SVGIcon name='Car' width={150} />
                </Row>
              </LinearGradient>
            </Grid>
          </Footer> : (state.investmentFooterId === 1) ? <Footer style={styles.vacationFooter}>
            <Grid style={{ width: '100%', paddingLeft: -100, paddingRight: -50 }} onPress={() => props.navigation.dispatch({ type: 'NextGoal', investment: 'Vacation' })}>
              <LinearGradient style={styles.footerGradient} colors={ThemeColors.futureInvestments[1].backgroundGradient}>
                <Row style={{ paddingTop: 20 }}>
                  <Text style={styles.footerText}>
                    Want to save for a vacation?
                </Text>
                </Row>
                <Row>
                  <Text style={styles.footerText}>
                    Let us help!
                </Text>
                </Row>
                <Row style={{ justifyContent: 'flex-end', paddingBottom: 20, paddingRight: 20 }}>
                  <SVGIcon name='Sun' height={20} />
                  <SVGIcon name='Boat' width={110} />
                </Row>
              </LinearGradient>
            </Grid>
          </Footer> : <Footer style={styles.collegeFooter}>
                <Grid style={{ width: '100%', paddingLeft: -100, paddingRight: -50 }} onPress={() => props.navigation.dispatch({ type: 'NextGoal', investment: 'College' })}>
                  <LinearGradient style={styles.footerGradient} colors={ThemeColors.futureInvestments[2].backgroundGradient}>
                    <Row style={{ paddingTop: 20 }}>
                      <Text style={styles.footerText}>
                        Need to save for college?
                </Text>
                    </Row>
                    <Row>
                      <Text style={styles.footerText}>
                        Let us help!
                </Text>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end', paddingBottom: 20, paddingRight: 20 }}>
                      <SVGIcon name='Cap' width={120} />
                    </Row>
                  </LinearGradient>
                </Grid>
              </Footer>)
        }
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customerInfo: state.customerData.info,
    homeSavingsProgramStatus: state.customerData.homeSavingsProgramStatus,
    account: state.customerData.account,
    transactions: state.customerData.transactions,
    notifications: state.customerData.notifications,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchCustomerInfo: (customerId) => dispatch(fetchCustomerInfo(customerId)),
  fetchNotifications: (customerId) => dispatch(fetchNotifications(customerId)),
  getHomeSavingsProgramStatus: (customerId) => dispatch(getHomeSavingsProgramStatus(customerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);