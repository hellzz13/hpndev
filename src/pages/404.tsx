import Head from "next/head";
import Link from "next/link";

function NotFound() {
  return (
    <>
      <Head>
        <title>404 · Rota não encontrada | Hélio OS</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="crash-screen">
        <div className="crash-content">
          <span className="crash-system">HÉLIO OS / RECUPERAÇÃO DO SISTEMA</span>
          <div className="crash-face" aria-hidden="true">:(</div>
          <h1>Seu passeio encontrou<br />uma rota inesperada.</h1>
          <p>Esta página não existe por aqui. Acontece até nos melhores sistemas — vamos reiniciar a exploração?</p>
          <Link className="crash-restart" href="/">↻ &nbsp; Reiniciar Hélio OS <span aria-hidden="true">↗</span></Link>
          <p className="crash-hint">Você volta à mesa inicial do portfólio.</p>
          <div className="crash-diagnostics">
            <span>Código de parada</span>
            <strong>404 · PAGE_NOT_FOUND</strong>
            <span>Diagnóstico: você foi explorar um pouco além.</span>
          </div>
        </div>
        <footer className="crash-footer">✳ Hélio OS <span>Uma pequena falha no caminho. A curiosidade continua.</span></footer>
      </main>
    </>
  );
}

export default NotFound;
