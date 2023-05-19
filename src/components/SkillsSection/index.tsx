import {
    TbBrandHtml5,
    TbBrandCss3,
    TbBrandJavascript,
    TbBrandTypescript,
    TbBrandReact,
    TbBrandReactNative,
    TbBrandGit,
    TbBrandNextjs,
    TbBrandTailwind,
} from "react-icons/tb";

const skills = [
    {
        name: "html 5",
        Icon: TbBrandHtml5,
        alt: "HTML5",
    },
    {
        name: "css 3",
        Icon: TbBrandCss3,
        alt: "CSS3",
    },
    {
        name: "javascript",
        Icon: TbBrandJavascript,
        alt: "Javascript",
    },
    {
        name: "typescript",
        Icon: TbBrandTypescript,
        alt: "Typescript",
    },
    {
        name: "reactjs",
        Icon: TbBrandReact,
        alt: "ReactJs",
    },
    {
        name: "nextjs",
        Icon: TbBrandNextjs,
        alt: "NextJs",
    },
    {
        name: "tailwindcss",
        Icon: TbBrandTailwind,
        alt: "TailwindCss",
    },
    {
        name: "react native",
        Icon: TbBrandReactNative,
        alt: "React Native",
    },
    {
        name: "git",
        Icon: TbBrandGit,
        alt: "Git",
    },
];

export default function SkillsSection() {
    return (
        <section
            className="p-6 dark:bg-gray-800 dark:text-gray-100"
            id="skills"
        >
            <div className="container p-4 mx-auto text-center">
                <h2 className="text-4xl font-bold">Skills</h2>
            </div>
            <div className="container flex flex-wrap justify-center mx-auto dark:text-gray-400">
                {skills.map(({ Icon, alt }) => {
                    return (
                        <div
                            className="flex justify-center w-1/2 p-6 align-middle md:w-1/3 xl:w-1/4"
                            key={alt}
                        >
                            <Icon className="w-20 h-20" strokeWidth={1.2} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
