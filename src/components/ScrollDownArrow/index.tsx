import { RiArrowDownLine } from "react-icons/ri";

export default function ScrollDownArrow() {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="animate-bounce">
                <RiArrowDownLine
                    size={40}
                    className="text-gray-800 dark:text-white"
                />
            </div>
        </div>
    );
}
