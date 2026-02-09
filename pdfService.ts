
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PropertyDetails, EstimateCategory } from './types';

export const exportToPDF = (property: PropertyDetails, categories: EstimateCategory[], analysis?: string) => {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // primary color
  doc.text('PropertyPro Renovation Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);
  doc.line(14, 32, pageWidth - 14, 32);

  // Property Overview
  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.text('Property Details', 14, 42);
  
  const propertyInfo = [
    ['Address', property.address || 'Not Provided'],
    ['Type', property.type],
    ['Year Built', property.yearBuilt || 'N/A'],
    ['Dimensions', `${property.sqft || 0} SqFt / ${property.lotSize || 0} Acres`],
    ['Config', `${property.beds || 0} Beds / ${property.baths || 0} Baths`],
    ['Est. ARV', property.estimatedARV || '$0']
  ];

  doc.autoTable({
    startY: 46,
    head: [],
    body: propertyInfo,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
  });

  // Cost Estimate
  const estimateStartY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Renovation Cost Estimate', 14, estimateStartY);

  let tableRows: any[] = [];
  let subtotal = 0;

  categories.forEach(cat => {
    const catSum = cat.items.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
    subtotal += catSum;
    
    // Category Header Row
    tableRows.push([
      { content: cat.name.toUpperCase(), colSpan: 5, styles: { fillColor: [241, 245, 249], fontStyle: 'bold' } }
    ]);

    cat.items.forEach(item => {
      const cost = Math.round(item.unitPrice * item.qty);
      tableRows.push([
        item.name,
        item.conditions || '-',
        `$${Math.round(item.unitPrice)}`,
        item.qty,
        `$${cost.toLocaleString()}`
      ]);
    });
  });

  doc.autoTable({
    startY: estimateStartY + 5,
    head: [['Item', 'Conditions', 'Unit Price', 'Qty', 'Cost']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: { 
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 5;
  const contingency = Math.round(subtotal * 0.15);
  const total = subtotal + contingency;

  doc.autoTable({
    startY: finalY,
    body: [
      ['Subtotal', `$${subtotal.toLocaleString()}`],
      ['Contingency (15%)', `$${contingency.toLocaleString()}`],
      ['Total Budget', `$${total.toLocaleString()}`]
    ],
    theme: 'plain',
    styles: { fontSize: 11, halign: 'right' },
    columnStyles: { 
      0: { width: pageWidth - 60 },
      1: { fontStyle: 'bold', width: 40 }
    }
  });

  // AI Analysis Section (if present)
  if (analysis) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('AI Investment Analysis', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(50);
    const splitText = doc.splitTextToSize(analysis, pageWidth - 28);
    doc.text(splitText, 14, 32);
  }

  doc.save(`Renovation_Report_${property.address.replace(/\s+/g, '_') || 'Report'}.pdf`);
};
