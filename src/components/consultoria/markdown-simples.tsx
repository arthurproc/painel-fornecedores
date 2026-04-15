import { Fragment } from "react";

interface MarkdownSimplesProps {
  conteudo: string;
  className?: string;
}

function renderInline(texto: string, keyBase: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
  let ultimoIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimoIndex) {
      parts.push(texto.slice(ultimoIndex, match.index));
    }
    const key = `${keyBase}-${i++}`;
    if (match[1]) {
      parts.push(<strong key={key}>{match[1]}</strong>);
    } else if (match[2]) {
      parts.push(<em key={key}>{match[2]}</em>);
    } else if (match[3]) {
      parts.push(
        <code key={key} className="rounded bg-muted px-1 py-0.5 text-xs">
          {match[3]}
        </code>
      );
    } else if (match[4] && match[5]) {
      parts.push(
        <a
          key={key}
          href={match[5]}
          className="text-primary underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[4]}
        </a>
      );
    }
    ultimoIndex = match.index + match[0].length;
  }
  if (ultimoIndex < texto.length) {
    parts.push(texto.slice(ultimoIndex));
  }
  return parts;
}

export function MarkdownSimples({ conteudo, className }: MarkdownSimplesProps) {
  const linhas = conteudo.split(/\r?\n/);
  const blocos: React.ReactNode[] = [];
  let listaAberta: string[] | null = null;

  function fecharLista(key: string) {
    if (listaAberta) {
      blocos.push(
        <ul key={`ul-${key}`} className="mb-3 list-disc space-y-1 pl-5 text-sm">
          {listaAberta.map((item, idx) => (
            <li key={idx}>{renderInline(item, `${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      listaAberta = null;
    }
  }

  linhas.forEach((linha, idx) => {
    const key = `l-${idx}`;
    if (/^\s*[-*]\s+/.test(linha)) {
      if (!listaAberta) listaAberta = [];
      listaAberta.push(linha.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    fecharLista(key);

    if (/^###\s+/.test(linha)) {
      blocos.push(
        <h4 key={key} className="mt-3 text-sm font-semibold">
          {renderInline(linha.replace(/^###\s+/, ""), key)}
        </h4>
      );
      return;
    }
    if (/^##\s+/.test(linha)) {
      blocos.push(
        <h3 key={key} className="mt-4 text-base font-semibold">
          {renderInline(linha.replace(/^##\s+/, ""), key)}
        </h3>
      );
      return;
    }
    if (/^#\s+/.test(linha)) {
      blocos.push(
        <h2 key={key} className="mt-4 text-lg font-semibold">
          {renderInline(linha.replace(/^#\s+/, ""), key)}
        </h2>
      );
      return;
    }
    if (linha.trim().length === 0) {
      return;
    }
    blocos.push(
      <p key={key} className="mb-2 text-sm leading-relaxed text-muted-foreground">
        {renderInline(linha, key)}
      </p>
    );
  });

  fecharLista("final");

  return <div className={className}>{blocos.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
