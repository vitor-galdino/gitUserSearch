const mainButton = document.querySelector(".home-submit");
const mainInput = document.querySelector(".home-input");

function loadingButton(input, button, bool) {
    input.disabled = bool;
    button.disabled = bool;
    bool ? button.classList.add("loading") : button.classList.remove("loading");
}

function showNotFoundMessage() {
    if (!document.querySelector(".not-found")) {
        mainButton.insertAdjacentHTML("beforebegin", `<p class="not-found">Usuário não encontrado</p>`)
        setTimeout(() => {
            document.querySelector(".not-found").remove();
        }, 3000)
    }
}

function checkUserHistory() {
    if (localStorage.getItem("searchLog")) {
        renderRecentList();
    }
}
checkUserHistory();

function renderRecentList() {
    const recentList = document.querySelector(".profile-users");
    const userLog = JSON.parse(localStorage.getItem("searchLog"));
    recentList.innerHTML = "";

    userLog.forEach((user) => {
        recentList.insertAdjacentHTML("beforeend", `
        <div id="${user.name}" class="user-img">
            <img draggable="false" src="${user.avatar}" alt="${user.name}-image">
        </div>
        `);
    })
    checkClickRecentList();
}

function checkClickRecentList() {
    const recentList = document.querySelector(".profile-users");

    recentList.onclick = (e) => {
        if (e.target.tagName.toLowerCase() === "img") {
            checkUserApi(e.target.alt.replace("-image", ""));
        } else {
            checkUserApi(e.target.id);
        }
    }
}

function checkUserInput() {

    mainInput.oninput = function (e) {
        if (this.value.length >= 1) {
            mainButton.classList.remove("disabled");
            mainButton.disabled = false;
        } else {
            mainButton.classList.add("disabled");
            mainButton.disabled = true;
        }
    }
}
checkUserInput();

function getInputValue() {
    mainButton.onclick = () => {
        loadingButton(mainInput, mainButton, true);
        checkUserApi(mainInput.value);
    }

    mainInput.onkeypress = (e) => {
        if (e.key === "Enter" && mainInput.value.length >= 1) {
            e.preventDefault();
            loadingButton(mainInput, mainButton, true);
            checkUserApi(mainInput.value);
        }
    }
}
getInputValue()

async function requestApi(userName) {
    try {
        const data = await fetch(`https://api.github.com/users/${userName}`)
        const dataJson = await data.json();
        return dataJson;
    } catch (error) {
        return error;
    }
}

async function checkUserApi(userName) {
    const userDetails = await requestApi(userName);

    if (userDetails.message) {
        loadingButton(mainInput, mainButton, false);
        showNotFoundMessage();
    } else {
        getUserLogStorage(userDetails.login, userDetails.avatar_url);
        setTimeout(() => {
            location.assign(location.href.replace("home/", `profile/index.html?user=${userName}`));
        }, 800)
    }
}

function getUserLogStorage(userName, url) {
    let log = [];

    if (localStorage.getItem("searchLog")) {
        log = JSON.parse(localStorage.getItem("searchLog"));
    }

    const recentLog = { name: userName, avatar: url };
    log.unshift(recentLog);
    localStorage.setItem("searchLog", JSON.stringify(log))


    if (log.length > 3) {
        localStorage.setItem("searchLog", JSON.stringify(log.slice(0, 3)));
    }

    renderRecentList();
}
