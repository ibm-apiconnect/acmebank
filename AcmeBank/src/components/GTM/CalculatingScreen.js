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
import { StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Progress from 'react-native-progress';
import { fetchCreditScore, fetchMonthlyExpenseReport, fetchDebtsReport } from '../../data/actions';
import ThemeColors from '../ThemeColors';
import CommonStyles from '../CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
  },
  header: {
    width: '100%',
    backgroundColor: ThemeColors.white,
  },
  bannerContainer: {
    backgroundColor: ThemeColors.white,
    padding: 20,
  },
  bannerHeadingText: {
    color: ThemeColors.black,
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsHeadingText: {
    color: ThemeColors.black,
    fontSize: 18,
    marginTop: 10,
  },
  headerIcon: {
    color: ThemeColors.black,
    fontSize: 48,
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
  completedContainer: {
    backgroundColor: ThemeColors.altBackground,
    margin: 20,
  },
  completedText: {
    color: ThemeColors.altText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

class GTMCalculatingScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      creditProgress: {
        finished: false,
        percentage: 0,
      },
      expensesProgress: {
        finished: false,
        percentage: 0,
      },
      debtsProgress: {
        finished: false,
        percentage: 0,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};
    if (nextProps.creditScore) {
      newState.creditProgress = {
        finished: true,
        percentage: 1,
      };
    }
    if (nextProps.expenseReport) {
      newState.expensesProgress = {
        finished: true,
        percentage: 1,
      };
    }
    if (nextProps.debtsReport) {
      newState.debtsProgress = {
        finished: true,
        percentage: 1,
      };
    }
    this.setState(Object.assign({}, nextProps, newState));
  }

  componentDidMount() {
    this.props.fetchCreditScore(config.get('customerId'));
    this.props.fetchMonthlyExpenseReport(config.get('customerId'));
    this.props.fetchDebtsReport(config.get('customerId'));
  }

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  testProgress() {
    this.setState({
      debtsProgress: {
        finished: true,
        percentage: 1,
      },
    });
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => props.navigation.goBack()}
            >
              <Icon style={styles.headerIcon} name="ios-arrow-round-back" />
            </Button>
          </Left>
          <Right>
            <Button
              transparent
              onPress={() => props.navigation.dispatch({ type: 'Home' })}
            >
              <Icon style={styles.headerIcon} name="ios-close-outline" />
            </Button>
          </Right>
        </Header>
        <Content style={{ width: '100%' }}>
          <Grid style={styles.bannerContainer}>
            <Row>
              <Text style={styles.bannerHeadingText}>
                Getting you closer to your dream home...
              </Text>
            </Row>
          </Grid>
          <Grid style={styles.detailsContainer}>
            <Row>
              <Text style={styles.detailsHeadingText}>
                Credit Score
              </Text>
            </Row>
            <Row style={{ padding: 10 }}>
              <Progress.Bar progress={state.creditProgress.percentage} indeterminate={!state.creditProgress.finished} width={320} height={10} borderRadius={0} color={ThemeColors.investmentBackgroundGradient[1]} />
            </Row>
            <Row>
              <Text style={styles.detailsHeadingText}>
                Monthly Expenses
              </Text>
            </Row>
            <Row style={{ padding: 10 }}>
              <Progress.Bar progress={state.expensesProgress.percentage} indeterminate={!state.expensesProgress.finished} width={320} height={10} borderRadius={0} color={ThemeColors.investmentBackgroundGradient[1]} />
            </Row>
            <Row>
              <Text style={styles.detailsHeadingText}>
                Other Debts
              </Text>
            </Row>
            <Row style={{ padding: 10 }}>
              <Progress.Bar progress={state.debtsProgress.percentage} indeterminate={!state.debtsProgress.finished} width={320} height={10} borderRadius={0} color={ThemeColors.investmentBackgroundGradient[1]} />
            </Row>
          </Grid>
          {(props.creditScore && props.expenseReport && props.debtsReport) &&
            <Grid>
              <Row style={styles.completedContainer}>
                <Col style={{ width: 50 }}>
                  <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 15, marginBottom: 15 }}>
                    <Icon name='ios-checkmark-circle-outline' style={{ color: ThemeColors.altText }} />
                  </Row>
                </Col>
                <Col style={{ margin: 10 }}>
                  <Row>
                    <Text style={styles.completedText}>
                      Calculations complete!
          </Text>
                  </Row>
                  <Row>
                    <Text style={styles.completedText}>
                      Click continue to proceed.
          </Text>
                  </Row>
                </Col>
              </Row>
            </Grid>
          }
        </Content>
        <Footer>
          <Button
            style={(props.creditScore && props.expenseReport && props.debtsReport) ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => props.navigation.dispatch({ type: 'GTM', step: 'Finances' })}
            disabled={!(props.creditScore && props.expenseReport && props.debtsReport)}
          >
            <Text>
              CONTINUE
                </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    city: state.homeData.city,
    homeValue: state.homeData.value,
    creditScore: state.customerData.creditScore,
    expenseReport: state.customerData.monthlyExpenseReport,
    debtsReport: state.customerData.debts,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchCreditScore: (customerId) => dispatch(fetchCreditScore(customerId)),
  fetchMonthlyExpenseReport: (customerId) => dispatch(fetchMonthlyExpenseReport(customerId)),
  fetchDebtsReport: (customerId) => dispatch(fetchDebtsReport(customerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMCalculatingScreen);