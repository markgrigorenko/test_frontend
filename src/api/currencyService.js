export async function fetchCurrencyRates() {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD'
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function fetchCurrencyData() {
  try {
    const response = await fetch(
      'https://status.neuralgeneration.com/api/currency'
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(error.message)
  }
}
