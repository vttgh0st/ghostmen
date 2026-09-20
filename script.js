const totalAulas = 6;

const aulas = [
    "o-que-e-ti",
    "hardware-software",
    "sistemas-operacionais",
    "arquivos-pastas",
    "terminal",
    "internet"
];

function atualizarProgresso() {
    const concluidas = aulas.filter(aula =>
        localStorage.getItem("ghostmen-" + aula) === "true"
    ).length;

    const texto = document.getElementById("progressText");
    const barra = document.getElementById("progressBar");

    if (texto) {
        texto.textContent = `${concluidas} / ${totalAulas} aulas`;
    }

    if (barra) {
        barra.style.width = `${(concluidas / totalAulas) * 100}%`;
    }

    document.querySelectorAll(".lesson").forEach(card => {
        const aula = card.dataset.lesson;

        if (localStorage.getItem("ghostmen-" + aula) === "true") {
            card.classList.add("completed");
        }
    });
}

function concluirAula(aula) {
    localStorage.setItem("ghostmen-" + aula, "true");
}

atualizarProgresso();
