export const trimAddress = (address: string, limit: number = 10) => {
    return address.substring(0, limit) + '...' + address.substring(address.length - limit)
}
