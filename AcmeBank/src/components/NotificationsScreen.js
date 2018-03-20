/**
Copyright 2018 IBM
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import { Body, Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { fetchNotifications, ackNotification, setDocument } from '../data/actions';
import ThemeColors from './ThemeColors';
import CommonStyles from './CommonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    backgroundColor: ThemeColors.white,
    marginBottom: 2,
    padding: 10,
  },
  notificationDescription: {
    fontSize: 12,
    marginTop: 5,
  },
  notificationId: {
    fontSize: 10,
    marginLeft: 20,
  },
  notificationUnread: {
    fontWeight: 'bold',
  },
  notificationTimestamp: {
    fontSize: 10,
  },
  inboxHeading: {
    justifyContent: 'center',
    margin: 10,
  },
});

class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.formatTime = (time) => moment(time).format('MM/DD');

    this.handleNotification = (notification) => {
      this.props.ackNotification(props.customerInfo.id, notification.id);
      if (notification.type === 'document') {
        this.getDocumentDetails(notification.documentId);
      }
    };

    props.fetchNotifications(props.customerInfo.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  getDocumentDetails(documentId) {
    this.props.setDocument(documentId);
    this.props.navigation.dispatch({ type: 'DocumentViewer' });
  }

  static navigationOptions = {
    header: null,
  };

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
            <Title>Notifications</Title>
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
        <Content>
          <Grid>
            <Row style={styles.inboxHeading}>
              <Text>
                Inbox
                </Text>
            </Row>
          </Grid>
          {props.notifications && props.notifications.length ?
            <Grid>
              {props.notifications && props.notifications.map(notification => (
                <Row key={notification.id} style={styles.notification} onPress={() => this.handleNotification(notification)}>
                  <Grid>
                    <Row>
                      <Col>
                        <Text style={notification.unread ? [styles.notificationTitle, styles.notificationUnread] : styles.notificationTitle}>
                          {notification.title}
                        </Text>
                      </Col>
                      <Col style={{ width: 30 }}>
                        <Text style={styles.notificationTimestamp}>
                          {this.formatTime(notification.timestamp)}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Text style={styles.notificationDescription}>
                        {notification.description}
                      </Text>
                    </Row>

                  </Grid>
                </Row>
              ))}
            </Grid> :
            <Grid>
              <Row>
                <Text style={{ marginTop: 20, marginLeft: 20 }}>
                  You currently have no notifications.
                </Text>
              </Row>
              <Row>
                <Text style={{ marginTop: 20, marginLeft: 20 }}>
                  Please check back later.
                </Text>
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
    customerInfo: state.customerData.info,
    account: state.customerData.account,
    transactions: state.customerData.transactions,
    notifications: state.customerData.notifications,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchNotifications: (customerId) => dispatch(fetchNotifications(customerId)),
  ackNotification: (customerId, notificationId) => dispatch(ackNotification(customerId, notificationId)),
  fetchDocument: documentId => dispatch(fetchDocument(documentId)),
  setDocument: documentId => dispatch(setDocument(documentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);