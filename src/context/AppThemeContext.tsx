import { createContext, useState } from "react";

interface IProps {
    children: React.ReactElement | React.ReactElement[];
}

type ThemeProps = {
    theme: string;
    setTheme: (state: string) => void;
    isBrowser: boolean;
    setIsBrowser: (state: boolean) => void;
};

const checkDom = typeof window !== "undefined";

const DEFAULT_VALUE = {
    theme: "",
    setTheme: () => {},
    isBrowser: checkDom,
    setIsBrowser: () => {},
};

const ThemeContext = createContext<ThemeProps>(DEFAULT_VALUE);

const ThemeContextProvider = ({ children }: IProps) => {
    const [theme, setTheme] = useState(DEFAULT_VALUE.theme);
    const [isBrowser, setIsBrowser] = useState(DEFAULT_VALUE.isBrowser);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                isBrowser,
                setIsBrowser,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContextProvider };
export default ThemeContext;
