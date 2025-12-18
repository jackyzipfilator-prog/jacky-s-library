// --- 1. CONFIGURATION & ADMIN CHECK ---
// Shortcut: To see your buttons, visit your site and add ?admin=jacky to the URL
const urlParams = new URLSearchParams(window.location.search);
const isOwner = urlParams.get('admin') === 'jacky'; 

// --- 2. THE DATA (Where games live for everyone) ---
// When you "Export," you will paste the new list inside these brackets [ ]
let officialGames = [
  {
    "title": "rv there yet ",
    "url": "https://gofile.io/d/LuKSln",
    "yt": "https://www.youtube.com/watch?v=Br8vAUbdhFI&t=1s&pp=ygUNcnYgdGhlcmUgeWV0IA%3D%3D",
    "img": "https://gaming-cdn.com/images/products/20702/orig/rv-there-yet-pc-steam-cover.jpg?v=1761118646"
  }
];]; 

// Load from browser memory OR use the official list above
let localGames = JSON.parse(localStorage.getItem('jacky_games')) || [];
let games = localGames.length > 0 ? localGames : officialGames;

let editIndex = null;

// Show Admin Button if you used the secret link
if (isOwner) {
    document.getElementById('adminBtn').classList.remove('hidden');
    // Add Export Button to the header for the owner
    const exportBtn = document.createElement('button');
    exportBtn.innerText = "💾 Export List";
    exportBtn.className = "btn-create";
    exportBtn.style.background = "#ffca28";
    exportBtn.onclick = exportData;
    document.querySelector('.header-right').prepend(exportBtn);
}

// --- 3. RENDER FUNCTION ---
function render() {
    const container = document.getElementById('linksContainer');
    container.innerHTML = "";

    games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img class="card-img" src="${game.img || 'https://via.placeholder.com/800x400?text=Jackys+Library'}">
            <div class="card-body">
                <span class="card-title">${game.title}</span>
                <div class="yt-row">
                    <i class="fab fa-youtube"></i>
                    <a href="${game.yt}" target="_blank">YouTube Preview</a>
                    <span class="info-tip">(!) preview if available</span>
                </div>
                <div class="actions">
                    ${isOwner ? 
                        `<button class="btn-action btn-edit" onclick="openEditModal(${index})"><i class="fas fa-edit"></i> Edit</button>
                         <button class="btn-action btn-delete" onclick="deleteGame(${index})"><i class="fas fa-trash"></i> Delete</button>` : 
                        `<button class="btn-action btn-view" onclick="copyLink('${game.url}')"><i class="fas fa-copy"></i> Copy Link</button>`
                    }
                    <button class="btn-action btn-view" onclick="window.open('${game.url}')">View/Download</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 4. CORE LOGIC (Publish, Edit, Delete) ---
function openEditModal(index = null) {
    editIndex = index;
    const modalTitle = document.getElementById('modalTitle');
    const publishBtn = document.getElementById('publishBtn');

    if (index !== null) {
        const game = games[index];
        document.getElementById('newTitle').value = game.title;
        document.getElementById('newFileUrl').value = game.url;
        document.getElementById('newYtUrl').value = game.yt;
        document.getElementById('newImgUrl').value = game.img;
        modalTitle.innerText = "Edit Game Info";
        publishBtn.innerText = "Save Changes";
    } else {
        document.getElementById('newTitle').value = "";
        document.getElementById('newFileUrl').value = "";
        document.getElementById('newYtUrl').value = "";
        document.getElementById('newImgUrl').value = "";
        modalTitle.innerText = "Publish New Game";
        publishBtn.innerText = "Publish";
    }
    toggleModal(true);
}

function publishGame() {
    const title = document.getElementById('newTitle').value;
    const url = document.getElementById('newFileUrl').value;
    const yt = document.getElementById('newYtUrl').value;
    const img = document.getElementById('newImgUrl').value;

    if (!title || !url) return alert("Name and Link are required!");

    const gameData = { title, url, yt, img };

    if (editIndex !== null) { games[editIndex] = gameData; } 
    else { games.push(gameData); }

    localStorage.setItem('jacky_games', JSON.stringify(games));
    render();
    toggleModal(false);
}

function deleteGame(index) {
    if (confirm("Delete this game?")) {
        games.splice(index, 1);
        localStorage.setItem('jacky_games', JSON.stringify(games));
        render();
    }
}

// --- 5. THE EXPORT TRICK (To update the site for everyone) ---
function exportData() {
    const dataString = JSON.stringify(games, null, 2);
    const codeBlock = `let officialGames = ${dataString};`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(codeBlock);
    alert("CODE EXPORTED!\n\nI have copied the code to your clipboard.\nGo to script.js, find 'let officialGames = [];' and paste this over it.");
}

// --- 6. UTILITIES ---
function searchGames() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.getElementsByClassName('card');
    Array.from(cards).forEach((card, index) => {
        const title = games[index].title.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
    });
}

function toggleModal(show) { document.getElementById('linkModal').style.display = show ? 'block' : 'none'; }
function copyLink(url) { navigator.clipboard.writeText(url); alert("Link copied!"); }

// Init

render();
