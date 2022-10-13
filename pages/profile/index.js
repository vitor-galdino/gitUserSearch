const getUsername = () => location.search.slice(6);

async function requestApiData(url) {

    try {
        const data = await fetch(`https://api.github.com/users/${url}`)
        const dataJson = await data.json();
        return dataJson;
    } catch (error) {
        return error;
    }
}

async function renderUserProfile() {
    const profileHeader = document.querySelector(".profile-header");
    const userName = getUsername();
    const userDetails = await requestApiData(userName);

    document.title = userDetails.name;

    profileHeader.insertAdjacentHTML("beforeend", `
        <div class="profile-info">
          <img draggable="false" src="${userDetails.avatar_url}"
            alt="${userDetails.name} picture">
            <div class="profile-desc">
                <h2>${userDetails.name}</h2>
                <span>${userDetails.bio || "No bio yet"}</span>
            </div>
        </div>
        <nav class="user-tool">
          <ul>
            <li>
              <a href="mailto:${userDetails.email || ""}" class="primary-btn">Email</a>
            </li>
            <li>
              <button class="dark-btn quit-page">Trocar de usuário</button>
            </li>
          </ul>
        </nav>
    `);
    quitPage();
}
renderUserProfile();

function reposCard(title, desc, repos, pages) {
    const userName = getUsername();

    return `
    <li class="card">
        <h3>${title}</h3>
        <p>${desc || "No description, website, or topics provided."}</p>
        <div class="repos-links">
            <a href="${repos}" target="_blank" class="tag-btn">Repositório</a>
            <a href="${pages || `https://${userName}.github.io/${title}/`}" target="_blank" class="tag-btn">Demo</a>
        </div>
    </li>
    `;
}

async function renderReposCards() {
    const reposContent = document.querySelector(".repos-content");
    const userName = getUsername();
    const reposDetails = await requestApiData(`${userName}/repos`);
    
    reposContent.insertAdjacentHTML("beforeend", reposDetails.map((repos) => 
        reposCard(repos.name, repos.description, repos.html_url, repos.homepage)
    ).join(""));
}
renderReposCards();

function quitPage() {
    const quitButton = document.querySelector(".quit-page");
    const userName = getUsername();

    quitButton.onclick = () => {
        location.assign(location.href.replace(`profile/index.html?user=${userName}`, "home/"));
    }
}