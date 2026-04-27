import type { ReactNode } from "react";
import QuestionCard from "./QuestionCard";
import { Link } from "react-router";

type QuestionType = {
  question: ReactNode;
  answer: ReactNode;
  children?: ReactNode;
};

const FAQ = () => {
  const questions: QuestionType[] = [
    {
      question: "Where can I park?",
      answer: "The lot next door.\nAcross the street by the white building.\nAlong the street.",
      children: <img src="/parking.jpg"></img>
    },
    {
      question: "How should I dress?",
      answer: "Semi-Formal or star wars costumes. \n Wedding colors are blue/Green if you'd like to match.",
    },
    {
      question: "How do I get there?",
      answer:
        "Get on the 38 heading away from redlands. Continue for 12 miles, then turn right, onto Valley of the Falls drive. Continue for 4 miles then the destination will be on the right.\n (Or just use a GPS :p)",
    },
    {
      question: "Do I mail or bring a gift?",
      answer: (
        <span>
          Gifts are not expected, however, you are welcome to purchase something from the registry{" "}
          <Link to={"/registry"} className="text-purple-500 underline">
            here
          </Link>{" "}
          and have it delivered to our home OR bring it with you in person :)
        </span>
      ),
    },
  ];
  return (
    <main className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="max-w-3xl mx-auto space-y-4">
        <div className="w-full text-center">
          <p className="inline-flex rounded-full border border-secondary/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-textcolor backdrop-blur">
            Helpful Details
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-textcolor sm:text-4xl">FAQs</h1>
          <hr className="mt-3 border-secondary/40" />
        </div>
        <div className="flex flex-col w-full max-w-4xl px-8 gap-y-2 rounded-2xl border border-primary/20 bg-white/75 py-3 shadow-[0_20px_50px_-34px_rgba(85,120,94,0.45)] backdrop-blur-sm">
          {questions.map((obj, i) => (
            <QuestionCard key={i} question={obj.question} answer={obj.answer}>
              {obj?.children}
            </QuestionCard>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FAQ;
