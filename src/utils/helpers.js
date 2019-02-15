
export const formatAmount = (val) => {
    return Number(val).toFixed(2);
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
