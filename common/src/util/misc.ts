export const getRandomStr = (len: number) => {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
};
