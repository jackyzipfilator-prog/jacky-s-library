// --- 1. CONFIGURATION & ADMIN CHECK ---
// Shortcut: To see your buttons, visit your site and add ?admin=jacky to the URL
const urlParams = new URLSearchParams(window.location.search);
const isOwner = urlParams.get('admin') === 'jacky'; 

// --- 2. THE DATA (Where games live for everyone) ---
// When you "Export," you will paste the new list inside these brackets [ ]
let officialGames = [
  {
    "title": "rv there yet  (v1.1.15619 + Co-op)",
    "url": "https://gofile.io/d/MiYHm2",
    "yt": "https://www.youtube.com/watch?v=Br8vAUbdhFI&t=1s&pp=ygUNcnYgdGhlcmUgeWV0IA%3D%3D",
    "img": "https://gaming-cdn.com/images/products/20702/orig/rv-there-yet-pc-steam-cover.jpg?v=1761118646"
  },
  {
    "title": "Repo",
    "url": "https://vik1ngfile.site/f/ggpaC0fxU5#REPO-SteamGG.NET.zip%20-%20878.70%20MB",
    "yt": "https://youtu.be/AqhamuepAeE?si=acE8ghNYzmylJsP8",
    "img": "https://i.ytimg.com/vi/IEhEymYkzRI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAAAfZjqO617nHrUEa_EW8HD_ZUfw"
  },
  {
    "title": "content warning ",
    "url": "https://vik1ngfile.site/f/M02hRnZB4o",
    "yt": "https://www.youtube.com/watch?v=iyif6sL3rXs&pp=ygUWY29udGVudCB3YXJuaW5nIG1lbWVzIA%3D%3D",
    "img": "https://steamgg.net/wp-content/uploads/2024/04/Content-Warning-Free-Download-SteamGG-2-jpg.webp"
  },
  {
    "title": "GWtool",
    "url": "https://fmt4.dl.dbolical.com/dl/2019/05/30/GWtool_File_made_by_ZombieSlayer103.zip?st=CXs_5tKRplViHj99rzEhOQ==&e=1766279512",
    "yt": "https://www.youtube.com/watch?v=K99P9xMrZ-4",
    "img": "https://media.moddb.com/images/downloads/1/179/178961/dcgp6gx-fc2b65c5-e07b-4371-b520-.png"
  },
  {
    "title": "7z",
    "url": "https://www.7-zip.org/",
    "yt": "https://www.youtube.com/watch?v=K99P9xMrZ-4",
    "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/7-Zip_Icon.svg/1200px-7-Zip_Icon.svg.png"
  },
  {
    "title": "online fix Gmod download",
    "url": "https://freetp.org/getfile-15252",
    "yt": "https://www.youtube.com/watch?v=79ux5CZ0ros",
    "img": "https://content.any.run/tasks/09a8027c-7d58-4f48-905f-3d415f343e09/download/screens/1c7808a6-3645-46cf-9638-e7ce0d79638d/image.jpeg"
  },
  {
    "title": "SteamCMD workshop download",
    "url": "https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip",
    "yt": "https://www.youtube.com/watch?v=K99P9xMrZ-4",
    "img": "https://www.digitalcitizen.life/wp-content/uploads/2022/05/steamcmd-7.png"
  },
  {
    "title": "steamtools ",
    "url": "https://www.steamtools.net/res/st-setup-1.8.17r2.exe",
    "yt": "https://www.youtube.com/watch?v=9vNDVKn3gL0",
    "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3-lsZxIUkYmWLZdRtI83BI2yH_62OTkPdDg&s"
  }
];

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







