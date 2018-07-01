import React from 'react';
import './App.css';
import Chat from '../containers/Chat/Chat.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1abc9c',
      light: '#1abc9c',
      dark: 'grey',      
    },
    secondary: {
      main: '#1abc9c',
      dark: 'green',      
    },
    action: {
      disabledBackground: 'rgba(0, 29, 0, 0.1)'
    }
  },
});

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <div className="content">
          <Chat />
        </div>
        <Footer />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
