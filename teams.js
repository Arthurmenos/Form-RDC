const https = require('https');
const fs = require('fs');

// URL da API Getform
const apiUrl = 'https://api.getform.io/v1/forms/78078267-e121-497f-9b37-b6c302556ebc?token=qHuvbKeqV8mo3CoYcA7GEf7o7YZFCycdOddadYyhguZfi43e2rIAXESVGlcU';

// Fazer uma solicitação GET para a API Getform
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

            // Verifica se a pasta 'timesjson' existe, senão cria
            if (!fs.existsSync('timesjson')) {
                fs.mkdirSync('timesjson');
            }

            // Itera sobre os times
            responseData.data.submissions.forEach((time, index) => {
                // Cria um nome de arquivo baseado no nome do time
                const fileName = `timesjson/${time['time-nome']}.json`;

                // Converte o objeto do time para JSON
                const jsonData = JSON.stringify(time, null, 2);

                // Escreve os dados do time em um arquivo JSON
                fs.writeFileSync(fileName, jsonData);

                console.log(`Time ${index + 1} salvo em: ${fileName}`);
            });
        } catch (error) {
            console.error('Erro ao analisar os dados:', error);
        }
    });
}).on('error', (error) => {
    console.error('Erro ao fazer a solicitação:', error);
});
