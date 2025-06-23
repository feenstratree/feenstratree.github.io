let familieData = {}; // Globale variabele om data op te slaan
let gebruikers = {};

// Functie om data te laden van localStorage
function laadData() {
    try {
        const storedData = localStorage.getItem('familieData');
        if (storedData) {
            familieData = JSON.parse(storedData);
        } else {
            familieData = {};
        }
    } catch (error) {
        console.error("Fout bij het laden van data uit localStorage:", error);
        familieData = {};
    }
    verversData(); // Update de weergave
}

// Functie om data op te slaan in localStorage
function opslaanData() {
    try {
        localStorage.setItem('familieData', JSON.stringify(familieData));
    } catch (error) {
        console.error("Fout bij het opslaan van data in localStorage:", error);
        alert("Fout bij het opslaan van data in localStorage.  Data wordt mogelijk niet bewaard.");
    }
}

async function laadGebruikers() {
    try {
        const response = await fetch('gebruikers.json');
        gebruikers = await response.json();
    } catch (error) {
        console.error("Fout bij het laden van gebruikers:", error);
        alert("Fout bij het laden van gebruikers.  Zorg ervoor dat gebruikers.json bestaat en correct is.");
        gebruikers = {}; // Initialiseer als een lege object bij fout
    }
}

// Simulatie van inloggen (aanpassen voor echte backend)
function login() {
    const gebruikersnaam = document.getElementById('gebruikersnaam').value;
    const wachtwoord = document.getElementById('wachtwoord').value;

    laadGebruikers().then(() => {
        if (gebruikersnaam in gebruikers && gebruikers[gebruikersnaam] === wachtwoord) {
            alert('Inloggen gelukt!');
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('mainTabs').style.display = 'block';
            laadData(); // Laad de data na het inloggen
        } else {
            alert('Ongeldige gebruikersnaam of wachtwoord.');
        }
    });
}

// Simulatie van registreren (aanpassen voor echte backend)
function register() {
    const gebruikersnaam = document.getElementById('gebruikersnaam').value;
    const wachtwoord = document.getElementById('wachtwoord').value;

    laadGebruikers().then(() => {
        if (!gebruikersnaam || !wachtwoord) {
            alert('Gebruikersnaam en wachtwoord mogen niet leeg zijn.');
            return;
        }

        if (gebruikersnaam in gebruikers) {
            alert('Gebruikersnaam bestaat al.');
            return;
        }

        gebruikers[gebruikersnaam] = wachtwoord;
        // Hier moet je de gebruikers naar een server opslaan (of lokaal met FileSystem API als je dat wilt proberen)
        // Voor dit voorbeeld laten we het even achterwege, omdat het complexer is
        alert('Registratie gelukt! (Let op: de gebruikers worden niet permanent opgeslagen in deze demo)');
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainTabs').style.display = 'block';
        laadData(); // Laad de data na het registreren
    });
}

// Functie om een tab te openen
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Functie om lid toe te voegen
function toevoegenLid() {
    const lid_id = document.getElementById('lid_id').value;
    const voornaam = document.getElementById('voornaam').value;
    const achternaam = document.getElementById('achternaam').value;
    const geboortedatum = document.getElementById('geboortedatum').value;
    const geslacht = document.getElementById('geslacht').value;
    const ouder1_id = document.getElementById('ouder1_id').value;
    const ouder2_id = document.getElementById('ouder2_id').value;
    const partner_id = document.getElementById('partner_id').value;

    if (!lid_id) {
        alert("Lid ID mag niet leeg zijn.");
        return;
    }

    if (familieData[lid_id]) {
        alert("Lid ID bestaat al. Kies een andere.");
        return;
    }

    familieData[lid_id] = {
        voornaam: voornaam,
        achternaam: achternaam,
        geboortedatum: geboortedatum,
        geslacht: geslacht,
        ouder1_id: ouder1_id,
        ouder2_id: ouder2_id,
        partner_id: partner_id
    };

    opslaanData(); // Sla de data op in localStorage
    alert('Lid toegevoegd!');
    verversData(); // Update de weergave

    // Reset formulier
    document.getElementById('toevoegForm').reset();
}

// Functie om data te verversen in de "Alles Bekijken" tab
function verversData() {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ''; // Maak leeg

    for (const lid_id in familieData) {
        if (familieData.hasOwnProperty(lid_id)) {
            const lid = familieData[lid_id];
            const lidDiv = document.createElement('div');
            lidDiv.className = 'lid-item'; // Optioneel voor styling

            let details = `<strong>Lid ID:</strong> ${lid_id}<br>`;
            details += `<strong>Voornaam:</strong> ${lid.voornaam || ''}<br>`;
            details += `<strong>Achternaam:</strong> ${lid.achternaam || ''}<br>`;
            details += `<strong>Geboortedatum:</strong> ${lid.geboortedatum || ''}<br>`;
            details += `<strong>Geslacht:</strong> ${lid.geslacht || ''}<br>`;
            details += `<strong>Ouder 1 ID:</strong> ${lid.ouder1_id || ''}<br>`;
            details += `<strong>Ouder 2 ID:</strong> ${lid.ouder2_id || ''}<br>`;
            details += `<strong>Partner ID:</strong> ${lid.partner_id || ''}<br>`;

            lidDiv.innerHTML = details;
            dataContainer.appendChild(lidDiv);
        }
    }
}

// Functies voor Bewerken tab
function laadLidData() {
    const bewerk_lid_id = document.getElementById('bewerk_lid_id').value;

    if (!bewerk_lid_id) {
        alert("Lid ID mag niet leeg zijn.");
        return;
    }

    if (!familieData[bewerk_lid_id]) {
        alert("Lid niet gevonden.");
        return;
    }

    const lid = familieData[bewerk_lid_id];

    document.getElementById('bewerk_voornaam').value = lid.voornaam || '';
    document.getElementById('bewerk_achternaam').value = lid.achternaam || '';
    document.getElementById('bewerk_geboortedatum').value = lid.geboortedatum || '';
    document.getElementById('bewerk_geslacht').value = lid.geslacht || '';
    document.getElementById('bewerk_ouder1_id').value = lid.ouder1_id || '';
    document.getElementById('bewerk_ouder2_id').value = lid.ouder2_id || '';
    document.getElementById('bewerk_partner_id').value = lid.partner_id || '';
}

function opslaanWijzigingen() {
    const bewerk_lid_id = document.getElementById('bewerk_lid_id').value;

    if (!bewerk_lid_id) {
        alert("Lid ID mag niet leeg zijn.");
        return;
    }

    if (!familieData[bewerk_lid_id]) {
        alert("Lid niet gevonden.");
        return;
    }

   familieData[bewerk_lid_id] = {
        voornaam: document.getElementById('bewerk_voornaam').value,
        achternaam:  document.getElementById('bewerk_achternaam').value,
        geboortedatum: document.getElementById('bewerk_geboortedatum').value,
        geslacht: document.getElementById('bewerk_geslacht').value,
        ouder1_id: document.getElementById('bewerk_ouder1_id').value,
        ouder2_id: document.getElementById('bewerk_ouder2_id').value,
        partner_id: document.getElementById('bewerk_partner_id').value
    };

    opslaanData(); // Sla de data op in localStorage
    alert('Wijzigingen opgeslagen!');
    verversData();
}

//Laad initiele data (als ingelogd)
document.addEventListener('DOMContentLoaded', laadData);
