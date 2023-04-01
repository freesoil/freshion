// Replace these with your own API key, client ID, and client secret
const apiKey = 'dummy';
const clientId = 'dummy';
const clientSecret = 'dummy';
const sheetId = 'dummy';

async function handleSubmit(event) {
    event.preventDefault();

    // Get form data and construct JSON object
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const quantity = sessionStorage.getItem('quantity');
    const deliveryOption = sessionStorage.getItem('deliveryOption');
    const rowData = [name, email, address, quantity, deliveryOption];

    // Authenticate and write data to Google Sheet
    try {
        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/A1:append?valueInputOption=RAW&key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (await authenticate()).access_token,
            },
            body: JSON.stringify({
                'range': 'Sheet1!A1',
                'majorDimension': 'ROWS',
                'values': [rowData],
            }),
        });

        if (response.ok) {
            console.log('Data submitted successfully');
        } else {
            console.error('Error submitting data:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting data:', error);
    }
}

async function authenticate() {
    const tokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('scope', 'https://www.googleapis.com/auth/spreadsheets');

    const response = await fetch(tokenUrl, {
        method: 'POST',
        body: formData,
    });

    return response.json();
}

