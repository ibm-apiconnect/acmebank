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
import { Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { setCity } from '../../data/actions';
import ThemeColors from '../ThemeColors';
import CommonStyles from '../CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
  },
  content: {
    margin: 20,
  },
  header: {
    width: '100%',
    backgroundColor: ThemeColors.white,
  },
  headerIcon: {
    color: ThemeColors.black,
    fontSize: 48,
  },
  locationInput: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    color: '#000000',
    fontSize: 20,
  },
  disclaimer: {
    backgroundColor: ThemeColors.altBackground,
  },
  valueText: {
    color: ThemeColors.altText,
    fontSize: 14,
    margin: 10,
  },
});

class GTMLocationScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleNextClick() {
    this.props.setCity(this.state.city);
    this.props.navigation.dispatch({ type: 'GTM', step: 'HomeDetails' });
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
        <Content style={styles.content}>
          <Grid>
            <Row>
              <Text style={styles.headerText}>
                Where would you like to buy your home?
          </Text>
            </Row>
            <Item regular style={styles.locationInput}>
              <Input placeholder="City" onChangeText={(city) => this.setState({ city })} value={state.city} />
            </Item>
            <Row style={styles.disclaimer}>
              <Text style={styles.valueText}>
                Acme estimates house values here gain about 5% in value per year. We'll take this into consideration when calculating your investment plans.
              </Text>
            </Row>
          </Grid>
        </Content>
        <Footer>
          <Button
            style={state.city ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
            textStyles={CommonStyles.nextButtonText}
            onPress={() => this.handleNextClick()}
            disabled={!state.city}
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

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  setCity: (city) => dispatch(setCity(city)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GTMLocationScreen);