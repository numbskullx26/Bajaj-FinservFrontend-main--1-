import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = input.split(/[\s,]+/).filter(item => item);
    
    // Update the URL to your live backend on Render
    axios.post('https://bajaj-finservbackend.onrender.com/bfhl', { data, file_b64: fileBase64 })
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result.split(',')[1]); 
    };
    reader.readAsDataURL(file);
  };

  const handleSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedOptions(selectedOptions);
  };

  return (
    <div className="container">
      <h1>Roll Number: ABCD123</h1>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={input} 
          onChange={(event) => setInput(event.target.value)} 
          placeholder="Enter data (e.g., A, B, 1, 2)"
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div>
          <h3>Multi Filter</h3>
          <select multiple value={selectedOptions} onChange={handleSelect}>
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
          </select>

          <h3>Filtered Response</h3>
          <ul>
            {selectedOptions.includes('alphabets') && (
              <li>Alphabets: {response.alphabets.join(', ')}</li>
            )}
            {selectedOptions.includes('numbers') && (
              <li>Numbers: {response.numbers.join(', ')}</li>
            )}
            {selectedOptions.includes('highest_lowercase_alphabet') && (
              <li>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet[0]}</li>
            )}
          </ul>

          <h3>File Details:</h3>
          <ul>
            <li>File Valid: {response.file_valid ? 'Yes' : 'No'}</li>
            <li>MIME Type: {response.file_mime_type}</li>
            <li>File Size (KB): {response.file_size_kb}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
