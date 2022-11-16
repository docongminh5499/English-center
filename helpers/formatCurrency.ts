export function formatCurrency(amount?: number): string {
    if (amount === undefined) return "-.---.--- đ";
    return amount.toLocaleString('vi', { style: 'currency', currency: 'VND' });
}