import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

export const generatePDF = (arrayData, clientData) => {
  var client = clientData;
  // console.log(arrayData)
  var img = document.createElement('img');
  img.src = client.avatar;
  data = arrayData;
  let total = 0;
  data.forEach(element => {
    total = total + parseInt(element.total);
    element.date = element.date.toDate().toLocaleString();
    element.total = parseFloat(element.total).toLocaleString(localeParam.language, localeParam.currency)
  });
  const d = new Date();
  const today = d.toLocaleString();
  // console.log(data)
  var doc = new jsPDF()

  autoTable(doc, {
    body: [
      [
        {
          content: 'Lkl Pay',
          styles: {
            halign: 'left',
            fontSize: 20,
            textColor: '#ffffff'
          }
        },
        {
          content: 'Ventas',
          styles: {
            halign: 'center',
            fontSize: 20,
            textColor: '#ffffff'
          }
        },
        // doc.addImage(img, 'JPEG', 30, 20),
      ],
    ],
    theme: 'plain',
    styles: {
      fillColor: '#3366ff'
    }
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Reference: #INV0001'
          +`\nDate: ${today}`
          +'\nInvoice number: 123456',
          styles: {
            halign: 'right'
          }
        }
      ],
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Billed to:'
          +'\nJohn Doe'
          +'\nBilling Address line 1'
          +'\nBilling Address line 2'
          +'\nZip code - City'
          +'\nCountry',
          styles: {
            halign: 'left'
          }
        },
        {
          content: 'Shipping address:'
          +'\nJohn Doe'
          +'\nShipping Address line 1'
          +'\nShipping Address line 2'
          +'\nZip code - City'
          +'\nCountry',
          styles: {
            halign: 'left'
          }
        },
        {
          content: 'From:'
          +'\nCompany name'
          +'\nShipping Address line 1'
          +'\nShipping Address line 2'
          +'\nZip code - City'
          +'\nCountry',
          styles: {
            halign: 'right'
          }
        }
      ],
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Total Generado:',
          styles: {
            halign:'right',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: `${total.toLocaleString(localeParam.language, localeParam.currency)}`,
          styles: {
            halign:'right',
            fontSize: 20,
            textColor: '#3366ff'
          }
        }
      ],
      [
        {
          content: 'Due date: 2022-02-01',
          styles: {
            halign:'right'
          }
        }
      ]
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Resúmen de Ventas',
          styles: {
            halign:'left',
            fontSize: 14
          }
        }
      ]
    ],
    theme: 'plain'
  });

  /* Sales Table Content */
  autoTable(doc, {
    body: data,
    columns: [
      { header: 'Ticket', dataKey: 'id' },
      { header: 'Total', dataKey: 'total' },
      { header: 'Fecha', dataKey: 'date' },
      { header: 'Estado', dataKey: 'status' },
    ],
    theme: 'striped',
    headStyles:{
      halign: 'center',
      fillColor: '#343a40'
    },
    bodyStyles:{
      halign: 'center',
    }
  })

  /* autoTable(doc, {
    head: [['Items', 'Category', 'Quantity', 'Price', 'Tax', 'Amount']],
    body: [
      ['Product or service name', 'Category', '2', '$450', '$50', '$1000'],
      ['Product or service name', 'Category', '2', '$450', '$50', '$1000'],
      ['Product or service name', 'Category', '2', '$450', '$50', '$1000'],
      ['Product or service name', 'Category', '2', '$450', '$50', '$1000']
    ],
    theme: 'striped',
    headStyles:{
      fillColor: '#343a40'
    }
  }); */

  autoTable(doc, {
    body: [
      [
        {
          content: 'Subtotal:',
          styles:{
            halign:'right'
          }
        },
        {
          content: '$3600',
          styles:{
            halign:'right'
          }
        },
      ],
      [
        {
          content: 'Total tax:',
          styles:{
            halign:'right'
          }
        },
        {
          content: '$400',
          styles:{
            halign:'right'
          }
        },
      ],
      [
        {
          content: 'Total amount:',
          styles:{
            halign:'right'
          }
        },
        {
          content: '$4000',
          styles:{
            halign:'right'
          }
        },
      ],
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Terms & notes',
          styles: {
            halign: 'left',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia'
          +'molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum'
          +'numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium',
          styles: {
            halign: 'left'
          }
        }
      ],
    ],
    theme: "plain"
  });
  
  autoTable(doc, {
    body: [
      [
        {
          content: 'This is a centered footer',
          styles: {
            halign: 'center'
          }
        }
      ]
    ],
    theme: "plain"
  });
    
  doc.output('dataurlnewwindow'); 
  doc.output('save', `reporteDeTransacciones_${today}.pdf`);   
}

export const generateCSV = (arrayData, clientData) => {
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