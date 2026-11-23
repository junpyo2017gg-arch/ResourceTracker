let inputValues = {};// =====================================
// Resource Tracker v0.1
// app.js (1/2)
// =====================================

const STORAGE_KEY = "resource_tracker_v01";

let data = {
    selectedGame: 0,
    games: []
};

// --------------------
// 저장 / 불러오기
// --------------------

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function load() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        data = JSON.parse(saved);
        return;
    }

    data.games.push({

        name: "기본 게임",

        resources: [
            {
                name: "Gold",
                total: 0
            },
            {
                name: "Gem",
                total: 0
            }
        ],

        history: []

    });

    save();

}

// --------------------
// 현재 게임
// --------------------

function game() {

    return data.games[data.selectedGame];

}

// --------------------
// 화면
// --------------------

function render() {

    renderGameSelect();

    renderResources();

    renderTotals();

    renderHistory();

}

// --------------------
// 게임 목록
// --------------------

function renderGameSelect() {

    const select =
        document.getElementById("gameSelect");

    select.innerHTML = "";

    data.games.forEach((g, i) => {

        const option =
            document.createElement("option");

        option.value = i;

        option.textContent = g.name;

        select.appendChild(option);

    });

    select.value = data.selectedGame;

}

// --------------------
// 입력창
// --------------------

function renderResources() {

    const container =
        document.getElementById("resourceContainer");

    container.innerHTML = "";

    game().resources.forEach((resource, index) => {

        const row =
            document.createElement("div");

        row.className = "resource";

        const value = inputValues[resource.name] ?? "";

        row.innerHTML = `
<label>${resource.name}</label>

<input
type="number"
min="0"
value="${value}"
data-index="${index}">
`;

        const input = row.querySelector("input");

        input.addEventListener("input", function () {

            inputValues[resource.name] = this.value;

        });

        container.appendChild(row);

    });

}

// --------------------
// 총 재화
// --------------------

function renderTotals() {

    const container =
        document.getElementById("totalContainer");

    container.innerHTML = "";

    game().resources.forEach(resource => {

        const div =
            document.createElement("div");

        div.className = "totalItem";

        div.innerHTML = `
<span>${resource.name}</span>
<strong>${resource.total.toLocaleString()}</strong>
`;

        container.appendChild(div);

    });

}
// --------------------
// 최근 기록
// --------------------

function renderHistory() {

    const container =
        document.getElementById("historyContainer");

    container.innerHTML = "";

    if (game().history.length === 0) {

        container.textContent = "아직 기록이 없습니다.";

        return;

    }

    [...game().history]
        .reverse()
        .forEach(record => {

            const div = document.createElement("div");

div.className = "historyItem";

let html = `<strong>${record.time}</strong><br>`;

record.items.forEach(item => {
    html += `${item.name} +${item.value}<br>`;
});

html += `<button onclick="deleteRecord(${game().history.length - 1 - [...game().history].reverse().indexOf(record)})">삭제</button>`;

div.innerHTML = html;

container.appendChild(div);

        });

}

// --------------------
// 이벤트
// --------------------

document
.getElementById("gameSelect")
.addEventListener("change", e => {

    data.selectedGame =
        Number(e.target.value);

    save();

    render();

});

document
.getElementById("addGameBtn")
.addEventListener("click", () => {

    const name =
        prompt("게임 이름");

    if (!name) return;

    data.games.push({

        name: name,

        resources: [
            {
                name: "Gold",
                total: 0
            }
        ],

        history: []

    });

    data.selectedGame =
        data.games.length - 1;

    save();

    render();

});

document
.getElementById("addResourceBtn")
.addEventListener("click", () => {

    const name =
        prompt("재화 이름");

    if (!name) return;

    game().resources.push({

        name: name,

        total: 0

    });

    save();

    render();

});

document
.getElementById("saveRecordBtn")
.addEventListener("click", () => {

    const inputs =
        document.querySelectorAll(
            "#resourceContainer input"
        );

    const items = [];

    inputs.forEach(input => {

        const index =
            Number(input.dataset.index);

        const value =
            Number(input.value);

        if (value <= 0) return;

        game().resources[index].total += value;

        items.push({

            name: game().resources[index].name,

            value: value

        });

    });

    if (items.length === 0) {

        alert("입력된 재화가 없습니다.");

        return;

    }

    game().history.push({

        time: new Date().toLocaleString(),

        items: items

    });

    save();

    render();

});

// --------------------
// 시작
// --------------------

load();

render();
function deleteRecord(index) {

    if (!confirm("이 기록을 삭제하시겠습니까?")) {
        return;
    }

    const record = game().history[index];

    record.items.forEach(item => {

        const resource = game().resources.find(r => r.name === item.name);

        if (resource) {
            resource.total -= item.value;
        }

    });

    game().history.splice(index, 1);

    save();

    render();

      }
