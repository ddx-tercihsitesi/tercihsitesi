const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

const usersFile = path.join(__dirname, 'users.json');
const preferencesFile = path.join(__dirname, 'preferences.json');

const loadData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`Veriler okunurken bir hata oluştu: ${filePath}`, e);
        return {};
    }
};

const saveData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Veriler başarıyla kaydedildi: ${filePath}`);
    } catch (e) {
        console.error(`Veriler kaydedilirken bir hata oluştu: ${filePath}`, e);
    }
};

app.get('/api/users', async (req, res) => {
    const users = await loadData(usersFile);
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const users = await loadData(usersFile);
    const newUser = req.body;
    const normalizedName = newUser.name.toLowerCase();
    if (users[normalizedName]) {
        return res.status(400).send('Bu isimde bir kullanıcı zaten kayıtlı.');
    }

    users[normalizedName] = {
        name: newUser.name,
        password: newUser.password,
        servicePoint: newUser.servicePoint
    };
    await saveData(usersFile, users);
    res.status(200).send("Yeni kullanıcı kaydedildi.");
});

app.put('/api/users', async (req, res) => {
    const users = await loadData(usersFile);
    const updatedUser = req.body;
    const normalizedName = updatedUser.name.toLowerCase();

    if (!users[normalizedName]) {
        return res.status(404).send('Bu isimde bir kullanıcı bulunamadı.');
    }
    if (users[normalizedName].password !== updatedUser.password) {
        return res.status(401).send("Şifre Yanlış");
    }
    users[normalizedName].servicePoint = updatedUser.servicePoint;
    await saveData(usersFile, users);
    res.status(200).send("Puan Güncellendi");
});

app.delete('/api/users', async (req, res) => {
    const users = await loadData(usersFile);
    const deleteUser = req.body;
    const normalizedName = deleteUser.name.toLowerCase();

    if (!users[normalizedName]) {
        return res.status(404).send('Bu isimde bir kullanıcı bulunamadı.');
    }

    if (users[normalizedName].password !== deleteUser.password) {
        return res.status(401).send("Şifre Yanlış");
    }

    delete users[normalizedName];
    await saveData(usersFile, users);

    const preferences = await loadData(preferencesFile);
    if (preferences[normalizedName]) {
        delete preferences[normalizedName];
        await saveData(preferencesFile, preferences);
    }
    res.status(200).send("Kullanıcı Silindi");
});

app.post('/api/preferences', async (req, res) => {
    const preferences = await loadData(preferencesFile);
    const newPreference = req.body;
    const normalizedName = newPreference.name.replace(/\s/g, '').toLowerCase();
    preferences[normalizedName] = newPreference.preferenceData;

    await saveData(preferencesFile, preferences);

    res.status(200).send(preferences[normalizedName] ? 'Tercihleriniz güncellendi!' : 'Tercihleriniz gönderildi!');
});

app.get('/api/preferences', async (req, res) => {
    const preferences = await loadData(preferencesFile);
    res.json(preferences);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});