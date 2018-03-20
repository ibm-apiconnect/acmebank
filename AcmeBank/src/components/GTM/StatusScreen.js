/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import config from 'react-global-configuration';
import { connect } from 'react-redux';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Content, Body, Text, Title, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Notification from 'react-native-in-app-notification';
import SVGIcon from '../SVGIcon';
import { fetchSavings, setAccount, getHomeSavingsProgramStatus, updateHomeSavingsProgramStatus, addTransactions, triggerWarningNotification, signDocument } from '../../data/actions';
import ThemeColors from '../ThemeColors';
import CommonStyles from '../CommonStyles';
import PNGFiles from '../PNGFiles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.greyBackground,
  },
  progressContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
  },
  progressPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 16,
  },
  headerText: {
    color: ThemeColors.black,
    fontSize: 32,
  },
  mainText: {
    color: ThemeColors.black,
    fontSize: 18,
    margin: 10,
  },
  nextStepContainer: {
    flex: 2,
    marginTop: 10,
    padding: 20,
    backgroundColor: ThemeColors.white,
  },
  nextStepHeadingRow: {
    justifyContent: 'center',
  },
  nextStepHeadingText: {
    fontSize: 16,
  },
  nextStepActionRow: {
    justifyContent: 'center',
    margin: 5,
  },
  nextStepActionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextStepDetailsRow: {
    justifyContent: 'center',
  },
  nextStepDetailsText: {
    fontSize: 12,
    textAlign: 'center',
  },
  mortgageContainer: {
    flex: 2,
    marginTop: 10,
    backgroundColor: ThemeColors.white,
  },
  morgageHeadingRow: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  morgageHeadingText: {
    fontWeight: 'bold',
  },
  accountsContainer: {
    flex: 2,
    marginTop: 10,
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
    margin: 20,
    color: 'red',
  },
  congratulationsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  congratulationsText: {
    fontSize: 16,
  },
  disclaimer: {
    marginTop: 20,
    backgroundColor: ThemeColors.altBackground,
  },
  valueText: {
    color: ThemeColors.altText,
    fontSize: 14,
    margin: 10,
  },
});

class GTMStatusScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      warningNotificationTriggered: false,
    };

    this.interval = null;

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    let update = {
      enrolled: true,
      data: {
        homeValue: props.homeValue,
      },
    };

    this.promptedNotifications = [];
  }

  getAccountDetails(account) {
    this.props.setAccount(account);
    this.props.navigation.dispatch({ type: 'AccountDetails' });
  }

  signMortgageShortcut() {
    if (this.mortgageDocId) {
      this.props.signDocument(this.mortgageDocId);
      this.props.getHomeSavingsProgramStatus(config.get('customerId'));
    } else {
      console.log('Mortgage shortcut clicked but I do not know about a mortgage... Have you set everything up?');
    }
  }

  addTransactions() {
    this.props.addTransactions();
  }

  handleShortcut() {
    if (!this.state.usingShortcut) {
      this.setState({
        usingShortcut: true,
      });
    }
    if (this.props.homeSavingsProgramStatus.lenderContacted) {
      this.signMortgageShortcut();
    } else {
      this.addTransactions();
      let progressPercentage = this.state.progressPercentage + .25;
      let savingsAmount = this.state.savingsAmount + (this.props.homeSavingsProgramStatus.data.homeValue * .02);
      this.setState({
        progressPercentage,
        savingsAmount,
      });
    }
  }

  checkForNewNotifications(notifications) {
    let threshold = Date.now() - 10000; // 10 seconds ago
    let newNotification = notifications.find(notification => {
      let timestamp = new Date(notification.timestamp);
      return timestamp.getTime() >= threshold;
    });
    if (newNotification && !this.promptedNotifications.includes(newNotification.id)) {
      if (newNotification.title === 'Sign your closing documents') {    // Store id for mortgage signing shortcut
        this.mortgageDocId = newNotification.documentId;
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

  triggerNotification() {
    if (!this.state.warningNotificationTriggered) {
      this.props.triggerWarningNotification();
      this.setState({
        warningNotificationTriggered: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications) {
      this.checkForNewNotifications(nextProps.notifications);
    }
    let nextState = Object.assign({}, nextProps);
    if (!this.state.usingShortcut) {
      nextState.progressPercentage = (nextProps.savings && nextProps.homeSavingsProgramStatus && nextProps.homeSavingsProgramStatus.data) ? nextProps.savings.amount / (nextProps.homeSavingsProgramStatus.data.homeValue * .2) : 0;
    }
    nextState.savingsAmount = nextProps.savings && nextProps.savings.amount;
    this.setState(nextState);
  }

  componentDidMount() {
    this.props.getHomeSavingsProgramStatus(config.get('customerId'));
    this.props.fetchSavings(config.get('customerId'));
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.props.fetchSavings(config.get('customerId'));
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAppointmentClick() {
    let update = {
      lenderContacted: true,
    };
    this.props.updateHomeSavingsProgramStatus(this.props.customerInfo.id, update);
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
            <Title onPress={() => this.triggerNotification()} >Dream Home</Title>
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
        <Content style={styles.container}>
          <Grid style={styles.progressContainer}>
            {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed && state.progressPercentage > 1 &&
              <Grid style={{ marginBottom: 10 }}>
                <Row style={{ justifyContent: 'center' }} onPress={() => this.signMortgageShortcut()}>
                  <Text style={styles.congratulationsHeader}>
                    Congratulations!
                  </Text>
                </Row>
                <Row style={{ justifyContent: 'center' }}>
                  <Text style={styles.congratulationsText}>
                    You've completed your goal!
                  </Text>
                </Row>
              </Grid>
            }
            {props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.completed &&
              <Grid style={{ marginBottom: 10 }}>
                <Row style={{ justifyContent: 'center' }}>
                  <Text style={styles.congratulationsHeader}>
                    Congratulations!
                  </Text>
                </Row>
                <Row style={{ justifyContent: 'center' }}>
                  <Text style={styles.congratulationsText}>
                    You've opened your mortgage
                  </Text>
                </Row>
              </Grid>
            }
            <Row onPress={() => this.handleShortcut()} style={{ marginBottom: 10 }}>
              {(state.progressPercentage > 1) ?
                <Image
                  style={{ width: 330, height: 120 }}
                  source={PNGFiles.house[10]}
                /> :
                <Image
                  style={{ width: 330, height: 120 }}
                  source={PNGFiles.house[props.homeSavingsProgramStatus.consentSigned ? (Math.floor(state.progressPercentage * 10)) : 0]}
                />
              }
            </Row>
            {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed &&
              <Row>
                <Text style={styles.progressPrice}>
                {state.savingsAmount && props.homeSavingsProgramStatus &&
                `${state.savingsAmount < (props.homeSavingsProgramStatus.data.homeValue * 0.2 * 1.1) ? this.currencyFormatter.format(state.savingsAmount) : this.currencyFormatter.format(props.homeSavingsProgramStatus.data.homeValue * 0.2 * 1.1)} / ${this.currencyFormatter.format(props.homeSavingsProgramStatus.data.homeValue * 0.2)}`
                }
                </Text>
              </Row>
            }
            {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed &&
              <Row>
                <Text style={styles.progressPercentage}>
                  (Progress: {state.progressPercentage && (state.progressPercentage > 1.1 ? 110 : (Math.round(state.progressPercentage * 100)))}%)
              </Text>
              </Row>
            }
          </Grid>
          {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.consentSigned &&
            <Grid style={styles.nextStepContainer} onPress={() => props.navigation.dispatch({ type: 'Notifications' })}>
              <Row style={styles.nextStepHeadingRow}>
                <Text style={styles.nextStepHeadingText}>
                  Next Step:
              </Text>
              </Row>
              <Row style={styles.nextStepActionRow}>
                <Text style={styles.nextStepActionText}>
                  Sign your investment documents
              </Text>
              </Row>
              <Row style={styles.nextStepDetailsRow}>
                <Text style={styles.nextStepDetailsText}>
                  You'll need to sign some documents before we can get started. Check your notifications!
              </Text>
              </Row>
            </Grid>
          }
          {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed && !props.homeSavingsProgramStatus.lenderContacted && state.progressPercentage > 1 &&
            <Grid style={styles.nextStepContainer}>
              <Row style={styles.nextStepHeadingRow}>
                <Text style={styles.nextStepHeadingText}>
                  Next Step:
              </Text>
              </Row>
              <Row style={styles.nextStepActionRow}>
                <Text style={styles.nextStepActionText}>
                  Contact a mortgage officer
              </Text>
              </Row>
              <Row style={styles.nextStepDetailsRow}>
                <Text style={styles.nextStepDetailsText}>
                  Use the information below to contact your local mortgage loan officer. They can help you get the mortgage process started.
              </Text>
              </Row>
            </Grid>
          }
          {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed && props.homeSavingsProgramStatus.lenderContacted && state.progressPercentage > 1 &&
            <Grid style={styles.nextStepContainer} onPress={() => props.navigation.dispatch({ type: 'Notifications' })}>
              <Row style={styles.nextStepHeadingRow}>
                <Text style={styles.nextStepHeadingText}>
                  Next Step:
              </Text>
              </Row>
              <Row style={styles.nextStepActionRow}>
                <Text style={styles.nextStepActionText}>
                  Sign your closing documents
              </Text>
              </Row>
              <Row style={styles.nextStepDetailsRow}>
                <Text style={styles.nextStepDetailsText}>
                  We're almost done. We just need you to finalize your mortgage by signing the origination documents. Check your notifications for more details.
              </Text>
              </Row>
            </Grid>
          }
          {props.homeSavingsProgramStatus && props.homeSavingsProgramStatus.completed &&
            <Grid style={styles.nextStepContainer}>
              <Row style={styles.nextStepHeadingRow}>
                <Text style={styles.nextStepHeadingText}>
                  Next Step:
              </Text>
              </Row>
              <Row style={styles.nextStepActionRow}>
                <Text style={styles.nextStepActionText}>
                  Enjoy your new home
              </Text>
              </Row>
              <Row style={styles.nextStepDetailsRow}>
                <Text style={styles.nextStepDetailsText}>
                  You're all done! Check your accounts screen to see details about your mortgage. This isn't the end of your journey though. We can help you achieve all of your goals in life. When you're ready to get started, click the button on your accounts screen.
              </Text>
              </Row>
            </Grid>
          }
          {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed && !props.homeSavingsProgramStatus.lenderContacted && state.progressPercentage > 1 &&
            <Grid style={styles.mortgageContainer}>
              <Row style={styles.morgageHeadingRow}>
                <Text style={styles.morgageHeadingText}>
                  Your Mortgage Loan Officer
              </Text>
              </Row>
              <Row>
                <Grid style={{ borderWidth: 1, borderColor: '#ECECEC', margin: 20 }}>
                  <Col style={{ width: 50, marginTop: 20, marginLeft: 20, marginBottom: 20 }}>
                    <Image
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      source={PNGFiles.jake}
                    />
                  </Col>
                  <Col style={{ marginTop: 20, marginBottom: 20, marginRight: 20 }}>
                    <Row style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        Jake Leonard
                  </Text>
                    </Row>
                    <Row style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 14 }}>
                        Acme Morgage Lending Officer
                  </Text>
                    </Row>
                  </Col>
                </Grid>
              </Row>
              <Row style={{ justifyContent: 'center' }}>
                <Button
                  style={CommonStyles.nextButton}
                  textStyles={CommonStyles.nextButtonText}
                  onPress={() => this.handleAppointmentClick()}
                >
                  <Text>
                    SCHEDULE AN APPOINTMENT
                </Text>
                </Button>
              </Row>
            </Grid>
          }
          {props.homeSavingsProgramStatus && !props.homeSavingsProgramStatus.completed && props.homeSavingsProgramStatus.consentSigned && state.progressPercentage < 1 &&
            <Grid style={styles.accountsContainer}>
              {props.savings && props.savings.accounts && props.savings.accounts.map(account => (
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
            </Grid>
          }
        </Content>
        <Notification height={150} ref={(ref) => { this.notification = ref; }} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customerInfo: state.customerData.info,
  savings: state.customerData.savings,
  homeSavingsProgramStatus: state.customerData.homeSavingsProgramStatus,
  notifications: state.customerData.notifications,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchSavings: (customerId) => dispatch(fetchSavings(customerId)),
  setAccount: account => dispatch(setAccount(account)),
  getHomeSavingsProgramStatus: (customerId) => dispatch(getHomeSavingsProgramStatus(customerId)),
  updateHomeSavingsProgramStatus: (customerId, updateRequest) => dispatch(updateHomeSavingsProgramStatus(customerId, updateRequest)),
  addTransactions: () => dispatch(addTransactions()),
  triggerWarningNotification: () => dispatch(triggerWarningNotification()),
  signDocument: (documentId) => dispatch(signDocument(documentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMStatusScreen);