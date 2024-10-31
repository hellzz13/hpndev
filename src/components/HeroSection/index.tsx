import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="relative overflow-hidden font-mono bg-white dark:bg-gray-800">
      <header className="z-30 flex items-center w-full h-24 sm:h-32">
        <Navbar />
      </header>
      <div className="relative z-20 flex items-center">
        <div className="container relative flex flex-col items-center justify-between px-6 py-4 mx-auto">
          <div className="flex flex-col">
            <Image
              src="/studying.png"
              className="mx-auto rounded-full"
              width={176}
              height={176}
              alt={"Dev trabalhando"}
            />
            <p className="my-6 text-3xl text-center dark:text-white">
              Olá, eu sou o Hélio 🤘
              {/* Hi, I&#x27;m Hélio 🤘 */}
            </p>
            <h2 className="max-w-3xl py-2 mx-auto text-2xl font-bold text-center text-gray-800 md:text-4xl dark:text-white">
              {/* Front-end developer engineer, music, games, comics
                            and nerd stuffs. */}
              Desenvolvedor Front-end, apaixonado por música, games, quadrinhos
              e outras nerdices.
            </h2>
            {/* <div className="flex items-center justify-center mt-4">
              <Link
                href="https://github.com/hellzz13"
                target="_blank"
                className="px-4 py-2 my-2 uppercase bg-transparent border-2 border-gray-800 md:mt-16 dark:text-gray-800 dark:bg-white hover:dark:bg-gray-100 hover:bg-gray-800 hover:text-white text-md"
              >
                <p className="text-black">Check my code!</p>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
