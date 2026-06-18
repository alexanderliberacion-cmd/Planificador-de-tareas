export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    return passwordRegex.test(password);
}

export function validateTask(nombre, descripcion) {
    if (!nombre || !descripcion) return false;
    if (typeof nombre !== "string" || typeof descripcion!== "string") return false;
    if (nombre.trim().length === 0 || descripcion.trim().length === 0) return false;
    return true;
}