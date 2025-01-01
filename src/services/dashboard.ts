export const fetchSummary = async () => (await fetch(import.meta.env.VITE_SERVER_URL + '/summary')).json();
