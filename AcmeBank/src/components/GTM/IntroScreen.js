/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo';
import SVGIcon from '../SVGIcon';
import { updateHomeSavingsProgramStatus } from '../../data/actions';
import ThemeColors from '../ThemeColors';
import CommonStyles from '../CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: ThemeColors.background,
  },
  header: {
    width: '100%',
    backgroundColor: ThemeColors.investmentBackgroundGradient[0],
  },
  footer: {
    backgroundColor: ThemeColors.investmentBackgroundGradient[1],
  },
  headerIcon: {
    color: '#ffffff',
    fontSize: 48,
  },
  headerText: {
    color: ThemeColors.white,
    fontSize: 28,
  },
  mainText: {
    color: ThemeColors.white,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  bulletText: {
    color: ThemeColors.white,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },
});

class GTMIntroScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
    props.updateHomeSavingsProgramStatus(props.customerInfo.id, {
      viewed: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
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
      <LinearGradient
        colors={ThemeColors.investmentBackgroundGradient}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
        }}
      >
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Right>
              <Button
                transparent
                onPress={() => props.navigation.dispatch({ type: 'Home' })}
              >
                <Icon style={styles.headerIcon} name="ios-close-outline" />
              </Button>
            </Right>
          </Header>
          <Content style={{ margin: 15 }}>
            <Grid>
              <Row>
                <Text style={styles.headerText}>
                  Want to own your dream home?
          </Text>
              </Row>
              <Row>
                <Text style={styles.headerText}>
                  Let us help.
          </Text>
              </Row>
              <Row style={{ marginTop: 15 }}>
                <Text style={styles.mainText}>
                  Acme personal finance assistant makes it easy. Get started today!
          </Text>
              </Row>
              <Row>
                <SVGIcon name='Castle' />
                <Text style={styles.bulletText}>
                  Set a dream home goal
          </Text>
              </Row>
              <Row>
                <SVGIcon name='PieChart' />
                <Text style={styles.bulletText}>
                  Select an investment package
          </Text>
              </Row>
              <Row>
                <SVGIcon name='PiggyBank' />
                <Text style={styles.bulletText}>
                  Start saving
          </Text>
              </Row>
            </Grid>
          </Content>
          <Footer style={styles.footer}>
            <Button
              style={CommonStyles.nextButton}
              textStyles={CommonStyles.nextButtonText}
              onPress={() => props.navigation.dispatch({ type: 'GTM', step: 'Location' })}
            >
              <Text>
                LET'S DO THIS
                </Text>
            </Button>
          </Footer>
        </Container>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  customerInfo: state.customerData.info,
  homeSavingsProgramStatus: state.customerData.homeSavingsProgramStatus,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  updateHomeSavingsProgramStatus: (customerId, updateRequest) => dispatch(updateHomeSavingsProgramStatus(customerId, updateRequest)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMIntroScreen);