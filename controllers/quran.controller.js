require("dotenv").config();
const { SQL_USR, SQL_PWD } = process.env;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("sq_quran", SQL_USR, SQL_PWD, {
    dialect: "mysql",
    host: "localhost",
    logging: false
});

const GET_VERSE = "SELECT Q.ID, Q.SuraID, Q.VerseID, Q.AyahText, S.Surah FROM Quran Q, Surah S WHERE Q.ID = ? AND Q.SuraID = S.SuraID"
// const GET_VERSE_FROM_SPECS = "SELECT Q.ID, Q.SuraID, Q.VerseID, Q.AyahText, S.Surah FROM Quran Q, Surah S WHERE Q.SuraID = %s AND Q.VerseID = %s AND S.SuraID = Q.SuraID"
const GET_SURAH = "SELECT S.Surah FROM Surah S WHERE S.SuraID = ?"

// Find a single Verse with an id
exports.getVerse = (req, res) => {
    const id = req.params.id;

    try {
        sequelize.authenticate();
        sequelize.query(GET_VERSE, { replacements: [id], type: sequelize.QueryTypes.SELECT }).then(([results, metadata]) => {
            if (results) {
                res.send(results);
            } else {
                res.status(404).send({
                    message: `Cannot find Verse with id=${id}.`
                });
            }
        })
            .catch(err => {
                res.status(500).send({
                    message: "Error retrieving Verse with id=" + id
                });
            });
    } catch (error) {
        console.error('Cannot connect to database:', error);
    }
};

// Find a single Sourah by id
exports.getSurah = (req, res) => {
    const id = req.params.id;

    try {
        sequelize.authenticate();
        sequelize.query(GET_SURAH, { replacements: [id], type: sequelize.QueryTypes.SELECT }).then(([results, metadata]) => {
            if (results) {
                res.send(results);
            } else {
                res.status(404).send({
                    message: `Cannot find Surah with id=${id}.`
                });
            }
        })
            .catch(err => {
                res.status(500).send({
                    message: "Error retrieving Surah with id=" + id
                });
            });
    } catch (error) {
        console.error('Cannot connect to database:', error);
    }
};


/**
 * Renvoie une valeur aléatoire entre min et max (inclus)
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Picks the random item based on its weight.
 * The items with higher weight will be picked more often (with a higher probability).
 *
 * For example:
 * - items = ['banana', 'orange', 'apple']
 * - weights = [0, 0.2, 0.8]
 * - weightedRandom(items, weights) in 80% of cases will return 'apple', in 20% of cases will return
 * 'orange' and it will never return 'banana' (because probability of picking the banana is 0%)
 *
 * @param {any[]} items
 * @param {number[]} weights
 * @returns {{item: any, index: number}}
 */
function weightedRandom(items, weights) {
    // From: https://dev.to/trekhleb/weighted-random-algorithm-in-javascript-1pdc
    if (items.length !== weights.length) {
        throw new Error('Items and weights must be of the same size');
    }

    if (!items.length) {
        throw new Error('Items must not be empty');
    }

    // Preparing the cumulative weights array.
    // For example:
    // - weights = [1, 4, 3]
    // - cumulativeWeights = [1, 5, 8]
    const cumulativeWeights = [];
    for (let i = 0; i < weights.length; i += 1) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }

    // Getting the random number in a range of [0...sum(weights)]
    // For example:
    // - weights = [1, 4, 3]
    // - maxCumulativeWeight = 8
    // - range for the random number is [0...8]
    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = maxCumulativeWeight * Math.random();

    // Picking the random item based on its weight.
    // The items with higher weight will be picked more often.
    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
            return {
                item: items[itemIndex],
                index: itemIndex,
            };
        }
    }
}

function getRandomSuwar(suraId) {
    // ToDo: génération pondérée des choix
    let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    let weights = [];
    for (let i = 1; i < 115; i++) {
        weights.push(114 - Math.abs(suraId - i)) // Génération des poids pour chaque sourah
    }
    weights[suraId - 1] = 0;


    let res = [suraId];
    while (res.length < 4) {
        // var r = randInt(1, 114);
        var r = weightedRandom(items, weights).item;
        if (!res.includes(r))
            res.push(r)
    }
    return res;
}

exports.getChoices = (req, res) => {
    const rightOneId = req.params.id;

    if (!rightOneId || rightOneId < 1 || rightOneId > 114) {
        res.status(404).send({ message: "SurahId must be between 1 and 114." });
        return;
    }

    let choiceIds = getRandomSuwar(parseInt(rightOneId));
    try {
        sequelize.authenticate();

        sequelize.query("SELECT S.Surah FROM Surah S WHERE S.SuraID IN(:choices) ", { replacements: { choices: choiceIds } }).then(([results, metadata]) => {
            results = results.sort((a, b) => 0.5 - Math.random());
            if (results.length < 4) {
                console.log("Error retrieving choices", results);
                res.status(500).send({ message: "Error retrieving choices" });
            }
            res.send(results);
        }).catch(err => {
            res.status(500).send({
                message: "Error retrieving Surah with id=" + id
            });
        });

    } catch (error) {
        console.error('Cannot connect to database:', error);
    }
}
