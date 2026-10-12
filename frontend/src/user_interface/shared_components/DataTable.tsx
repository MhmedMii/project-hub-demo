import type { ReactNode } from 'react';
import './DataTable.css';

export function DataTable({ caption, headings, children }: { caption: string; headings: string[]; children: ReactNode }) {
  return <div className="data-table-scroll"><table className="data-table"><caption className="sr-only">{caption}</caption>
    <thead><tr>{headings.map(heading => <th key={heading}>{heading}</th>)}</tr></thead>
    <tbody>{children}</tbody>
  </table></div>;
}
