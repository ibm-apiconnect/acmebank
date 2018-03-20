/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, Slider, StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import SVGIcon from '../SVGIcon';
import { getInvestmentProfile, updateHomeSavingsProgramStatus } from '../../data/actions';
import ThemeColors from '../ThemeColors';
import PNGFiles from '../PNGFiles';
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
  bannerContainer: {
    backgroundColor: ThemeColors.white,
    padding: 20,
  },
  bannerHeadingText: {
    textAlign: 'center',
    color: ThemeColors.black,
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  planContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    width: '80%',
    marginHorizontal: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsHeadingText: {
    color: ThemeColors.black,
    fontSize: 18,
    marginTop: 10,
  },
  planDescriptionText: {
    height: 120,
    color: ThemeColors.mediumGrey,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
  },
  planInfoHeading: {
    color: ThemeColors.black,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  planInfoText: {
    color: ThemeColors.altText,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 5,
  },
});

class GTMInvestmentsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      investmentProfileChoice: 2,
    };
    this.updateInvestmentProfile(this.state.investmentProfileChoice);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  handleNextClick() {
    let update = {
      enrolled: true,
      data: {
        homeValue: this.props.homeValue,
        investmentProfileId: this.state.investmentProfileChoice,
      },
    };
    this.props.updateHomeSavingsProgramStatus(this.props.customerInfo.id, update);
    this.props.navigation.dispatch({ type: 'GTM', step: 'My Home' });
  }

  updateInvestmentProfile(investmentProfileChoice) {
    this.props.getInvestmentProfile(investmentProfileChoice);
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
          <Grid style={styles.bannerContainer}>
            <Row>
              <Text style={styles.bannerHeadingText}>
                Based on your financial situation, we recommend the following investment plans in order to reach your goal:
              </Text>
            </Row>
          </Grid>
          <Grid style={styles.planContainer}>
            <Row>
              {props.investmentProfile &&
                <Image
                  style={{ width: 277, height: 147 }}
                  source={PNGFiles.risk[props.investmentProfile.id]}
                />
              }
            </Row>
            <Row>
              <Text style={styles.detailsHeadingText}>
                {props.investmentProfile && props.investmentProfile.name || ''}
              </Text>
            </Row>
            <Row>
              <Text style={styles.planDescriptionText}>
                {props.investmentProfile && props.investmentProfile.description || ''}
              </Text>
            </Row>
            <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.planInfoHeading}>
                Expected Return:
              </Text>
              <Text style={styles.planInfoText}>
                {props.investmentProfile && `${Math.round(props.investmentProfile.return * 100)}%` || ''}
              </Text>
            </Row>
            <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.planInfoHeading}>
                Expected Risk:
              </Text>
              <Text style={styles.planInfoText}>
                {props.investmentProfile && props.investmentProfile.risk || ''}
              </Text>
            </Row>
          </Grid>
          <Grid style={styles.detailsContainer}>
            <Row>
              <Slider
                style={{ width: 320, marginTop: 10, marginBottom: 10 }}
                step={1}
                minimumValue={0}
                maximumValue={4}
                value={state.investmentProfileChoice}
                onValueChange={val => this.setState({ investmentProfileChoice: val })}
                onSlidingComplete={val => this.updateInvestmentProfile(val)}
              />
            </Row>
            <Row>
              <Left>
                <Text style={styles.detailsHeadingText}>
                  Less Risk
              </Text>
              </Left>
              <Right>
                <Text style={styles.detailsHeadingText}>
                  More Risk
                </Text>
              </Right>
            </Row>
          </Grid>
        </Content>
        <Footer>
          <Button
            style={CommonStyles.nextButton}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => this.handleNextClick()}
          >
            <Text>
              START SAVING
                </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customerInfo: state.customerData.info,
  homeValue: state.homeData.value,
  investmentProfile: state.customerData.investmentProfile,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  getInvestmentProfile: (investmentProfileValue) => dispatch(getInvestmentProfile(investmentProfileValue)),
  updateHomeSavingsProgramStatus: (customerId, updateRequest) => dispatch(updateHomeSavingsProgramStatus(customerId, updateRequest)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMInvestmentsScreen);