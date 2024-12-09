const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',    
    password: 'omega0909#',  
    database: 'info',         
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados:', err);
        process.exit(1); 
    } else {
        console.log('Conexão com o banco de dados estabelecida.');
    }
});

module.exports = connection;