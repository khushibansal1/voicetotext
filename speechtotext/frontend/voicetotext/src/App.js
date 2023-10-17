// App.js
import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListening: false,
      transcribedText: '',
      recognizedField: '', // Track the currently recognized field
      fields: {
        firstName: '',
        lastName: '',
        state: '',
        district: '',
        village: '',
        panNumber: '',
        aadhaarNumber: '',
      },
    };
    this.recognition = null;
  }

  initSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.setState({ transcribedText: text });

      // Check if recognized speech matches any of the fields
      if (this.state.recognizedField) {
        const fieldToUpdate = this.state.recognizedField;
        this.updateInputField(fieldToUpdate, text);
        this.setState({ recognizedField: '' }); // Reset recognized field
      }
    };
    return recognition;
  };

  startListening = (fieldName) => {
    this.recognition = this.initSpeechRecognition();
    this.setState({ recognizedField: fieldName });
    this.recognition.start();
  };

  stopListening = () => {
    if (this.recognition) {
      this.recognition.stop();
      this.setState({ isListening: false, recognizedField: '' });
    }
  };

  updateInputField = (fieldName, value) => {
    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        [fieldName]: value,
      },
    }));
  };

  handleSubmit = () => {
    console.log('Submit button clicked');

    const formData = {
      firstName: this.state.fields.firstName,
      lastName: this.state.fields.lastName,
      state: this.state.fields.state,
      district: this.state.fields.district,
      village: this.state.fields.village,
      panNumber: this.state.fields.panNumber,
      aadhaarNumber: this.state.fields.aadhaarNumber,
    };
  
    console.log('Form Data:', formData);
  
    axios
      .post('http://localhost:3000/save-form-data', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  
  render() {
    return (
      <div className="App">
        <h1>Voice-to-Text Form</h1>
        <div className="form">
          {Object.keys(this.state.fields).map((fieldName) => (
            <div key={fieldName} className="input-group">
              <input
                type="text"
                name={fieldName}
                placeholder={fieldName}
                value={this.state.fields[fieldName]}
                onChange={this.handleInputChange}
              />
              {this.state.recognizedField === fieldName ? (
                <button onClick={this.stopListening}>Stop</button>
              ) : (
                <button onClick={() => this.startListening(fieldName)}>
  speek
</button>
              )}
            </div>
          ))}
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }
  
}

export default App;
