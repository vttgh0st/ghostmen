const aulas = [
    "o-que-e-ti",
    "hardware-software",
    "sistemas-operacionais",
    "arquivos-pastas",
    "terminal",
    "internet"
];

const totalAulas = aulas.length;
const XP_POR_AULA = 100;

function getConcluidas() {
    return aulas.filter(aula =>
        localStorage.getItem("ghostmen-" + aula) === "true"
    );
}

function getXP() {
    return Number(localStorage.getItem("ghostmen-xp") || 0);
}

function getNivel() {
    return Math.floor(getXP() / 300) + 1;
}

function atualizarProgresso() {
    const concluidas = getConcluidas().length;
    const xp = getXP();
    const nivel = getNivel();

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

    atualizarPainel(xp, nivel, concluidas);
}

function atualizarPainel(xp, nivel, concluidas) {
    const area = document.querySelector(".progress-box");

    if (!area || document.getElementById("ghostmen-panel")) return;

    const painel = document.createElement("div");
    painel.id = "ghostmen-panel";

    painel.innerHTML = `
        <div class="gm-profile">
            <div class="gm-avatar">👻</div>

            <div class="gm-info">
                <span>ALUNO GHOSTMEN</span>
                <strong>NÍVEL ${nivel}</strong>
                <small>${xp} XP</small>
            </div>

            <div class="gm-level">
                <div class="gm-level-top">
                    <span>Próximo nível</span>
                    <b>${xp % 300}/300 XP</b>
                </div>

                <div class="gm-xp">
                    <div style="width:${(xp % 300) / 3}%"></div>
                </div>
            </div>
        </div>

        <div class="gm-achievements">
            <div class="achievement ${concluidas >= 1 ? "unlocked" : ""}">
                <span>⚡</span>
                <b>Primeiro passo</b>
                <small>Complete 1 aula</small>
            </div>

            <div class="achievement ${concluidas >= 3 ? "unlocked" : ""}">
                <span>🔥</span>
                <b>Em evolução</b>
                <small>Complete 3 aulas</small>
            </div>

            <div class="achievement ${concluidas >= 6 ? "unlocked" : ""}">
                <span>🏆</span>
                <b>Ghost Hacker</b>
                <small>Complete tudo</small>
            </div>
        </div>

        <div class="gm-actions">
            ${
                concluidas === totalAulas
                ? `<button onclick="gerarCertificado()">🎓 GERAR CERTIFICADO</button>`
                : ""
            }

            <button class="reset" onclick="resetarProgresso()">
                ↻ Resetar progresso
            </button>
        </div>
    `;

    area.insertAdjacentElement("afterend", painel);
}

function concluirAula(aula) {
    const chave = "ghostmen-" + aula;

    if (localStorage.getItem(chave) !== "true") {
        localStorage.setItem(chave, "true");

        const xpAtual = getXP();
        localStorage.setItem(
            "ghostmen-xp",
            xpAtual + XP_POR_AULA
        );

        const novoNivel = getNivel();

        alert(
            `👻 AULA CONCLUÍDA!\n\n+${XP_POR_AULA} XP\nNível atual: ${novoNivel}`
        );
    } else {
        alert("Essa aula já foi concluída! 👻");
    }

    atualizarProgresso();
}

function resetarProgresso() {
    const confirmar = confirm(
        "Tem certeza que deseja apagar todo o seu progresso?"
    );

    if (!confirmar) return;

    aulas.forEach(aula =>
        localStorage.removeItem("ghostmen-" + aula)
    );

    localStorage.removeItem("ghostmen-xp");

    location.reload();
}

function gerarCertificado() {
    const nome = prompt(
        "Digite seu nome para o certificado:"
    );

    if (!nome) return;

    const janela = window.open("", "_blank");

    janela.document.write(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Certificado Ghostmen TI</title>

<style>
body {
    margin: 0;
    background: #050505;
    color: white;
    font-family: Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.certificado {
    width: 850px;
    padding: 70px;
    border: 3px solid #00ff73;
    text-align: center;
    background: #090909;
    box-shadow: 0 0 50px rgba(0,255,115,.15);
}

.logo {
    color: #00ff73;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 4px;
}

h1 {
    font-size: 52px;
    margin: 45px 0 20px;
}

.nome {
    color: #00ff73;
    font-size: 36px;
    font-weight: bold;
}

p {
    color: #aaa;
    font-size: 18px;
    line-height: 1.7;
}

.assinatura {
    margin-top: 60px;
    color: #777;
}

@media print {
    body {
        background: white;
        color: black;
    }

    .certificado {
        box-shadow: none;
        color: black;
    }
}
</style>
</head>

<body>

<div class="certificado">

<div class="logo">👻 GHOSTMEN TI</div>

<h1>CERTIFICADO</h1>

<p>Certificamos que</p>

<div class="nome">${nome}</div>

<p>
concluiu a trilha introdutória
<strong>Ghostmen TI — Do Zero ao Avançado</strong>,
completando todas as 6 aulas disponíveis.
</p>

<div class="assinatura">
Ghostmen TI<br>
Tecnologia • Conhecimento • Evolução
</div>

</div>

<script>
setTimeout(() => window.print(), 500);
<\/script>

</body>
</html>
    `);

    janela.document.close();
}

atualizarProgresso();
