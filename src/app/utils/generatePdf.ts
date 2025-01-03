import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from a specified HTML element.
 * @param {HTMLElement} element - The HTML element to convert to a PDF.
 * @param {string} [filename='report.pdf'] - The name of the generated PDF file.
 */
export function generatePdf(element: HTMLElement, filename: string = 'report.pdf'): void {
  if (!element) {
    console.error('Error: Unable to find the PDF template.');
    alert('Error: Unable to find the PDF template.');
    return;
  }

  console.log('Element found:', element);
  html2canvas(element, { scale: 2 })
  .then((canvas) => {
    console.log('Canvas created:', canvas);
    const imgData = canvas.toDataURL('image/png');
    console.log('Image data:', imgData);
    console.log('Canvas Width:', canvas.width, 'Height:', canvas.height);
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    console.log('PDF Dimensions:', pdfWidth, pdfHeight);
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  })
  .catch((error) => {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF.');
  });
}
