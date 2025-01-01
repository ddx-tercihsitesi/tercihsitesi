document.addEventListener('DOMContentLoaded', () => {

    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const servicePointInput = document.getElementById('servicePoint');

    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const updatePointBtn = document.getElementById('updatePointBtn');
    const deleteUserBtn = document.getElementById('deleteUserBtn');

    const userMessage = document.getElementById('userMessage');

    const munhallerDiv = document.getElementById('munhaller-div');
    const personNameInput = document.getElementById('personName');
    const personServicePointInput = document.getElementById('personServicePoint');

    const munhallerList = document.getElementById('munhaller-list');
    const sendPreferencesBtn = document.getElementById('sendPreferencesBtn');
    const clearAllPreferencesBtn = document.getElementById('clearAllPreferencesBtn');

    const reviewList = document.getElementById('review-list');
    const updateViewBtn = document.getElementById('updateViewBtn');

    let loggedInUserName = null;
    let loggedInUserPoint = null;
    let selectedRadioButtons = {};

    const munhaller = [
       "ANKARA BEYPAZARI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ANKARA NALLIHAN TOPLUM SAĞLIĞI MERKEZİ",
        "ANKARA ŞEREFLİKOÇHİSAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ANTALYA ELMALI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ANTALYA KAŞ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ANTALYA MANAVGAT İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "AYDIN DİDİM İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "AYDIN KÖŞK TOPLUM SAĞLIĞI MERKEZİ",
        "AYDIN KUŞADASI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR ALTIEYLÜL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR BANDIRMA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR BİGADİÇ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR BURHANİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR DURSUNBEY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BALIKESİR EDREMİT İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BİLECİK MERKEZ TOPLUM SAĞLIĞI MERKEZİ",
        "BURDUR ÇELTİKÇİ ŞEHİT ALİ TEKİN TOPLUM SAĞLIĞI MERKEZİ",
        "BURDUR KEMER TOPLUM SAĞLIĞI MERKEZİ",
        "BURSA GEMLİK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BURSA İNEGÖL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BURSA ORHANELİ TOPLUM SAĞLIĞI MERKEZİ",
        "BURSA ORHANGAZİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "BURSA OSMANGAZİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "DENİZLİ ACIPAYAM İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "DENİZLİ BEKİLLİ TOPLUM SAĞLIĞI MERKEZİ",
        "DENİZLİ ÇAL TOPLUM SAĞLIĞI MERKEZİ",
        "DENİZLİ KALE TOPLUM SAĞLIĞI MERKEZİ",
        "DENİZLİ PAMUKKALE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "DÜZCE CUMAYERİ TOPLUM SAĞLIĞI MERKEZİ",
        "DÜZCE GÖLYAKA TOPLUM SAĞLIĞI MERKEZİ",
        "DÜZCE KAYNAŞLI TOPLUM SAĞLIĞI MERKEZİ",
        "ELAZIĞ SİVRİCE TOPLUM SAĞLIĞI MERKEZİ",
        "ERZİNCAN İLİÇ İLÇE DEVLET HASTANESİ",
        "ERZİNCAN REFAHİYE DR. FAHRETTİN UĞUR İLÇE DEVLET HASTANESİ",
        "ESKİŞEHİR SARICAKAYA TOPLUM SAĞLIĞI MERKEZİ",
        "ESKİŞEHİR SEYİTGAZİ TOPLUM SAĞLIĞI MERKEZİ",
        "ESKİŞEHİR TEPEBAŞI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "GAZİANTEP NİZİP İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "GAZİANTEP ŞAHİNBEY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "GİRESUN DOĞANKENT TOPLUM SAĞLIĞI MERKEZİ",
        "GİRESUN ESPİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "GİRESUN TİREBOLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY ALTINÖZÜ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY ARSUZ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY DEFNE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY DÖRTYOL İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY İSKENDERUN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "HATAY YAYLADAĞI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL AVCILAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL BAYRAMPAŞA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL BEYLİKDÜZÜ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL BÜYÜKÇEKMECE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL ÇEKMEKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL EYÜPSULTAN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL FATİH İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL GÜNGÖREN İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL KADIKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL KAĞITHANE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL SANCAKTEPE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL SULTANBEYLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL TUZLA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL ÜMRANİYE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İSTANBUL ÜSKÜDAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "İZMİR DİKİLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "KAYSERİ SARIOĞLAN TOPLUM SAĞLIĞI MERKEZİ",
        "KAYSERİ YAHYALI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MANİSA ALAŞEHİR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MANİSA GÖLMARMARA TOPLUM SAĞLIĞI MERKEZİ",
        "MANİSA TURGUTLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MERSİN ANAMUR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MERSİN SİLİFKE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MERSİN TARSUS İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "MERSİN TOROSLAR İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ORDU ÇAMAŞ TOPLUM SAĞLIĞI MERKEZİ",
        "ORDU ÇATALPINAR JANDARMA ER ŞÜKRÜ GELİR TOPLUM SAĞLIĞI MERKEZİ",
        "ORDU GÜLYALI TOPLUM SAĞLIĞI MERKEZİ",
        "SAKARYA GEYVE İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "SAKARYA HENDEK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "SAKARYA KARAPÜRÇEK TOPLUM SAĞLIĞI MERKEZİ",
        "SAKARYA KARASU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
         "SAKARYA KOCAALİ TOPLUM SAĞLIĞI MERKEZİ",
        "SAKARYA SÖĞÜTLÜ TOPLUM SAĞLIĞI MERKEZİ",
        "SAMSUN ASARCIK TOPLUM SAĞLIĞI MERKEZİ",
        "SAMSUN SALIPAZARI TOPLUM SAĞLIĞI MERKEZİ",
        "SAMSUN TEKKEKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "TEKİRDAĞ ÇERKEZKÖY İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "TEKİRDAĞ ÇORLU İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "TEKİRDAĞ KAPAKLI İLÇE SAĞLIK MÜDÜRLÜĞÜ",
         "TRABZON DERNEKPAZARI TOPLUM SAĞLIĞI MERKEZİ",
        "TRABZON HAYRAT TOPLUM SAĞLIĞI MERKEZİ",
        "ZONGULDAK ÇAYCUMA İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ZONGULDAK DEVREK İLÇE SAĞLIK MÜDÜRLÜĞÜ",
        "ZONGULDAK EREĞLİ İLÇE SAĞLIK MÜDÜRLÜĞÜ"
    ];

    // --- Veritabanı İşlemleri ---
    const clearRadioButtons = (listItem) => {
        const radioButtons = listItem.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
    };

    const displayMessage = (message, type = 'error') => {
        userMessage.textContent = message;
        userMessage.classList.add(type);
        userMessage.style.display = 'block';
        setTimeout(() => {
            userMessage.style.display = 'none';
        }, 3000);
    };

    const generateNumberCircle = (number) => {
        const circle = document.createElement('span');
        circle.classList.add('number-circle');
        circle.textContent = number;
        return circle;
    };

    // --- Kullanıcı İşlemleri ---
    registerBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const password = passwordInput.value;
        const servicePoint = servicePointInput.value;

        if (!name || !password || !servicePoint) {
            displayMessage('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, password: password, servicePoint: servicePoint })
            });
            if (response.ok) {
                displayMessage('Yeni kullanıcı oluşturuldu!', 'success');
                nameInput.value = '';
                passwordInput.value = '';
                servicePointInput.value = '';
            }
            else {
                const error = await response.text();
                displayMessage(error);
            }

        } catch (e) {
            console.error(e)
            displayMessage('Bir hata oluştu.')
        }
    });

    loginBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const password = passwordInput.value;

        if (!name || !password) {
            displayMessage('Lütfen ad soyad ve şifre alanlarını doldurun.');
            return;
        }
        try {
            const response = await fetch('/api/users')
            const users = await response.json();
            const normalizedName = name.toLowerCase();
            if (users[normalizedName]) {
                if (users[normalizedName].password === password) {

                    loggedInUserName = name;
                    loggedInUserPoint = users[normalizedName].servicePoint;

                    personNameInput.value = users[normalizedName].name;
                    personServicePointInput.value = users[normalizedName].servicePoint;

                    munhallerDiv.style.display = 'block';
                    displayMessage('Giriş başarılı!', 'success');
                    nameInput.value = '';
                    passwordInput.value = '';
                } else {
                    displayMessage('Şifre yanlış.');
                }
            } else {
                displayMessage('Bu isim kayıtlı değil.');
            }
        } catch (e) {
            console.error(e)
            displayMessage("Bir hata oluştu.")
        }

    });

    updatePointBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const password = passwordInput.value;
        const newServicePoint = servicePointInput.value;

        if (!name || !password || !newServicePoint) {
            displayMessage('Lütfen tüm alanları doldurun.');
            return;
        }
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, password: password, servicePoint: newServicePoint })
            });
            if (response.ok) {
                displayMessage('Puan güncellendi!', 'success');
                nameInput.value = '';
                passwordInput.value = '';
                servicePointInput.value = '';
            } else {
                const error = await response.text();
                displayMessage(error);
            }
        } catch (e) {
            console.error(e)
            displayMessage("Bir hata oluştu.")
        }

    });

    deleteUserBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const password = passwordInput.value;

        if (!name || !password) {
            displayMessage('Lütfen ad soyad ve şifre alanlarını doldurun.');
            return;
        }
        try {
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, password: password })
            });
            if (response.ok) {
                displayMessage('Kullanıcı silindi!', 'success');
                nameInput.value = '';
                passwordInput.value = '';
            } else {
                const error = await response.text();
                displayMessage(error);
            }

        } catch (e) {
            console.error(e)
            displayMessage('Bir hata oluştu.')
        }
    });

    // --- Tercih Yapma Bölümü ---
    munhaller.forEach((munhal, index) => {
        const listItem = document.createElement('li');
        const numberCircle = generateNumberCircle(index + 1);
        listItem.appendChild(numberCircle)
        listItem.appendChild(document.createTextNode(munhal));

        const radioGroup = document.createElement('div');
        radioGroup.classList.add('radio-group');

        for (let i = 1; i <= 10; i++) {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `preference-${index}`;
            radio.value = i;
            radioGroup.appendChild(radio);
        }

        const clearButton = document.createElement('button');
        clearButton.classList.add('clear-button');
        clearButton.textContent = 'Bu seçimi sil';
        clearButton.addEventListener('click', () => {
            clearRadioButtons(listItem);
            if (listItem.classList.contains('expanded')) {
                listItem.classList.remove('expanded');
            }
        });

        listItem.appendChild(radioGroup);
        listItem.appendChild(clearButton);

        listItem.addEventListener('click', () => {

            if (listItem.classList.contains('expanded')) {
                listItem.classList.remove('expanded');
            } else {
                if (document.querySelectorAll('.munhaller-list li.expanded').length >= 10) {
                    displayMessage("10 Adetten fazla satir secemezsiniz", 'error');
                    return;
                }
                listItem.classList.add('expanded');
            }
        });
        munhallerList.appendChild(listItem);
    });


    sendPreferencesBtn.addEventListener('click', async () => {

        const name = personNameInput.value.trim();
        const servicePoint = personServicePointInput.value;

        if (!loggedInUserName || !loggedInUserPoint) {
            displayMessage('Lütfen giriş yapınız');
            return;
        }
        let preferenceData = [name, servicePoint];
        const allRadioButtons = document.querySelectorAll('.munhaller-list li input[type="radio"]:checked');

        allRadioButtons.forEach(radio => {

            const listItem = radio.closest('li');
            const munhalName = listItem.textContent.replace(/^\d+\s/, '').trim();

            if (Object.values(selectedRadioButtons).includes(parseInt(radio.value))) {
                displayMessage(`${radio.value} numaralı tercihinizi başka bir birim icin kullandınız.`, 'error')
                radio.checked = false;
                return;
            } else {
                preferenceData.push(parseInt(radio.value));
                preferenceData.push(munhalName);
                selectedRadioButtons[listItem.textContent] = parseInt(radio.value);

            }
        });
        try {
            const response = await fetch('/api/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, preferenceData: preferenceData })
            });
            if (response.ok) {
                const message = await response.text()
                displayMessage(message, 'success');
            } else {
                const error = await response.text();
                displayMessage(error);
            }

        } catch (e) {
            console.error(e)
            displayMessage("Bir hata oluştu.");
        }

    });

    clearAllPreferencesBtn.addEventListener('click', () => {
        const allRadioButtons = document.querySelectorAll('.munhaller-list li input[type="radio"]:checked');
        allRadioButtons.forEach(radio => {
            radio.checked = false;
        })

        selectedRadioButtons = {};
        displayMessage('Tüm tercihler silindi.', 'success')
    })

    // --- Tercihleri İnceleme Bölümü ---

    updateViewBtn.addEventListener('click', async () => {

        reviewList.innerHTML = '';
        try {
            const response = await fetch('/api/preferences')
            const preferences = await response.json();

            munhaller.forEach((munhal, index) => {
                const listItem = document.createElement('li');
                const numberCircle = generateNumberCircle(index + 1);
                listItem.appendChild(numberCircle)
                listItem.appendChild(document.createTextNode(munhal));
                const userInfoDiv = document.createElement('div');
                userInfoDiv.classList.add('user-info');
                let userPreferences = [];

                for (const key in preferences) {

                    const preference = preferences[key];
                    for (let i = 3; i < preference.length; i += 2) {
                        if (preference[i] === munhal) {
                            userPreferences.push({
                                name: preference[0],
                                point: preference[1],
                                order: preference[i - 1]
                            });
                            break;
                        }
                    }
                }
                userPreferences.sort((a, b) => a.order - b.order);
                userPreferences.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.textContent = `${user.name}, ${user.point}, ${user.order}.TERCİH`;
                    userInfoDiv.appendChild(userDiv);
                })

                listItem.appendChild(userInfoDiv);

                listItem.addEventListener('click', () => {
                    if (listItem.classList.contains('expanded')) {
                        listItem.classList.remove('expanded');
                    } else {
                        listItem.classList.add('expanded');
                    }
                });


                reviewList.appendChild(listItem);
            });
        }
        catch (e) {
            console.error(e);
            displayMessage('Tercihler yüklenirken hata oluştu.');
        }
    });
});