const https = require('https');

// URL da API Getform
const apiUrl = 'https://api.getform.io/v1/forms/78078267-e121-497f-9b37-b6c302556ebc?token=qHuvbKeqV8mo3CoYcA7GEf7o7YZFCycdOddadYyhguZfi43e2rIAXESVGlcU';

// Função para fazer uma solicitação GET para a API Getform
function fetchData(callback) {
  https.get(apiUrl, (response) => {
    let data = '';

    // Receber os dados da resposta
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Quando todos os dados forem recebidos
    response.on('end', () => {
      try {
        // Parsear os dados como JSON
        const responseData = JSON.parse(data);
        callback(null, responseData);
      } catch (error) {
        callback(error, null);
      }
    });
  }).on('error', (error) => {
    callback(error, null);
  });
}

// Exportar a função fetchData
module.exports = fetchData;
