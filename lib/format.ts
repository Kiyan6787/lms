export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
    }).format(price);
}