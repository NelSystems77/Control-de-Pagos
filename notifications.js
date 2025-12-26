const pagos = [
    { nombre: "Enero 1ª bis + RN", fecha: "2026-01-09" },
    { nombre: "Excedentes FRAP", fecha: "2026-01-09" },
    { nombre: "Salario Escolar", fecha: "2026-01-16" },
    { nombre: "Enero 2ª bis + Extras Noviembre", fecha: "2026-01-23" },
    { nombre: "Pago de Uniformes (T1)", fecha: "2026-01-29" }, // Agregado
    { nombre: "Febrero 1ª bis + RN + FER (01/25)", fecha: "2026-02-06" },
    { nombre: "Febrero 2ª bis + Extras Diciembre", fecha: "2026-02-20" },
    { nombre: "Excedentes ASECCSS", fecha: "2026-02-00" },
    { nombre: "Marzo 1ª bis + RN + FER (01)", fecha: "2026-03-06" },
    { nombre: "Marzo 2ª bis + Extras Enero", fecha: "2026-03-20" },
    { nombre: "Abril 1ª bis + RN", fecha: "2026-04-03" },
    { nombre: "Abril 2ª bis + Extras Febrero", fecha: "2026-04-17" },
    { nombre: "Pago de Uniformes (T2)", fecha: "2026-04-23" }, // Agregado
    { nombre: "Mayo 1ª bis + RN", fecha: "2026-05-01" },
    { nombre: "Excedentes COOPECAJA", fecha: "2026-05-00" },
    { nombre: "Mayo 2ª bis + Extras Marzo", fecha: "2026-05-15" },
    { nombre: "Mayo 3ª bis", fecha: "2026-05-29" },
    { nombre: "Junio 1ª bis + RN + FER (2/3/11)", fecha: "2026-06-12" },
    { nombre: "Junio 2ª bis + Extras Abril", fecha: "2026-06-26" },
    { nombre: "Julio 1ª bis + RN + FER (1)", fecha: "2026-07-10" },
    { nombre: "Pago de Uniformes (T3)", fecha: "2026-07-16" }, // Agregado
    { nombre: "Julio 2ª bis + Extras Mayo", fecha: "2026-07-24" },
    { nombre: "Agosto 1ª bis + RN", fecha: "2026-08-07" },
    { nombre: "Agosto 2ª bis + Extras Junio", fecha: "2026-08-21" },
    { nombre: "Septiembre 1ª bis + RN + FER (25)", fecha: "2026-09-04" },
    { nombre: "Septiembre 2ª bis + Extras Julio", fecha: "2026-09-18" },
    { nombre: "Octubre 1ª bis + RN + FER (2/15/31)", fecha: "2026-10-02" },
    { nombre: "Octubre 2ª bis + Extras Agosto", fecha: "2026-10-16" },
    { nombre: "Pago de Uniformes (T4)", fecha: "2026-10-22" }, // Agregado
    { nombre: "Octubre 3ª bis", fecha: "2026-10-30" },
    { nombre: "Noviembre 1ª bis + RN + FER (15)", fecha: "2026-11-13" },
    { nombre: "Noviembre 2ª bis + Extras Septiembre", fecha: "2026-11-27" },
    { nombre: "Diciembre 1ª bis + RN + FER (12)", fecha: "2026-12-11" },
    { nombre: "Diciembre 2ª bis + Extras Octubre", fecha: "2026-12-25" }
];

function solicitarPermiso() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            const btn = document.querySelector('.btn-notify');
            if (btn) {
                btn.innerHTML = "<span>✅</span> Notificaciones Activas";
                btn.style.borderColor = "var(--success)";
                btn.style.color = "var(--success)";
            }
        }
    });
}

function renderizarPagos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const contenedor = document.getElementById("listaPagos");
    if (!contenedor) return;
    
    contenedor.innerHTML = ""; 

    // Ordenamos los pagos por fecha para asegurar la cronología
    const pagosOrdenados = [...pagos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    pagosOrdenados.forEach(pago => {
        const fechaPago = new Date(pago.fecha + "T00:00:00");
        const diferenciaTiempo = fechaPago - hoy;
        const dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (dias >= 0) {
            const div = document.createElement("div");
            div.className = "pago";

            let claseStatus = "ok";
            let textoDias = `Faltan ${dias} días`;

            if (dias === 0) {
                claseStatus = "urgente";
                textoDias = "¡Vence hoy!";
                notificarPago(pago.nombre, "hoy mismo");
            } else if (dias <= 5) {
                claseStatus = "pendiente";
                textoDias = `En ${dias} días`;
                notificarPago(pago.nombre, `en ${dias} días`);
            }

            div.innerHTML = `
                <div class="pago-info">
                    <h3>${pago.nombre}</h3>
                    <p>📅 ${fechaPago.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div class="status-badge ${claseStatus}">
                    ${textoDias}
                </div>
            `;

            contenedor.appendChild(div);
        }
    });
}

function notificarPago(nombre, mensaje) {
    if (Notification.permission === "granted") {
        const cacheKey = `notificado_${nombre}`;
        if (!localStorage.getItem(cacheKey)) {
            new Notification("Recordatorio de Pago", {
                body: `${nombre} vence ${mensaje}`,
                icon: "icon-192.png"
            });
            localStorage.setItem(cacheKey, "true");
        }
    }
}

document.addEventListener("DOMContentLoaded", renderizarPagos);
