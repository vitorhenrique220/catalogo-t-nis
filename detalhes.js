const cards = document.querySelectorAll(".card-categoria");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const alvo = card.dataset.alvo;

        document.getElementById(alvo).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


function irPara(id){
    document.getElementById(id).scrollIntoView({
        behavior:"smooth"
    });
}
