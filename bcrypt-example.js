const bcrypt = require('bcrypt');


const salt1 = bcrypt.genSaltSync(10);

const encryptedPass1 = bcrypt.hashSync('swordfish', salt1);

console.log('     salt  : ' + salt1);
console.log('swordfish -> ' + encryptedPass1);

console.log(
  bcrypt.compareSync('swordfish', encryptedPass1)
);


console.log('');


const salt2 = bcrypt.genSaltSync(10);

const encryptedPass2 = bcrypt.hashSync('blah', salt2);

console.log('salt       : ' + salt2);
console.log('blah      -> ' + encryptedPass2);

console.log(
  bcrypt.compareSync('blah', encryptedPass2)
);
