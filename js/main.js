
(() => {
    const seccion = document.querySelector("#servicios");
    if (!seccion) return;

    const opciones = [...seccion.querySelectorAll(".servicio-opcion")];
    const panel = seccion.querySelector(".servicio-detalle");
    const imagen = seccion.querySelector("#servicio-imagen");
    const titulo = seccion.querySelector("#servicio-titulo");
    const descripcion = seccion.querySelector("#servicio-descripcion");
    const indice = seccion.querySelector(".servicio-indice");

    function activarServicio(opcion) {
        if (!opcion || opcion.classList.contains("activo")) return;

        opciones.forEach(item => {
            const activo = item === opcion;
            item.classList.toggle("activo", activo);
            item.setAttribute("aria-pressed", String(activo));
        });

        titulo.textContent =
            opcion.querySelector(".servicio-nombre").textContent.trim();

        descripcion.textContent = opcion.dataset.descripcion;
        imagen.src = opcion.dataset.imagen;

        const numero = String(opciones.indexOf(opcion) + 1).padStart(2, "0");
        indice.textContent = `${numero} / 03`;

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            panel.animate(
                [
                    { opacity: 0.85, transform: "translateY(6px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                { duration: 260, easing: "ease-out" }
            );
        }
    }

    opciones.forEach(opcion => {
        opcion.addEventListener("pointerenter", evento => {
            if (evento.pointerType === "mouse") activarServicio(opcion);
        });

        opcion.addEventListener("focus", () => activarServicio(opcion));
        opcion.addEventListener("click", () => activarServicio(opcion));
    });

    // Sincroniza el servicio activo con el desplazamiento.
    let pendiente = false;

    window.addEventListener("scroll", () => {
        if (window.innerWidth <= 768) return;
        if (seccion.querySelector(".servicios-lista:hover")) return;
        if (pendiente) return;

        pendiente = true;

        requestAnimationFrame(() => {
            pendiente = false;

            const rect = seccion.getBoundingClientRect();

            if (
                rect.top > window.innerHeight * 0.75 ||
                rect.bottom < window.innerHeight * 0.25
            ) return;

            const referencia = window.innerHeight * 0.35;

            const cercana = opciones.reduce((mejor, opcion) => {
                const a = opcion.getBoundingClientRect();
                const b = mejor.getBoundingClientRect();

                const distanciaA = Math.abs(a.top + a.height / 2 - referencia);
                const distanciaB = Math.abs(b.top + b.height / 2 - referencia);

                return distanciaA < distanciaB ? opcion : mejor;
            });

            activarServicio(cercana);
        });
    }, { passive: true });
})();
