const RATE = 1.95; // 1 EUR = 1.95 KM
let goal = JSON.parse(localStorage.getItem("goal")) || null;
let earnings = JSON.parse(localStorage.getItem("earnings")) || [];

function toEUR(amount, currency) {
  return currency === "EUR" ? amount : amount / RATE;
}
function toKM(amount, currency) {
  return currency === "KM" ? amount : amount * RATE;
}

function setGoal() {
  const name = document.getElementById("goalName").value;
  const amount = parseFloat(document.getElementById("goalAmount").value);
  const currency = document.getElementById("goalCurrency").value;

  if (!name || !amount) {
    alert("Unesi i ime i cijenu cilja!");
    return;
  }

  goal = { name, amount, currency };
  earnings = [];
  localStorage.setItem("goal", JSON.stringify(goal));
  localStorage.setItem("earnings", JSON.stringify(earnings));
  renderApp();
}

function addEarnings() {
  const value = parseFloat(document.getElementById("earnInput").value);
  const currency = document.getElementById("earnCurrency").value;

  if (!value || value <= 0) {
    alert("Unesi ispravan iznos!");
    return;
  }

  const entry = { amount: value, currency, date: new Date().toLocaleString() };
  earnings.push(entry);
  localStorage.setItem("earnings", JSON.stringify(earnings));
  renderApp();
  document.getElementById("earnInput").value = "";
}

function resetGoal() {
  if (confirm("Želiš li obrisati sve podatke?")) {
    localStorage.clear();
    goal = null;
    earnings = [];
    document.getElementById("setup").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
}

function renderApp() {
  if (!goal) return;

  document.getElementById("setup").style.display = "none";
  document.getElementById("app").style.display = "block";

  // sve pretvaramo u EUR i KM
  let totalEUR = 0;
  let totalKM = 0;
  earnings.forEach(e => {
    totalEUR += toEUR(e.amount, e.currency);
    totalKM += toKM(e.amount, e.currency);
  });

  const goalEUR = toEUR(goal.amount, goal.currency);
  const goalKM = toKM(goal.amount, goal.currency);

  const percent = Math.min((totalEUR / goalEUR) * 100, 100).toFixed(1);

  document.getElementById("goalDisplay").innerText = `Cilj: ${goal.name} (${goal.amount} ${goal.currency})`;
  document.getElementById("savedDisplay").innerText = `Skupio si: ${totalEUR.toFixed(2)} EUR / ${totalKM.toFixed(2)} KM`;
  document.getElementById("missingDisplay").innerText = `Još ti fali: ${(goalEUR - totalEUR).toFixed(2)} EUR / ${(goalKM - totalKM).toFixed(2)} KM`;

  const progress = document.getElementById("progress");
  progress.style.width = percent + "%";
  progress.innerText = percent + "%";

  // history
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  earnings.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `+${e.amount} ${e.currency} (${e.date})`;
    list.appendChild(li);
  });
}

renderApp();
