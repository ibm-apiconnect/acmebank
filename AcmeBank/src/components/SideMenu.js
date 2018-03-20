/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, ScrollView, Image, Text, View, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { resetDemo } from '../data/actions';
import ThemeColors from './ThemeColors';
import PNGFiles from './PNGFiles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.navBackground,
    paddingTop: 20,
    flex: 1,
  },
  navItemStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: ThemeColors.white,
  },
  navSectionStyle: {
  },
  sectionHeadingStyle: {
    backgroundColor: ThemeColors.navHeaderBackground,
    color: ThemeColors.white,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 12,
  },
  headerContainer: {
    height: 100,
    padding: 20,
  },
  headerHeading: {
    color: ThemeColors.white,
    fontSize: 16,
  },
  headerText: {
    color: ThemeColors.white,
    fontSize: 12,
  },
});

class SideMenu extends Component {

  resetDemo() {
    this.props.resetDemo();
  }

  handleGitClick() {
    Linking.openURL(config.get('githubUrl'));
  }

  render() {
    let props = this.props;
    let state = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Grid>
            <Col style={{ width: 50 }}>
              <Image
                style={{ width: 60, height: 60, borderRadius: 30}}
                source={PNGFiles.rob}
              />
            </Col>
            <Col style={{ marginLeft: 20 }}>
              <Row>
                <Text style={styles.headerHeading}>Hi Rob,</Text>
              </Row>
              <Row>
                <Text style={styles.headerText}>Finance Newbie</Text>
              </Row>
              <Row>
                <Text style={styles.headerText}>Member Since 2014</Text>
              </Row>
            </Col>
          </Grid>
        </View>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              My Money
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Home' })}>
                Accounts
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Mortgage' })}>
                Mortgage
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Move Money
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Transfer' })}>
                Transfer
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'BillPay' })}>
                Pay Bills
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Deposit' })}>
                Deposit Checks
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Investments
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'My Home' })}>
                Dream Home
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Resources
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Notifications' })}>
                Notifications
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Help' })}>
                Help & Support
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => handleGitClick()}>
                GitHub
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => this.resetDemo()}>
                Reset Demo
              </Text>
            </View>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => props.navigation.dispatch({ type: 'Logout' })}>
                Log Out
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  resetDemo: () => dispatch(resetDemo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);