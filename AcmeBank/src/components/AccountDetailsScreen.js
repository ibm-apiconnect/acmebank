/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Body, Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Notification from 'react-native-in-app-notification';
import { fetchAccounts, fetchTransactions } from '../data/actions';
import ThemeColors from './ThemeColors';
import CommonStyles from './CommonStyles';

const styles = StyleSheet.create({
  accountMetadataHeading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accountMetadataBalance: {
    fontSize: 14,
    textAlign: 'right',
  },
  transaction: {
    backgroundColor: ThemeColors.white,
    marginBottom: 1,
    padding: 20,
  },
  tranasactionDescription: {
    fontSize: 18,
  },
  transactionId: {
    fontSize: 10,
    marginLeft: 20,
  },
  transactionTimestamp: {
    fontSize: 10,
  },
  transactionAmount: {
    fontSize: 18,
    textAlign: 'right',
  },
  transactionAmountNegative: {
    fontSize: 18,
    textAlign: 'right',
    color: ThemeColors.badRed,
  },
  transactionsHeading: {
    margin: 20,
  },
});

class AccountDetailsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    this.formatTime = (time) => moment(time).format('MM/DD');

    props.requestTransactions(props.account.customerId, props.account.id);

    this.state = {};

    this.promptedNotifications = [];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.checkForNewNotifications(nextProps.notifications);
    }
    this.setState(nextProps);
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
              onPress={() => props.navigation.goBack()}
            >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Transactions</Title>
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
            <Row style={styles.transactionsHeading}>
              <Col>
                <Text style={styles.accountMetadataHeading}>
                  {props.account.name} (...{props.account.id.substring(props.account.id.length - 4)})
                            </Text>
              </Col>
              <Col style={{ width: 100 }}>
                <Text style={styles.accountMetadataBalance}>
                  {this.currencyFormatter.format(props.account.balance)}
                </Text>
              </Col>
            </Row>
          </Grid>
          <Grid>
            {props.transactions && props.transactions.map(transaction => (
              <Row key={transaction.id} style={styles.transaction}>
                <Grid>
                  <Row>
                    <Col>
                      <Text style={styles.transactionDescription}>
                        {transaction.description || 'No Description'}
                      </Text>
                    </Col>
                    <Col style={{ width: 100 }}>
                      <Text style={transaction.amount >= 0 ? styles.transactionAmount : styles.transactionAmountNegative}>
                        {this.currencyFormatter.format(Math.abs(transaction.amount))}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Text style={styles.transactionTimestamp}>
                      {this.formatTime(transaction.timestamp)}
                    </Text>
                  </Row>
                </Grid>
              </Row>
            ))}
          </Grid>
        </Content>
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.customerData.account,
    transactions: state.customerData.transactions,
    notifications: state.customerData.notifications,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  requestTransactions: (customerId, accountId) => dispatch(fetchTransactions(customerId, accountId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailsScreen);