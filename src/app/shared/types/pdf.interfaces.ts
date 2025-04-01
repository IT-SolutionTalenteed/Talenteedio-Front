export interface PdfSize {
    format?: 'A4' | 'A5';
    height?: string | number;
    width?: string | number;
}

export interface PdfParameter {
    name?: string;
    height?: number;
    width?: number;
    scale?: number;
    url: string;
    authentication: string | null;
    waitForCssSelector?: string | null;
    pdfSize?: PdfSize;
}
