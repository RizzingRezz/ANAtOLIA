const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fsp = require("fs").promises;
var fs = require('fs');
const cors = require('cors');
const ini = require('ini');
const app = express();
const port = 8082;
const axios = require("axios")
var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());

// Fonction pour lire les paramètres de la base de données à partir du fichier INI
function readConfigDBFromIni() {
    const iniData = fs.readFileSync('data.ini', 'utf-8');
    const config = ini.parse(iniData);

    const dbConfig = {
        host: config.MYSQL.host,
        port: parseInt(config.MYSQL.port, 10), // Conversion du port en nombre entier
        user: config.MYSQL.user,
        password: config.MYSQL.password,
        database: config.MYSQL.database
    };

    return dbConfig;
}

const connection = mysql.createConnection(readConfigDBFromIni());

// Middleware pour parser les données en JSON
app.use(express.json());

function verifyToken(req, res, next) {
    // Récupérez le jeton à partir de l'en-tête Authorization  
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // If token is missing return 401
        return res.status(401).json({ message: 'Missing token' });
    } try {
        // Check token validity
        const decodedToken = jwt.verify(token, 'secret');
        const userId = decodedToken.user_id;
        connection.query('SELECT * FROM user_account WHERE id = ?', [userId], (error, results) => {
            if (error) {
                res.status(500).send('Erreur de connexion');
            } else {
                if (results.length > 0) {
                    const user = results[0];
                    // Check if token user matches database user
                    if (user.email === decodedToken.user_email) {
                        // Add the decoded user information to the request object
                        req.userData = { username: user.username };
                        req.user = user;
                        // pass to api    
                        next();
                    } else {
                        res.status(401).json({ message: 'Invalid token' });
                    }
                } else {
                    res.status(401).json({ message: 'Invalid token' });
                }
            }
        });
    } catch (err) {
        // Si le jeton est invalide, renvoie une erreur 401
        res.status(401).json({ message: 'Invalid token' });
    }
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM user_account WHERE email = ?', [email], (error, results) => {
        if (error) {
            res.status(500).send('Erreur de connexion');
            console.log(error)
        } else {
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.mot_de_passe, (err, result) => {
                    if (result) {
                        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        const data = {
                            user_id: user.id,
                            date: date
                        };
                        console.log(email)
                        if (!email.includes("anatolia") && !email.includes("admin") && !email.includes("christophe.giordano") && !email.includes("mohammed.chennaif")) {
                            // Insertion dans la table "connections"
                            connection.query('INSERT INTO connections SET ?', data, (error, result) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Insertion réussie dans la table "connections"');
                                }
                            });
                        }
                        const tokenPayload = {
                            user_id: user.id,
                            user_email: user.email
                        };
                        const token = jwt.sign(tokenPayload, 'secret', { expiresIn: '15m' });
                        res.status(200).json({ success: true, right: user.downloadable, token: token });
                    } else {
                        res.status(401).send('Email ou mot de passe invalide');
                    }
                });
            } else {
                res.status(401).send('Email ou mot de passe invalide');
            }
        }
    });
});

// app.post('/register', (req, res) => {
//     const { email, password, downloadable } = req.body;

//     // Vérifiez si l'utilisateur existe déjà dans la base de données
//     connection.query('SELECT * FROM user_account WHERE email = ?', [email], (error, results) => {
//         if (error) {
//             res.status(500).send('Erreur de connexion');
//         } else {
//             if (results.length > 0) {
//                 // L'utilisateur existe déjà, renvoyez une réponse appropriée
//                 res.status(409).send('L\'utilisateur existe déjà');
//             } else {
//                 // L'utilisateur n'existe pas, nous pouvons l'ajouter
//                 // Cryptez le mot de passe avec bcrypt
//                 bcrypt.hash(password, 10, (err, hashedPassword) => {
//                     if (err) {
//                         res.status(500).send('Erreur de cryptage du mot de passe');
//                     } else {
//                         const userData = {
//                             email: email,
//                             mot_de_passe: hashedPassword,
//                             downloadable: downloadable
//                         };

//                         // Insérez l'utilisateur dans la base de données
//                         connection.query('INSERT INTO user_account SET ?', userData, (error, result) => {
//                             if (error) {
//                                 res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
//                             } else {
//                                 res.status(201).send('Utilisateur enregistré avec succès');
//                             }
//                         });
//                     }
//                 });
//             }
//         }
//     });
// });

app.get('/islogged', verifyToken, (req, res) => {
    const user = req.user;
    const token = jwt.sign({ user_id: user.id, user_email: user.email, rights: user.downloadable }, 'secret', { expiresIn: '15m' });
    res.status(200).json({ success: true, right: user.downloadable, user: user.email, token: token });
});


app.put('/update', verifyToken, (req, res) => {
    console.log(req.body.email)
    console.log(req.body.downloadable)
    const emails = req.body.email;
    const downloadables = req.body.downloadable;

    if (emails.length !== downloadables.length) {
        return res.status(400).send('The number of emails and downloadables should be the same.');
    }

    const query = 'UPDATE user_account SET downloadable = ? WHERE email = ?';

    emails.forEach((email, index) => {
        connection.query(query, [downloadables[index], email], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while updating the user accounts.');
            }
        });
    });

    res.status(200).send('User accounts updated successfully.');
});

app.get('/getRight', verifyToken, (req, res) => {
    const query = "SELECT email, downloadable FROM user_account";
    connection.query(query, (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });

});


app.get('/getHistory', verifyToken, (req, res) => {
    const query = "SELECT * FROM vue_connections ORDER BY date DESC";
    connection.query(query, (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log('Server Works !!! At port %d', port);
    connection.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données : ', err);
        } else {
            console.log('Connecté à la base de données MySQL');
        }
    });
});

function formatDate(date) {
    date = date.split("/");
    var formatedDate = new Date(Date.UTC(date[0], parseInt(date[1]) - 1, date[2]));  // -1 because months are from 0 to 11  
    return formatedDate
}

function formatSubFolder(date) {
    date = date.replaceAll("/", "")
    date = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1$2');
    date = parseInt(date)
    return date
}

function cimelDate(date) {
    date = new Date(Date.UTC(date.slice(6, 10), parseInt(date.slice(3, 5)) - 1, date.slice(0, 2)));
    return date
}

// function levDate(date) {
//     date = "20" + date;
//     date = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$3$2$1');
//     date = new Date(Date.UTC(date.slice(4, 8), parseInt(date.slice(2, 4)) - 1, date.slice(0, 2)));
//     return date
// }

function ReuniwattDate(date) {
    date = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$3$2$1');
    date = new Date(Date.UTC(date.slice(4, 8), parseInt(date.slice(2, 4)) - 1, date.slice(0, 2)));
    return date
}

async function ics(req) {
    const directory = "/var/www/anatolia-data/downloads/ICS";
    const { files, site, from, to } = req.query;
    const fileFound = [];

    const fromUTC = new Date(Date.UTC(from.slice(0, 4), from.slice(5, 7) - 1, from.slice(8, 10)));
    const toUTC = new Date(Date.UTC(to.slice(0, 4), to.slice(5, 7) - 1, to.slice(8, 10)));
    let siteFolders = [];

    if (site === "all") {
        siteFolders = await fsp.readdir(directory);
    } else if (fs.existsSync(`${directory}/${site}`)) {
        siteFolders.push(site);
    } else {
        return fileFound;
    }

    for (const folder of siteFolders) {
        const filesInFolder = await fsp.readdir(`${directory}/${folder}`);
        for (const item of filesInFolder) {
            if ((item.includes("GDIMM") && files.includes("GDIMM")) || (item.includes("PBL") && files.includes("PBL"))) {
                const itemDate = item.slice((item.includes("GDIMM") ? 6 : 4)).split("-");
                const check = new Date(Date.UTC(itemDate[0], parseInt(itemDate[1]) - 1, itemDate[2]));
                if (check >= fromUTC && check <= toUTC) {
                    const subDirectory = (item.includes("GDIMM")) ? `${directory}/${folder}/${item}/GDIMM_DATA_${item.slice(-10)}` : `${directory}/${folder}/${item}`;
                    const subFiles = await fsp.readdir(subDirectory);
                    for (const value of subFiles) {
                        if ((value.includes("r0") && item.includes("GDIMM")) || (value.includes(".csv") && item.includes("PBL"))) {
                            fileFound.push(`/data/ICS/${folder}/${item}${item.includes("GDIMM") ? `/GDIMM_DATA_${itemDate.join("-")}` : ""}/${value}`);
                        }
                    };
                }
            }
        };
    };
    return fileFound
};

async function reuniwatt(req) {
    const directory = "/var/www/anatolia-data/downloads/ISKY";
    const fileFound = [];
    const from = formatDate(req.query.from);
    const to = formatDate(req.query.to);
    const fromSubFolder = formatSubFolder(req.query.from);
    const toSubFolder = formatSubFolder(req.query.to);

    const site = await fsp.readdir(directory);
    for (const folder of site) {
        if (req.query.site !== "all" && req.query.site !== folder) {
            continue;
        }

        const files = await fsp.readdir(`${directory}/${folder}`);
        for (const item of files) {
            const checkFolder = parseInt(item.replace("_", ""));
            if (checkFolder < fromSubFolder || checkFolder > toSubFolder) {
                continue;
            }

            const subfiles = await fsp.readdir(`${directory}/${folder}/${item}`);
            for (const value of subfiles) {
                const check = new Date(Date.UTC(value.slice(-12, -8), parseInt(value.slice(-8, -6)) - 1, value.slice(-6, -4)));
                if (check < from || check > to) {
                    continue;
                }

                if (value.includes("cloudCover") && req.query.files.includes("Cloud cover")) {
                    fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                    console.log(`/data/ISKY/${folder}/${item}/${value}`)
                } else if (value.includes("GHICover") && req.query.files.includes("GHI")) {
                    fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                    console.log(`/data/ISKY/${folder}/${item}/${value}`)
                } else if (value.includes("skyimager") && req.query.files.includes("Allsky Data")) {
                    fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                    console.log(`/data/ISKY/${folder}/${item}/${value}`)
                }
            };
        };
    };
    return fileFound
};

async function reuniwattImage(req) {
    const directory = "/var/www/anatolia-data/downloads/ISKY";
    const fileFound = [];
    const from = formatDate(req.query.from);
    const to = formatDate(req.query.to);

    const site = await fsp.readdir(directory);
    for (const folder of site) {
        if (req.query.site !== "all" && req.query.site !== folder) {
            continue;
        }

        const folders = await fsp.readdir(`${directory}/${folder}`);
        for (const item of folders) {
            if (item.includes("COD_16bit") && req.query.files.includes("COD 16bit")) {
                const imageFolder = await fsp.readdir(`${directory}/${folder}/${item}`);
                for (const value of imageFolder) {
                    let checkDate = ReuniwattDate(value);
                    if (checkDate && checkDate >= from && checkDate <= to) {
                        fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                        console.log(`/data/ISKY/${folder}/${item}/${value}`)
                    }
                }
            } else if (item.includes("cloudview") && req.query.files.includes("Cloudview")) {
                const imageFolder = await fsp.readdir(`${directory}/${folder}/${item}`);
                for (const value of imageFolder) {
                    let checkDate = ReuniwattDate(value);
                    if (checkDate && checkDate >= from && checkDate <= to) {
                        fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                        console.log(`/data/ISKY/${folder}/${item}/${value}`)
                    }
                }
            } else if (item.includes("cloud_cover_8bit") && req.query.files.includes("CloudCover 8bit")) {
                const imageFolder = await fsp.readdir(`${directory}/${folder}/${item}`);
                for (const value of imageFolder) {
                    let checkDate = ReuniwattDate(value);
                    if (checkDate && checkDate >= from && checkDate <= to) {
                        fileFound.push(`/data/ISKY/${folder}/${item}/${value}`);
                        console.log(`/data/ISKY/${folder}/${item}/${value}`)
                    }
                }
            }
        }
    }

    return fileFound;
}

async function cimel(req) {
    const directory = "/var/www/anatolia-data/downloads/CIMEL";
    const fileFound = [];
    const { files, from, to, site } = req.query;

    const fromFormatted = formatDate(from);
    const toFormatted = formatDate(to);
    const fromSubFolder = formatSubFolder(from);
    const toSubFolder = formatSubFolder(to);

    // const siteFolders = site === "all" ? await fsp.readdir(directory) : [site];
    let siteFolders = [];

    if (site === "all") {
        siteFolders = await fsp.readdir(directory);
    } else if (fs.existsSync(`${directory}/${site}`)) {
        siteFolders.push(site);
    } else {
        return fileFound;
    }

    for (const siteFolder of siteFolders) {
        const filesRead = await fsp.readdir(`${directory}/${siteFolder}`);

        for (const item of filesRead) {
            const checkFolder = parseInt(item.replace("_", ""));
            if (checkFolder >= fromSubFolder && checkFolder <= toSubFolder) {
                const subfiles = await fsp.readdir(`${directory}/${siteFolder}/${item}`);

                for (const subfile of subfiles) {
                    if (subfile.includes(".lev") && files.includes("Level")) {
                        const checkBegin = cimelDate(subfile.slice(0, 10));
                        const checkEnd = cimelDate(subfile.slice(11, 21));
                        if (checkBegin >= fromFormatted && checkEnd <= toFormatted) {
                            fileFound.push(`/data/CIMEL/${siteFolder}/${item}/${subfile}`);
                            console.log(`/data/CIMEL/${siteFolder}/${item}/${subfile}`)
                        }
                    } else if (subfile.includes(".alm") && files.includes("Almucantar Data")) {
                        const checkBegin = cimelDate(subfile.slice(-25, -15));
                        const checkEnd = cimelDate(subfile.slice(-14, -4));
                        if (checkBegin >= fromFormatted && checkEnd <= toFormatted) {
                            fileFound.push(`/data/CIMEL/${siteFolder}/${item}/${subfile}`);
                            console.log(`/data/CIMEL/${siteFolder}/${item}/${subfile}`)
                        }
                    }
                };
            }
        };
    };
    return fileFound
};

async function cimelK8(req) {
    const directory = "/var/www/anatolia-data/downloads/CIMEL/";
    const { from, to, site } = req.query;
    const fileFound = [];
    const fromFormatted = formatDate(from);
    const toFormatted = formatDate(to);
    let siteFolders = [];

    if (site === "all") {
        siteFolders = await fsp.readdir(directory);
    } else if (fs.existsSync(`${directory}/${site}`)) {
        siteFolders.push(site);
    } else {
        return fileFound;
    }

    for (const siteFolder of siteFolders) {
        const filesRead = await fsp.readdir(`${directory}/${siteFolder}/k8Folder`);

        for (const item of filesRead) {
            let fileDate = ""; // Déclaration de la variable fileDate en tant que variable locale

            var regex = /(\d{6})\.k8$/;
            var match = regex.exec(item);

            if (match) {
                fileDate = levDate(match[1]);
            }

            if (fileDate >= fromFormatted && fileDate <= toFormatted) {
                console.log(`/data/CIMEL/${siteFolder}/k8Folder/${item}`)
                fileFound.push(`/data/CIMEL/${siteFolder}/k8Folder/${item}`);
            }
        };
    };
    return fileFound
}

async function weather(req) {
    const directory = "/var/www/anatolia-data/downloads/WEATHER";
    const from = formatDate(req.query.from);
    const to = formatDate(req.query.to);
    const fromSubFolder = formatSubFolder(req.query.from);
    const toSubFolder = formatSubFolder(req.query.to);
    const site = await fsp.readdir(directory);
    let fileFound = [];
    for (const folder of site) {
        if (req.query.site !== folder && req.query.site !== "all") {
            continue;
        }
        const files = await fsp.readdir(`${directory}/${folder}`);
        for (const item of files) {
            const checkFolder = parseInt(item.replace("-", ""));
            if (checkFolder < fromSubFolder || checkFolder > toSubFolder) {
                continue;
            }
            const subfile = await fsp.readdir(`${directory}/${folder}/${item}`);
            for (const value of subfile) {
                const check = new Date(value.slice(12, 22));
                if (check < from || check > to) {
                    continue;
                }
                console.log(`/data/WEATHER/${folder}/${item}/${value}`)
                fileFound.push(`/data/WEATHER/${folder}/${item}/${value}`);
            };
        };
    };
    return fileFound
};

app.get('/downloads', verifyToken, async (req, res) => {
    let fileFound = []

    const { files, from, to, site, name } = req.query;
    let date = from + "_" + to
    date = date.replaceAll("/", "-")
    let zip_path = "/data/folder_website/" + name.split("@")[0] + "_" + site + "_" + date + ".zip"
    console.log(files)
    if (files && from && to && site) {
        const promises = [];
        if (files.includes("GDIMM") || files.includes("PBL")) {
            promises.push(ics(req))
        }
        if (files.includes("Almucantar Data") || files.includes("Level")) {
            promises.push(cimel(req))
        }
        if (files.includes("K8 File")) {
            promises.push(cimelK8(req))
        }
        if (files.includes("Cloud cover") || files.includes("GHI") || files.includes("Allsky Data")) {
            promises.push(reuniwatt(req))
        }
        if (files.includes("Ground Weather")) {
            promises.push(weather(req))
        }
        if (files.includes("COD 16bit") || files.includes("Cloudview") || files.includes("CloudCover 8bit")) {
            promises.push(reuniwattImage(req))
        }
        fileFound = await Promise.all(promises);
        fileFound = fileFound.flat();
    }
    console.log(fileFound)
    if (fileFound.length !== 0) {
        const data = {
            fileFound: fileFound,
            zip_path: zip_path,
            recipient: name
        }
        // await createZip("./downloads", fileFound, res, date);
        axios.post("http://srv-anatolia1.oca.eu:3000/thread", data)
            .then(response => {
                console.log('Réponse du serveur:', response.data);
                res.status(200).json({ fileFound });
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    } else {
        res.status(200).json({ fileFound });
    }

});
