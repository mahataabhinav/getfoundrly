import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface AccordionFAQProps {
  items: FAQItem[];
  defaultOpen?: number;
}

export default function AccordionFAQ({ items, defaultOpen }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-lg font-semibold text-gray-900 pr-8">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
