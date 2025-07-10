import {
    altProtocolStats,
    derivateStats,
    lendStats,
    pairStats,
} from "../types/backTypes"

const linkMap: { [key: string]: { [key: string]: string } } = {
    myswap: {
        "Provide Liquidity": "https://app.myswap.xyz/#/positions",
    },
    sithswap: {
        "Provide Liquidity": "https://app.sithswap.com/all/",
    },
    starkdefi: {
        "Provide Liquidity": "https://app.starkdefi.com/#/pool",
    },
    nostra: {
        "Provide Liquidity": "https://app.nostra.finance/pools",
        Lend: "https://app.nostra.finance/lend-borrow",
    },
    haiko: {
        "Provide Liquidity": "https://app.haiko.xyz/positions",
    },
    ekubo: {
        "Provide Liquidity": "https://app.ekubo.org/positions",
    },
    "10kswap": {
        "Provide Liquidity": "https://10kswap.com/pool",
    },
    vesu: {
        Lend: "https://vesu.xyz/pools/new",
    },
    nimbora: {
        Strategies: "https://app.nimbora.io/",
        Lend: "https://app.nimbora.io/",
    },
    hashstack: {
        Lend: "https://app.hashstack.finance/v1/market/",
    },
    zklend: {
        Lend: "https://app.zklend.com/markets",
    },
    zkx: {
        Derivatives: "https://app.zkx.fi/",
    },
    carmine: {
        Derivatives: "https://app.carmine.finance/trade",
    },
    opus: {
        Strategies: "https://app.opus.money/",
    },
    haiko_solvers: {
        "Provide Liquidity": "https://app.haiko.xyz/positions",
    },
}

export const getRedirectLink = (
    appName: string,
    actionType: string,
    poolInfo?: string
) => {
    const app = appName.toLowerCase()

    if (app.includes("jediswap")) {
        if (actionType === "Provide Liquidity") {
            if (poolInfo) {
                const { first, second } = parseTokenPair(poolInfo)
                if (first && second) {
                    return `https://app.jediswap.xyz/#/add/`
                }
            }
            return "https://app.jediswap.xyz/#/pools"
        }
    }

    const baseUrl = linkMap[app]?.[actionType]
    if (!baseUrl) return ""

    if (!poolInfo) return baseUrl

    const { first, second } = parseTokenPair(poolInfo)
    console.log(app, baseUrl, poolInfo)

    switch (app) {
        case "myswap":
            if (first && second) {
                return `${baseUrl.replace(
                    /#\/positions$/,
                    "#/create-position"
                )}`
            }
            break

        case "sithswap":
            if (first && second) {
                return baseUrl
            }
            break

        case "starkdefi":
            if (first && second) {
                return `${baseUrl}/add/`
            }
            break

        case "nostra":
            if (first && second) {
                return `https://app.nostra.finance/pools/${first}-${second}/deposit`
            } else if (first) {
                return `https://app.nostra.finance/lend-borrow/${first}/deposit`
            }
            break

        case "vesu":
            if (first) {
                return baseUrl
            }
            break

        case "haiko":
            console.log(parseTokenPair(poolInfo), "login this", first && second)
        case "haiko_solvers":
            if (first && second) {
                console.log("ekubo", first, second)
                return `https://app.haiko.xyz/positions/new?token0=${first}&token1=${second}`
            }
            break

        case "ekubo":
            if (first && second) {
                return `${baseUrl}/new?baseCurrency=${first.toUpperCase()}&quoteCurrency=${second.toUpperCase()}`
            }
            break

        case "10kswap":
            if (first && second) {
                return `${baseUrl}`
            }
            break

        case "zklend":
            if (first) {
                return `https://app.zklend.com/asset/${first}`
            }
            break

        case "hashstack":
            if (first) {
                return baseUrl
            }
            break

        case "nimbora":
            if (
                (actionType === "Strategies" || actionType === "Lend") &&
                first
            ) {
                return baseUrl
            }
            break

        case "zkx":
        case "carmine":
            if (first && second) {
                return `${baseUrl}?pair=${first}-${second}`
            } else if (first) {
                return `${baseUrl}?token=${first}`
            }
            break

        case "opus":
            if (first) {
                return `${baseUrl}`
            }
            break
    }

    return baseUrl
}

export const formatStatsData = (
    derivatesStats: derivateStats | null,
    lendingStats: lendStats | null,
    pairingStats: pairStats | null,
    altProtocolStats: altProtocolStats | null
): TableInfo[] => {
    const res: TableInfo[] = []

    if (derivatesStats) {
        Object.keys(derivatesStats).map((eachKey) => {
            const item: TableInfo = {
                title: derivatesStats[eachKey].protocol,
                action: "Derivatives",
                apr: derivatesStats[eachKey].apr * 100,
                volume: derivatesStats[eachKey].volumes,
                daily_rewards: derivatesStats[eachKey].allocation,
                app: eachKey,
            }
            res.push(item)
        })
    }

    if (lendingStats) {
        Object.keys(lendingStats).map((eachKey) => {
            Object.keys(lendingStats[eachKey]).map((eachSubKey) => {
                const item: TableInfo = {
                    title: eachSubKey,
                    action: "Lend",
                    apr:
                        lendingStats[eachKey][eachSubKey].strk_grant_apr_nrs *
                        100,
                    volume: lendingStats[eachKey][eachSubKey].supply_usd,
                    daily_rewards: lendingStats[eachKey][eachSubKey].allocation,
                    app: eachKey,
                }
                res.push(item)
            })
        })
    }

    if (pairingStats) {
        Object.keys(pairingStats).map((eachKey) => {
            Object.keys(pairingStats[eachKey]).map((eachSubKey) => {
                if (eachSubKey.toLocaleLowerCase() === "discretionary") return
                const item: TableInfo = {
                    title: eachSubKey,
                    action: "Provide Liquidity",
                    apr: pairingStats[eachKey][eachSubKey].apr * 100,
                    volume: pairingStats[eachKey][eachSubKey].tvl_usd,
                    daily_rewards: pairingStats[eachKey][eachSubKey].allocation,
                    app: eachKey,
                }
                res.push(item)
            })
        })
    }

    if (altProtocolStats) {
        Object.keys(altProtocolStats).map((eachKey) => {
            Object.keys(altProtocolStats[eachKey]).map((eachSubKey) => {
                const item: TableInfo = {
                    title: eachSubKey,
                    action: "Strategies",
                    apr: altProtocolStats[eachKey][eachSubKey].apr * 100,
                    volume: altProtocolStats[eachKey][eachSubKey].tvl_usd,
                    daily_rewards:
                        altProtocolStats[eachKey][eachSubKey].allocation,
                    app: eachKey,
                }
                res.push(item)
            })
        })
    }

    return res
}

export const splitTitle = (title: string) => {
    const delimiters = ["/", "|", "-", " ", "_"]
    for (const delimiter of delimiters) {
        if (title.includes(delimiter)) {
            const [first, second] = title.split(delimiter)
            return {
                first: first.trim(),
                second: second?.trim() ?? "",
            }
        }
    }
    return {
        first: title.trim(),
        second: "",
    }
}

export const getTokenIcon = (token: string): string => {
    if (!token) return ""
    token = token.includes("btc") ? "btc" : token
    const normalizedToken = token.toLowerCase().trim()
    return `/tokens/${normalizedToken}.svg`
}

export const getProtocolIcon = (token: string): string => {
    if (!token) return ""
    const normalizedToken = token.toLowerCase().trim()
    return `/${normalizedToken}/favicon.ico`
}

export const getProtocolName = (title: string): string => {
    const titleObj = splitTitle(title)
    return titleObj.first
}

export const parseTokenPair = (title: string) => {
    if (!title) return { first: "", second: "" }
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return { first: "", second: "" }
    const normalizedTitleLower = normalizedTitle.toLowerCase()
    if (normalizedTitleLower.includes("staking")) {
        const token = normalizedTitleLower.replace(/\bstaking\b/gi, "").trim()
        return { first: token, second: "" }
    }
    return splitTitle(normalizedTitle)
}
