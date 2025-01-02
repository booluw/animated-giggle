export const fetchAwardingCompanies = async () => (await fetch(import.meta.env.VITE_SERVER_URL + '/awarding-company')).json()

export const addNewTransaction = async function (transaction: FormData) {
  return (await fetch(import.meta.env.VITE_SERVER_URL + '/transaction', {
    body: transaction,
    method: 'POST'
  })).json()
}
