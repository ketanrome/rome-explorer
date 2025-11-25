import React from 'react';

interface TabsProps<T extends string> {
  tabs: { label: string; value: T }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div
      className={`overflow-x-auto border-b border-gray-200 mb-4 min-h-[48px] ${className}`}
    >
      <div className="flex w-max h-full">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-3 font-medium focus:outline-none transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
              activeTab === tab.value
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => onTabChange(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
