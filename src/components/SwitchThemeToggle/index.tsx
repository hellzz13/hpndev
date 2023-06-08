import ThemeContext from "@/context/AppThemeContext";
import { useContext, useEffect } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function SwitchThemeToggle() {
    const { theme, setTheme, isBrowser } = useContext(ThemeContext);
    const newtheme = isBrowser && theme === "light" ? "dark" : "light";
    const userPreferenceTheme =
        isBrowser && window.matchMedia("(prefers-color-scheme: dark)").matches;

    useEffect(() => {
        const storageTheme = localStorage.getItem("hpndev-theme")?.toString();

        if (storageTheme) {
            return setTheme(
                localStorage.getItem("hpndev-theme")?.toString() as string
            );
        }

        if (userPreferenceTheme) {
            return setTheme("dark");
        }
        setTheme("light");
    }, [userPreferenceTheme, setTheme]);

    if (theme === "dark") {
        isBrowser && document.documentElement.classList.add("dark");
    } else {
        isBrowser && document.documentElement.classList.remove("dark");
    }

    function changeTheme() {
        setTheme(newtheme);
        isBrowser && localStorage.setItem("hpndev-theme", newtheme);
    }

    return (
        <button
            onClick={changeTheme}
            className="cursor-pointer dark:text-gray-100 mr-10 lg:mr-0 w-8 h-8 flex justify-center items-center"
        >
            {theme === "light" ? (
                <RiMoonFill size={24} />
            ) : (
                <RiSunFill size={24} />
            )}
        </button>
    );
}
