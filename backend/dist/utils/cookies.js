const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
};
export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
};
export const clearAuthCookie = (res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
};
//# sourceMappingURL=cookies.js.map