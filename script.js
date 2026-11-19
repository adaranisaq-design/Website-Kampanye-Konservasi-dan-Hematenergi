const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");


// ===============================
// MENU MOBILE
// ===============================

menuBtn.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    menuBtn.textContent = isOpen ? "✕" : "☰";
});


// ===============================
// TUTUP MENU SETELAH KLIK
// ===============================

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {
        navMenu.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Buka menu");
        menuBtn.textContent = "☰";
    });

});


// ===============================
// STATUS MENU AKTIF
// ===============================

const sections = document.querySelectorAll("main section[id]");

const activeSectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function(link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
    });
}, {
    rootMargin: "-35% 0px -55%",
    threshold: 0
});

sections.forEach(function(section) {
    activeSectionObserver.observe(section);
});


// ===============================
// DATA & FAKTA
// ===============================

async function loadDataAndFacts() {
    const summary = document.getElementById("factSummary");

    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Data tidak dapat dimuat.");
        }

        const data = await response.json();

        if (typeof Chart === "undefined") {
            throw new Error("Chart.js belum tersedia.");
        }

        new Chart(document.getElementById("lampChart"), {
            type: "bar",
            data: {
                labels: data.penggunaanLampu.labels,
                datasets: [{
                    label: "Jumlah responden",
                    data: data.penggunaanLampu.values,
                    backgroundColor: ["#227348", "#f5c84b", "#91b99f"],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
            }
        });

        new Chart(document.getElementById("actionChart"), {
            type: "doughnut",
            data: {
                labels: data.tindakanHematEnergi.labels,
                datasets: [{
                    data: data.tindakanHematEnergi.values,
                    backgroundColor: ["#227348", "#4a9a6b", "#f5c84b", "#91b99f"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "58%",
                plugins: { legend: { position: "bottom" } }
            }
        });

        summary.innerHTML = data.fakta.map(function(fact) {
            return `
                <article class="fact-summary-item">
                    <strong>${fact.nilai}</strong>
                    <span>${fact.teks}</span>
                </article>
            `;
        }).join("");

    } catch (error) {
        summary.innerHTML = `
            <article class="fact-summary-item">
                <strong>Data</strong>
                <span>${error.message}</span>
            </article>
        `;
    }
}

loadDataAndFacts();