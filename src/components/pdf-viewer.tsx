import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div className='h-[85vh] w-full border rounded-lg overflow-auto bg-muted/20'>
      <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
}
