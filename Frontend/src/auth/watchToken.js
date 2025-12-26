export function watchTokenExpiration() {
    window.addEventListener("storage", () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        }
    });
}
