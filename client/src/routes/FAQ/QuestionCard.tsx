import { useState, type MouseEvent, type PropsWithChildren, type ReactNode } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

type QuestionCardProps = PropsWithChildren & {
  question: ReactNode;
  answer: ReactNode;
};

const QuestionCard = ({ question, answer, children }: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const openContainer = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full rounded-md border border-accent p-2 relative">
      <div onClick={openContainer}>
        <RiArrowDropDownLine className={`absolute right-0 text-2xl ${isOpen && "-rotate-180"} transition-all ease-in-out`} />
        <h1>Q: {question}</h1>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="pt-2 whitespace-pre-line">A: {answer}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
