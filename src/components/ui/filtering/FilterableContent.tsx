import React from 'react';

interface FilterableContentProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}

export const FilterableContent: React.FC<FilterableContentProps> = ({
  children,
  isVisible,
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
};

export default FilterableContent;
