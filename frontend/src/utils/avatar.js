
export const avatar = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    const firstName = words[0].charAt(0).toUpperCase();
    const lastName = words[words.length - 1].charAt(0).toUpperCase();

    return firstName + lastName;
};
