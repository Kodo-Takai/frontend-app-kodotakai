import React from 'react';
import '../../styles/index.scss'


interface Props {
  children: React.ReactNode;
  title?: string;
  helper?: string;
}

export default function AuthLayout({ children, title, helper }: Props) {
  return (
    <div className="page-bg">
      <div className="card">
        {title && <h1 className="card-title">{title}</h1>}
        {helper && <p className="helper">{helper}</p>}
        {children}
      </div>
    </div>
  );
}
