require("dotenv").config();
const { SQL_USR, SQL_PWD } = process.env;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("sq_quran", SQL_USR, SQL_PWD, {
    dialect: "mysql",
    host: "localhost"
});

const GET_VERSE = "SELECT Q.ID, Q.SuraID, Q.VerseID, Q.AyahText, S.Surah FROM Quran Q, Surah S WHERE Q.ID = ? AND Q.SuraID = S.SuraID"
const GET_VERSE_FROM_SPECS = "SELECT Q.ID, Q.SuraID, Q.VerseID, Q.AyahText, S.Surah FROM Quran Q, Surah S WHERE Q.SuraID = %s AND Q.VerseID = %s AND S.SuraID = Q.SuraID"


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

function randInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function getRandomSuwar(suraId) {
    let res = [suraId];
    /* ToDo: génération pondérée des choix
    // list_s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]
    // dist = []
    // for i in range(1, 115):
    // dist.append(114 - abs(suraID - i))
    // dist[suraID-1] = 0
    // return random.choices(list_s, weights=dist, k=3)
    */
    while (res.length < 4) {
       var r = randInt(1, 114);
       if (!res.includes(r))
        res.push(r)
   }
   return res
}

exports.getChoices = (req, res) => {
    const rightOneId = req.params.id;
    
    if (!rightOneId || rightOneId < 1 || rightOneId > 114) {
        res.status(404).send({message: "SurahId must be between 1 and 114."});
        return;
    }

    let choiceIds = getRandomSuwar(rightOneId);
    try {
        sequelize.authenticate();

        sequelize.query("SELECT S.Surah FROM Surah S WHERE S.SuraID IN(:choices) ", { replacements: {choices: choiceIds}}).then(([results, metadata]) => {    
            results = results.sort((a, b) => 0.5 - Math.random());
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
