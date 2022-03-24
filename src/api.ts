const BASE_URL = 'https://api.coinpaprika.com/v1';

export async function fetchCoins() {
    return fetch(`${BASE_URL}/coins`)
        .then((response) => response.json())
        .then((json) => json.slice(0, 100));
}

export async function fetchCoinInfo(coinId: string) {
    return fetch(`${BASE_URL}/coins/${coinId}`)
        .then((response) => response.json());
}

export async function fetchCoinTickers(coinId: string) {
    return fetch(`${BASE_URL}/tickers/${coinId}`)
        .then((response) => response.json());
}

export async function fetchCoinHistory(coinId: string) {
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7 * 2;
    return fetch(`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`)
        .then((response) => response.json());
}