import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx/xlsx.mjs';
import { Timestamp } from 'firebase/firestore';
let data = [];
let today = new Date().toISOString().slice(0, 10);
const headers = {
  date: 'Fecha',
  id: 'Ticket',
  status: 'Estado',
  total: 'Total',
};
const localeParam = {
  language: 'es-MX',
  currency: {
    style: 'currency',
    currency: 'MXN'
  }
}

export const generatePDF = (arrayData) => {
  data = arrayData;
  data.forEach(element => {
    element.date = element.date.toDate().toLocaleString();
    element.total = parseFloat(element.total).toLocaleString(localeParam.language, localeParam.currency)
  });
  // console.log(data)
  var doc = new jsPDF()

  doc.autoTable({
    body: data,
    columns: [
      { header: 'Ticket', dataKey: 'id' },
      { header: 'Total', dataKey: 'total' },
      { header: 'Fecha', dataKey: 'date' },
      { header: 'Estado', dataKey: 'status' },
    ],
    styles: {
      lineColor: [44, 62, 80],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [160, 160, 160],
      fontSize: 15,
      halign: 'center',
    },
    bodyStyles: {
      fillColor: [224, 224, 224],
      textColor: 0,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    allSectionHooks: true,
  })
  
  
  doc.output('dataurlnewwindow'); 
  doc.output('save', `reporteDeTransacciones_${today}.pdf`);   
}

export const generateCSV = (arrayData) => {
  data = arrayData;

  const exportCSVFile = (headers, items, fileName) => {
    items.unshift(headers)
    const data = items.map(item => {
      return [item.date, item.id, item.status, item.total];
    });
    const workBook = XLSX.utils.book_new(); //create new workbook
    const workSheetData = [
      ...data
    ];
    // console.log(workSheetData)
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "Transacciones");
    // const csv = XLSX.utils.sheet_to_csv(workSheet)
    XLSX.writeFile(workBook, fileName)
  }
  exportCSVFile(headers, data, `reporteDeTransacciones_${today}.csv`);
}

export const generateXLSX = (arrayData) => {
  data = arrayData;
  const exportXLSXFile = (headers, items, fileName) => {
    items.unshift(headers)
    const data = items.map(item => {
      return [item.date, item.id, item.status, item.total];
    });
    const workBook = XLSX.utils.book_new(); //create new workbook
    const workSheetData = [
      ...data
    ];
    // console.log(workSheetData)
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "Transacciones");
    XLSX.writeFile(workBook, fileName)
  }

  exportXLSXFile(headers, data, `reporte_${today}.xlsx`);
}