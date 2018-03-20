/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { fetchAccounts, setAccount } from '../data/actions';
import ThemeColors from './ThemeColors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  account: {
    backgroundColor: ThemeColors.white,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  accountName: {
    fontSize: 18,
  },
  accountId: {
    fontSize: 10,
    marginLeft: 20,
  },
  accountBalance: {
    fontSize: 24,
    marginTop: 20,
  },
  accountBalanceNegative: {
    fontSize: 24,
    marginTop: 20,
    color: ThemeColors.badRed,
  },
  summaryRow: {
    margin: 10,
  },
  summaryText: {
    textAlign: 'right',
  },
});

class AccountsView extends React.Component {

  constructor(props) {
    super(props);

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    this.interval = null;

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customerId && this.props.customerId !== nextProps.customerId) {
      clearInterval(this.interval);
      this.props.requestAccounts(nextProps.customerId, nextProps.accountTypeFilters || this.props.accountTypeFilters);
      this.interval = setInterval(() => {
        this.props.requestAccounts(nextProps.customerId, nextProps.accountTypeFilters || this.props.accountTypeFilters);
      }, 5000);
    }
    let newState = Object.assign({}, nextProps);
    if (nextProps.accounts && nextProps.accounts.length) {
      newState.assetAccounts = nextProps.accounts.filter(account => {
        return account.type === 'checking' || account.type === 'savings';
      });
      newState.liabilityAccounts = nextProps.accounts.filter(account => {
        return account.type === 'credit';
      });
    }
    this.setState(newState);
  }

  componentDidMount() {
    this.props.requestAccounts(this.props.customerId, this.props.accountTypeFilters);
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.props.requestAccounts(this.props.customerId, this.props.accountTypeFilters);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAccountDetails(account) {
    this.props.setAccount(account);
    this.props.navigation.dispatch({ type: 'AccountDetails' });
  }

  render() {
    let props = this.props;
    let state = this.state;
    return (
      <Container>
        <Content>
          {state.assetAccounts &&
            <Grid>
              {state.assetAccounts.map(account => (
                <Row key={account.id} style={styles.account} onPress={() => this.getAccountDetails(account)}>
                  <Grid>
                    <Row>
                      <Text style={styles.accountName}>
                        {account.name} (...{account.id.substr(account.id.length - 4)})
                    </Text>
                    </Row>
                    <Row>
                      <Right>
                        <Text style={account.balance >= 0 ? styles.accountBalance : styles.accountBalanceNegative}>
                          {this.currencyFormatter.format(Math.abs(account.balance))}
                        </Text>
                      </Right>
                    </Row>
                  </Grid>
                </Row>
              ))}
              <Row style={styles.summaryRow}>
                <Col>
                  <Text style={styles.summaryText}>
                    Assets: 
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.summaryText}>
                      {state.assetAccounts.length && this.currencyFormatter.format(state.assetAccounts.map(a => a.balance).reduce((acc, val) => acc + val))}
                  </Text>
                </Col>
              </Row>
            </Grid>
          }
          {state.liabilityAccounts &&
            <Grid>
              {state.liabilityAccounts.map(account => (
                <Row key={account.id} style={styles.account} onPress={() => this.getAccountDetails(account)}>
                  <Grid>
                    <Row>
                      <Text style={styles.accountName}>
                        {account.name} (...{account.id.substr(account.id.length - 4)})
                    </Text>
                    </Row>
                    <Row>
                      <Right>
                        <Text style={account.balance >= 0 ? styles.accountBalance : styles.accountBalanceNegative}>
                          {this.currencyFormatter.format(Math.abs(account.balance))}
                        </Text>
                      </Right>
                    </Row>
                  </Grid>
                </Row>
              ))}
              <Row style={styles.summaryRow}>
                <Col>
                  <Text style={styles.summaryText}>
                    Liabilities: 
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.summaryText}>
                      {state.liabilityAccounts.length && this.currencyFormatter.format(state.liabilityAccounts.map(a => a.balance).reduce((acc, val) => acc + val))}
                  </Text>
                </Col>
              </Row>
            </Grid>
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.customerData.accounts,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  requestAccounts: (customerId, accountTypeFilters) => dispatch(fetchAccounts(customerId, accountTypeFilters)),
  setAccount: account => dispatch(setAccount(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountsView);