const User = require('./models/User.js');
const State = require('./models/State.js');
const City = require('./models/City.js');
const Publisher = require('./models/Publisher.js');
const Category = require('./models/Categories.js');
const Book = require('./models/Books.js');
const Log = require('./models/Log.js');
const Format = require('./models/Format.js');

(async () => {
    await User.sync({ force: true });
    await State.sync({ force: true });
    await City.sync({ force: true });
    await Publisher.sync({ force: true });
    await Category.sync({ force: true });
    await Format.sync({ force: true });
    await Book.sync({ force: true });
    await Log.sync({ force: true });
})();