const db = require('./db');
const bcrypt = require('bcryptjs');


const techPass = bcrypt.hashSync('tech123', 8);
const dentPass = bcrypt.hashSync('dent123', 8);


const insert = (email, pass, role) => {
db.run(`INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`, [email, pass, role]);
};


insert('tech@oralvis.com', techPass, 'Technician');
insert('dent@oralvis.com', dentPass, 'Dentist');


console.log('Seeded users: tech@oralvis.com / tech123 and dent@oralvis.com / dent123');