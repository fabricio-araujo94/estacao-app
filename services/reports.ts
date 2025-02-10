import * as Print from 'expo-print'

const generatePDF = async (data: any) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Relatório de Dados</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Temperatura</th>
              <th>Umidade</th>
              <th>Pressão</th>
              <th>Chuva</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item: any) => `
              <tr>
                <td>${item.timestamp}</td>
                <td>${item.temperature}°C</td>
                <td>${item.humidity}%</td>
                <td>${item.pressure} hPa</td>
                <td>${item.rain}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html: htmlContent });

  console.log('PDF gerado em:', uri);
};

export { generatePDF }
