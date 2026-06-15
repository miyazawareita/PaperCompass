"use client";
import { useState } from "react";

type Quiz = {
  question: string;
  choices: { label: string; text: string }[];
  answer: string;
  explanation: string;
};

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected === quiz.answer;

  return (
    <div>
      <p><strong>{quiz.question}</strong></p>
      <div>
        {quiz.choices?.map((c) => (
          <button
            key={c.label}
            onClick={() => setSelected(c.label)}
            disabled={!!selected}
            style={{
              display: "block",
              margin: "8px 0",
              padding: "10px 16px",
              background: selected
                ? c.label === quiz.answer
                  ? "#4caf50"
                  : c.label === selected
                  ? "#f44336"
                  : "#eee"
                : "#eee",
              color: selected && (c.label === quiz.answer || c.label === selected)
                ? "white" : "black",
              border: "none",
              borderRadius: "8px",
              cursor: selected ? "default" : "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            {c.label}. {c.text}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: "12px" }}>
          <p>{isCorrect ? "✅ 正解！" : `❌ 不正解（正解: ${quiz.answer}）`}</p>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
