const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Handle POST requests to save form data
app.post('/save-form-data', (req, res) => {
  console.log('Request received');

  const formData = req.body;

  let existingData = [];
  try {
    // Attempt to read existing data from the JSON file
    existingData = JSON.parse(fs.readFileSync('form-data.json', 'utf8'));
  } catch (error) {
    // If the file doesn't exist or is invalid JSON, create an empty array
    existingData = [];
  }

  // Add the new form data to the existing data
  existingData.push(formData);

  // Write the updated data back to the JSON file
  fs.writeFileSync('form-data.json', JSON.stringify(existingData));

  res.status(200).json({ message: 'Form data saved successfully.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
