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
import { StyleSheet, Image, Vibration } from 'react-native';
import { Container, Content, Text, Button, Form, Input, Item, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo';
import CodeInput from 'react-native-confirmation-code-input';
import ThemeColors from './ThemeColors';
import SVGIcon from './SVGIcon';
import PNGFiles from './PNGFiles';
import CommonStyles from './CommonStyles';

const styles = StyleSheet.create({
  content: {
    marginTop: 100,
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 20,
    color: ThemeColors.white,
  },
  loginInputArea: {
    width: '90%',
    marginHorizontal: '5%',
    marginTop: 50,
    padding: 10,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ThemeColors.white,
  },
  loginButton: {
    width: '90%',
    backgroundColor: ThemeColors.buttonBackground,
    marginHorizontal: '5%',
    marginVertical: 10,
    justifyContent: 'center',
    borderRadius: 0,
  },
  loginButtonText: {
    color: ThemeColors.buttonText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButtonDisabled: {
    width: '90%',
    backgroundColor: ThemeColors.buttonDisabledBackground,
    marginHorizontal: '5%',
    justifyContent: 'center',
    borderRadius: 0,
  },
  greeting: {
    color: ThemeColors.white,
    textAlign: 'center',
    fontSize: 18,
    margin: 10,
  },
});

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  handleAuthCheck(code) {
    if (code === config.get('appPasscode')) {
      this.props.navigation.dispatch({ type: 'Login' });
    } else {
      Vibration.vibrate([0, 250]);
      this.refs.pinEntry.clear();
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
      <LinearGradient
        colors={ThemeColors.backgroundGradient}
        style={CommonStyles.fullPageGradient}
      >
        <Container>
          <Content style={styles.content}>
            <Grid style={styles.logo}>
              <Row>
              <SVGIcon name='Acmebank' width={150} height={150} />
              </Row>
              <Row>
                <Text style={styles.logoText}>Acme Bank</Text>
              </Row>
            </Grid>
            <Form style={styles.loginInputArea}>
              <Text style={styles.greeting}>
                Welcome Back, Rob!
              </Text>
              <CodeInput
                ref="pinEntry"
                secureTextEntry
                keyboardType="numeric"
                codeLength={4}
                className='border-circle'
                autoFocus={false}
                codeInputStyle={{ fontSize: 36, fontWeight: '800' }}
                activeColor="#ffffff"
                inactiveColor={ThemeColors.buttonDisabledBackground}
                onFulfill={(code) => this.handleAuthCheck(code)}
              />
            </Form>
          </Content>

        </Container>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  username: state.username,
  password: state.password,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  loginScreen: () =>
    dispatch(NavigationActions.navigate({ routeName: 'Login' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);