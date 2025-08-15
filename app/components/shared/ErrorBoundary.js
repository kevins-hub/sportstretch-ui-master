import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to crash analytics if available
    // You can integrate with services like Sentry, Bugsnag, etc.
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    Alert.alert(
      'Report Error',
      'Would you like to report this error to help improve the app?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            // Here you would send the error to your logging service
            console.log('Error reported:', error, errorInfo);
            Alert.alert('Thank you', 'Error report has been sent.');
          }
        }
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try restarting the app.
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.reportButton]} 
            onPress={this.handleReportError}
          >
            <Text style={styles.buttonText}>Report Error</Text>
          </TouchableOpacity>

          {__DEV__ && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorText}>Error: {this.state.error?.toString()}</Text>
              <Text style={styles.errorText}>Stack: {this.state.errorInfo?.componentStack}</Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
  },
  reportButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetails: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: 5,
  },
});

export default ErrorBoundary;
