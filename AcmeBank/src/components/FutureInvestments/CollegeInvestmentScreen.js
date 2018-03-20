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
import { Col, Row, Grid } from "react-native-easy-grid";
import { LinearGradient } from 'expo';
import SVGIcon from '../SVGIcon';
import ThemeColors from '../ThemeColors';
import CommonStyles from '../CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  headerIcon: {
    color: ThemeColors.white,
    fontSize: 48,
  },
  nextButton: {
    width: '100%',
    backgroundColor: ThemeColors.futureInvestments[2].buttonBackground,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: ThemeColors.white,
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginVertical: 20,
  },
  contentSpacing: {
    marginTop: 15,
  },
  footer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    height: 80,
    backgroundColor: 'transparent',
  },
});

class CollegeInvestmentScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
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
        colors={ThemeColors.futureInvestments[2].backgroundGradient}
        style={CommonStyles.fullPageGradient}
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
                  Need to save for college?
          </Text>
              </Row>
              <Row>
                <Text style={styles.headerText}>
                  Let us help.
          </Text>
              </Row>
              <Row style={styles.contentSpacing}>
                <Text style={styles.mainText}>
                  Acme personal finance assistant makes it easy. Get stated today!
          </Text>
              </Row>
              <Row>
                <SVGIcon name='Castle' />
                <Text style={styles.bulletText}>
                  Set a goal
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
              <Row style={styles.contentSpacing}>
                <Text style={styles.mainText}>
                  Coming Soon...
          </Text>
              </Row>
            </Grid>
          </Content>
          <Footer style={styles.footer}>
            <Grid style={CommonStyles.fullWidth} >
              <Row style={{ justifyContent: 'flex-end' }}>
                <Col>
                  <SVGIcon name='Trees' width={100} height={75} />
                </Col>
                <Col>
                  <SVGIcon name='School' width={200} height={75} />
                </Col>
              </Row>
            </Grid>
          </Footer>
        </Container>
      </LinearGradient>
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollegeInvestmentScreen);