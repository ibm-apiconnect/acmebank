/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Slider, StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { setMonthlySavingsNeeded } from '../../data/actions';
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
    backgroundColor: ThemeColors.altBackground,
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
  priceContainer: {
    backgroundColor: ThemeColors.altBackground,
    padding: 20,
  },
  priceHeadingText: {
    color: ThemeColors.black,
    fontSize: 16,
  },
  priceText: {
    marginTop: 10,
    color: ThemeColors.black,
    fontSize: 36,
    fontWeight: 'bold',
  },
  priceSuffixText: {
    marginTop: 25,
    marginLeft: 5,
    color: ThemeColors.black,
    fontSize: 18,
  },
  suggestionText: {
    color: ThemeColors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionGoodText: {
    marginLeft: 5,
    color: ThemeColors.goodGreen,
    fontSize: 12,
  },
  suggestionBadText: {
    marginLeft: 5,
    color: ThemeColors.badRed,
    fontSize: 12,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsHeadingText: {
    color: ThemeColors.black,
    fontSize: 18,
    marginTop: 0,
  },
});

class GTMLoanLengthScreen extends React.Component {

  constructor(props) {
    super(props);

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    this.state = this.initializeDefaultValues(this.state);

    this.calculateMonthlySavingsNeeded();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  initializeDefaultValues(state) {

    let intialState = state || {};

    if (!intialState.timeframe) {
      intialState.timeframe = 4;
    }
    return intialState;
  }

  calculateMonthlySavingsNeeded() {
    let downPayment = this.props.homeValue * .2;
    let savingsNeeded = (downPayment / this.state.timeframe) / 12;
    this.props.setMonthlySavingsNeeded(savingsNeeded);
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
          <Grid style={styles.priceContainer}>
            <Row style={{ marginTop: 0 }}>
              <Text style={styles.priceHeadingText}>
              To achieve your dream, you need to save:
              </Text>
            </Row>
            <Row>
              <Text style={styles.priceText}>
                {props.monthlySavingsNeeded && this.currencyFormatter.format(props.monthlySavingsNeeded) || 'No Data Available'}
              </Text>
              <Text style={styles.priceSuffixText}>
                / mo
              </Text>
            </Row>
          </Grid>
          <Grid style={styles.detailsContainer}>
            <Row>
              <Left>
                <Text style={styles.detailsHeadingText}>
                  Afford your dream home in
              </Text>
              </Left>
              <Right>
                <Text style={styles.detailsHeadingText}>
                  {state.timeframe} {state.timeframe > 1 ? 'years' : 'year'}
                </Text>
              </Right>
            </Row>
            <Row>
              <Slider
                style={{ width: 320, marginTop: 10, marginBottom: 10 }}
                step={1}
                minimumValue={1}
                maximumValue={10}
                value={state.timeframe}
                onValueChange={val => this.setState({ timeframe: val })}
                onSlidingComplete={val => this.calculateMonthlySavingsNeeded()}
              />
            </Row>
          </Grid>
        </Content>
        <Footer>
          <Button
            style={props.homeValue ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => props.navigation.dispatch({ type: 'GTM', step: 'Calculating' })}
            disabled={!props.homeValue}
          >
            <Text>
              NEXT
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
    monthlySavingsNeeded: state.homeData.monthlySavingsNeeded,
    suggestions: state.homeData.suggestions,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  setMonthlySavingsNeeded: (savingsNeeded) => dispatch(setMonthlySavingsNeeded(savingsNeeded)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMLoanLengthScreen);