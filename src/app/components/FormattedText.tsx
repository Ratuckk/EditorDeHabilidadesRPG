import { formatText, processLineBreaks, FormattedTextPart } from '../utils/textFormatter';

interface FormattedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FormattedText({ text, className = '', style }: FormattedTextProps) {
  const lines = processLineBreaks(text);

  return (
    <div className={className} style={style}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {formatText(line).map((part: FormattedTextPart, partIndex: number) => (
            <span
              key={partIndex}
              style={{ color: part.color }}
            >
              {part.text}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}