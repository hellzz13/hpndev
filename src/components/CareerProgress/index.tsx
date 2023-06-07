const experiences = [
    {
        company: "QuikDev",
        title: "Desenvolvedor Front-end",
        content:
            "Participei de um projeto de sistema web para fintech de financiamento de energia solar,com tecnologias do ecossistema do React, usando NextJs + Tailwindcss para desenvolver UI seguindo padrões de desenvolvimento e responsividade de layout beseados no figma. Participei também de projeto educacional gameficado seguindo padrões de acessibilidade utilizando NextJs + Metarial Ui, também baseado em design pre-desenvolvidos.",
        skills: "TypeScript · NextJs · TailwindCss · HTML · JavaScript · CSS · React.js",
        date: "jul de 2022 - abr de 2023",
        alt: "Cargo desenvolvedor front-end QuikDev",
    },

    {
        company: "Devio",
        title: "Desenvolvedor Front-end",
        content:
            "Desenvolver interfaces de sistemas com layout funcional sob demanda com as mais modernas ferramentas do mercado, seguindo protótipo desenvolvido previamente pelo time de design. Trabalhando em equipe visando o foco no produto final e qualidade e usabilidade para o cliente.",
        skills: "React Native · TailwindCss · Styled-components · HTML · JavaScript · CSS · React.js",
        date: "set de 2021 - jul de 2022",
        alt: "Cargo desenvolvedor front-end Devio",
    },
    {
        company: "Unique Controle Gestão de Processos",
        title: "Desenvolvedor Web",
        content:
            "Trabalhando com tecnologias web no ecossistema Javascript, para dar manutenção e desenvolver novas funcionalidade no produto principal da empresa, com apoio e treinamento do supervisor. Manutenção em um sistema de gestão de correspondência feito em Angular.",
        skills: "Angular · HTML5 · JavaScript · CSS · React.js",
        date: "mai de 2021 - set de 2021",
        alt: "Cargo desenvolvedor web unique controle e gestão de processos",
    },
    {
        company: "Freelancer",
        title: "Desenvolvedor Web",
        content:
            "Trabalhando com tecnologias web no ecossistema Javascript, para dar manutenção e desenvolver novas funcionalidade no produto principal da empresa, com apoio e treinamento do supervisor. Manutenção em um sistema de gestão de correspondência feito em Angular.",
        skills: "HTML5 · JavaScript · CSS",
        date: "dez de 2019 - mai de 2021",
        alt: "Cargo desenvolvedor web freelancer",
    },
];

export default function CarrearProgress() {
    return (
        <section className="dark:bg-gray-800 dark:text-gray-100" id="career">
            <div className="container p-4 mx-auto text-center">
                <h2 className="text-4xl font-bold">Experiências</h2>
            </div>
            <div className="container max-w-5xl px-4 py-10 mx-auto space-y-4">
                {experiences &&
                    experiences.map((exp, index) => (
                        <div
                            className="grid gap-4 mx-4 sm:grid-cols-12 lg:px-0 px-10 md:mb-0 mb-12"
                            key={index}
                        >
                            <div className="col-span-12 sm:col-span-3">
                                <div className="text-center sm:text-left mb-2 md:mb-14 before:block before:w-24 before:h-3 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:dark:bg-violet-400">
                                    <h3
                                        className={
                                            exp.company.length > 10
                                                ? "text-xl font-semibold"
                                                : "text-3xl font-semibold"
                                        }
                                    >
                                        {exp.company}
                                    </h3>
                                    <span className="text-xs font-bold tracking-wider uppercase dark:text-gray-400 w-10">
                                        {exp.skills}
                                    </span>
                                </div>
                            </div>
                            <div className="relative col-span-12 md:px-4 space-y-6 sm:col-span-9">
                                <div className="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">
                                    <div className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400">
                                        <h3 className="text-xl font-semibold tracking-wide">
                                            {exp.title}
                                        </h3>
                                        <time className="text-xs tracking-wide uppercase dark:text-gray-400">
                                            {exp.date}
                                        </time>
                                        <p className="mt-3 text-justify">
                                            {exp.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}
