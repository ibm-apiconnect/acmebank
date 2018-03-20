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
import { StyleSheet, WebView } from 'react-native';
import { Body, Container, Content, Text, Button, Footer, Form, Header, Icon, Input, Item, Left, Right, StyleProvider, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import ExpoPixi from 'expo-pixi';
import { signDocument, fetchDocument } from '../data/actions';
import ThemeColors from './ThemeColors';
import CommonStyles from './CommonStyles';

const styles = StyleSheet.create({
  documentMetadata: {
    backgroundColor: ThemeColors.white,
    padding: 10,
  },
  documentMetadataText: {
    fontSize: 14,
    marginLeft: 20,
  },
  documentMetadataSpacer: {
    marginTop: 5,
  },
  documentViewer: {
    height: 490, 
    marginTop: 10,
  },
  signatureBlock: {
    height: 60,
    width: '90%',
    marginVertical: 5,
    marginHorizontal: '5%',
    backgroundColor: ThemeColors.white,
    borderColor: ThemeColors.black,
    borderWidth: 2,
  },
  successSection: {
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: ThemeColors.white,
  },
  successText: {
    margin: 25,
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
    fontSize: 20,
  },
});

class DocumentViewerScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      signaturePresent: false,
    };
  }

  componentDidMount() {
    this.props.fetchDocument(this.props.document.id);
    this.setState({
      signaturePresent: false,
    });
  }

  handleSignature() {
    this.setState({
      signaturePresent: true,
    });
  }

  handleSigningDocument(document) {
    this.props.signDocument(document.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.document.id !== nextProps.document.id) {
      this.props.fetchDocument(props.document.id);
    }
    this.setState(nextProps);
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
            <Title>Documents</Title>
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
        <Content scrollEnabled={false}>
          <Grid>
            { props.document.doc &&props.document &&
              <Grid>
                <Grid style={styles.documentMetadata}>
                  <Row>
                    <Text style={styles.documentMetadataText}>
                      From: Acme Bank
                    </Text>
                  </Row>
                  <Row>
                    <Text style={[styles.documentMetadataText, styles.documentMetadataSpacer]}>
                      Subject: {props.document.doc && props.document.doc.title}
                    </Text>
                  </Row>
                </Grid>
                {props.document.doc && props.document.doc.signDate &&
                  <Row style={styles.successSection}>
                    <Text style={styles.successText}>
                      Thanks for signing. We'll get to work right away.
                    </Text>
                  </Row>
                }
                {props.document.doc && !props.document.doc.signDate &&
                  <Row>
                      <WebView
                        source={{ uri: props.document.doc.url }}
                        style={styles.documentViewer}
                      />
                    </Row>
                }
                {props.document.doc && !props.document.doc.signDate &&
                  <Row>
                      <ExpoPixi.Sketch
                        style={styles.signatureBlock}
                        strokeWidth={4}
                        strokeAlpha={1}
                        onChange={() => this.handleSignature()}
                      />
                    </Row>
                }
              </Grid>
            }
          </Grid>
        </Content>
        {props.document && props.document.doc && !props.document.doc.signDate &&
          <Footer>
            <Button
              style={state.signaturePresent ? CommonStyles.nextButton : CommonStyles.nextButtonDisabled}
              textStyles={CommonStyles.nextButtonText}
              disabled={!state.signaturePresent}
              onPress={() => this.handleSigningDocument(props.document.doc)}
            >
              <Text>
                SIGN DOCUMENT
              </Text>
            </Button>
          </Footer>
        }
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
    document: state.documentData,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: 'Logout' }),
  fetchDocument: documentId => dispatch(fetchDocument(documentId)),
  signDocument: (documentId) => dispatch(signDocument(documentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentViewerScreen);