// Dummy UID for GitHub testing. Real app me Auth use karna.
let currentUserUID = "test_user_001"; 
let currentCoins = 0;
let spinsToday = 0;

function loadUserData() {
    db.ref('users/' + currentUserUID).on('value', (snapshot) => {
        const data = snapshot.val() || { coins: 0, spinsToday: 0, isBanned: false };
        
        if (data.isBanned) {
            document.getElementById('appScreen').classList.add('hidden');
            document.getElementById('bannedScreen').classList.remove('hidden');
            return;
        }

        // ANTI-CHEAT: Agar bina spin ke achanak 100 coin badh jaye
        if (data.coins - currentCoins >= 100 && currentCoins !== 0) {
            banUser();
            return;
        }

        currentCoins = data.coins;
        spinsToday = data.spinsToday;
        updateUI();
    });
}

function startSpin() {
    if (spinsToday >= 5) {
        alert("Daily limit reached! Come back tomorrow.");
        return;
    }

    // Testing ke liye Ad Alert
    console.log("AppLovin Ad should play here");

    // UI Animation
    document.getElementById('wheel').style.transform = `rotate(${Math.random() * 3600}deg)`;

    setTimeout(() => {
        let reward = 0;
        let rand = Math.random() * 100;
        
        if (rand <= 95) { 
            reward = Math.floor(Math.random() * 2) + 1; // 1 to 2 coins
        } else { 
            reward = Math.floor(Math.random() * 6) + 5; // 5 to 10 coins
        }

        if (reward >= 100) {
            banUser(); // Safety fallback
        } else {
            spinsToday++;
            let newTotal = currentCoins + reward;
            
            db.ref('users/' + currentUserUID).update({
                coins: newTotal,
                spinsToday: spinsToday,
                lastSpinDate: new Date().toISOString().split('T')[0]
            });
            alert(`You won ${reward} coins!`);
        }
    }, 1000); // Wait for wheel spin animation
}

function banUser() {
    db.ref('users/' + currentUserUID).update({ isBanned: true });
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('bannedScreen').classList.remove('hidden');
}

function updateUI() {
    document.getElementById('coinBalance').innerText = currentCoins;
    document.getElementById('spinsLeft').innerText = 5 - spinsToday;

    const withdrawBtn = document.getElementById('withdrawBtn');
    if (currentCoins >= 100) {
        withdrawBtn.disabled = false;
        document.getElementById('withdrawMsg').innerText = "Ready to withdraw!";
    } else {
        withdrawBtn.disabled = true;
        document.getElementById('withdrawMsg').innerText = "Earn 100 coins to unlock";
    }
}

function requestWithdraw() {
    if (currentCoins >= 100) {
        let ownerWhatsApp = "919876543210"; // Apna Number yahan daalo
        let msg = `Hello, I want to withdraw my 100 coins. My UID is: ${currentUserUID}.`;
        window.location.href = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(msg)}`;
        
        db.ref('users/' + currentUserUID).update({ coins: currentCoins - 100 });
    }
}

// Start App
loadUserData();
