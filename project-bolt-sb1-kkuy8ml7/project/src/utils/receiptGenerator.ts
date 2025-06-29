import pdfMake from 'pdfmake/build/pdfmake';
import { Receipt } from '../types';

// Configure pdfMake with reliable built-in fonts
const configurePdfMake = () => {
  // Use built-in fonts that are guaranteed to work
  pdfMake.fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  };
};

// Initialize pdfMake configuration
configurePdfMake();

export const generateReceipt = async (receipt: Receipt): Promise<void> => {
  try {
    console.log('Starting PDF generation for receipt:', receipt.id);
    
    // Create zones string
    const zones = receipt.zones.length > 0 ? receipt.zones.join(', ') : 'None';
    
    // Define the document structure with simplified fonts
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        lineHeight: 1.3
      },
      content: [
        // Header with red background
        {
          table: {
            widths: ['*'],
            body: [
              [{
                text: 'TRIPOLI KARTING RACE 2025',
                style: 'header',
                fillColor: '#dc2626',
                color: 'white',
                alignment: 'center',
                margin: [0, 10, 0, 10]
              }]
            ]
          },
          layout: 'noBorders'
        },
        
        { text: '', margin: [0, 10] }, // Spacer
        
        // Title section - Bilingual
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'RECEIPT', style: 'title', alignment: 'left' },
                { text: 'SEASON 1', style: 'subtitle', alignment: 'left' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'وصل استلام مبلغ', style: 'titleArabic', alignment: 'right' },
                { text: 'الموسم الأول', style: 'subtitleArabic', alignment: 'right' }
              ]
            }
          ]
        },
        
        // Divider line
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 2,
              lineColor: '#dc2626'
            }
          ],
          margin: [0, 10, 0, 15]
        },
        
        // Date row
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'DATE', style: 'label' },
                { text: receipt.date, style: 'value', color: '#3b82f6' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'تاريخ الاستلام', style: 'labelArabic', alignment: 'right' },
                { text: receipt.date, style: 'valueArabic', alignment: 'right', color: '#3b82f6' }
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Client name row
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'RECEIVED FROM', style: 'label' },
                { text: receipt.clientName, style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'وصلنا من السادة', style: 'labelArabic', alignment: 'right' },
                { text: receipt.clientName, style: 'valueArabic', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Amount row
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'AMOUNT', style: 'label' },
                { text: `$${receipt.price}`, style: 'value', color: '#3b82f6' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'مبلغ وقدره', style: 'labelArabic', alignment: 'right' },
                { text: `$${receipt.price}`, style: 'valueArabic', alignment: 'right', color: '#3b82f6' }
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Subscription purpose row
        {
          columns: [
            {
              width: '50%',
              text: 'FOR SUBSCRIPTION IN TRIPOLI KARTING RACE',
              style: 'label'
            },
            {
              width: '50%',
              text: 'وذلك بدل اشتراك في مهرجان طرابلس للكارتينج',
              style: 'labelArabic',
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 15]
        },
        
        // Tent number row
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'TENT NO.', style: 'label' },
                { text: receipt.tentCode, style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'الخيمة رقم', style: 'labelArabic', alignment: 'right' },
                { text: receipt.tentCode, style: 'valueArabic', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Usage purpose row
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'USAGE PURPOSE', style: 'label' },
                { text: receipt.usage, style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'جهة الاستعمال', style: 'labelArabic', alignment: 'right' },
                { text: receipt.usage, style: 'valueArabic', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 15]
        }
      ],
      
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          font: 'Roboto'
        },
        title: {
          fontSize: 14,
          bold: true,
          font: 'Roboto'
        },
        titleArabic: {
          fontSize: 14,
          bold: true,
          font: 'Roboto'
        },
        subtitle: {
          fontSize: 9,
          color: '#666666',
          font: 'Roboto'
        },
        subtitleArabic: {
          fontSize: 9,
          color: '#666666',
          font: 'Roboto'
        },
        label: {
          fontSize: 8,
          color: '#666666',
          bold: true,
          font: 'Roboto',
          margin: [0, 0, 0, 2]
        },
        labelArabic: {
          fontSize: 8,
          color: '#666666',
          bold: true,
          font: 'Roboto',
          margin: [0, 0, 0, 2]
        },
        value: {
          fontSize: 10,
          bold: true,
          font: 'Roboto'
        },
        valueArabic: {
          fontSize: 10,
          bold: true,
          font: 'Roboto'
        },
        serviceItem: {
          fontSize: 9,
          font: 'Roboto'
        },
        serviceItemArabic: {
          fontSize: 9,
          font: 'Roboto'
        }
      }
    };
    
    // Add additional services section if any services are selected
    if (receipt.services.electricity || receipt.services.chairs || receipt.services.table) {
      docDefinition.content.push(
        // Services section header
        {
          columns: [
            { text: 'ADDITIONAL SERVICES', style: 'label', width: '50%' },
            { text: 'خدمات أخرى', style: 'labelArabic', alignment: 'right', width: '50%' }
          ],
          margin: [0, 10, 0, 5]
        }
      );
      
      // Services background box
      const servicesContent: any[] = [];
      
      if (receipt.services.electricity) {
        servicesContent.push({
          columns: [
            { text: '✓ ELECTRICITY', style: 'serviceItem', width: '50%' },
            { text: '✓ توفير كهرباء', style: 'serviceItemArabic', alignment: 'right', width: '50%' }
          ],
          margin: [0, 2]
        });
      }
      
      if (receipt.services.chairs) {
        servicesContent.push({
          columns: [
            { text: '✓ CHAIRS', style: 'serviceItem', width: '50%' },
            { text: '✓ توفير كراسي', style: 'serviceItemArabic', alignment: 'right', width: '50%' }
          ],
          margin: [0, 2]
        });
      }
      
      if (receipt.services.table) {
        servicesContent.push({
          columns: [
            { text: '✓ TABLE', style: 'serviceItem', width: '50%' },
            { text: '✓ توفير طاولات', style: 'serviceItemArabic', alignment: 'right', width: '50%' }
          ],
          margin: [0, 2]
        });
      }
      
      docDefinition.content.push({
        table: {
          widths: ['*'],
          body: [[{
            stack: servicesContent,
            fillColor: '#f9fafb',
            margin: [10, 10, 10, 10]
          }]]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 15]
      });
    }
    
    // Add advertising zones section
    docDefinition.content.push(
      // Zones section header
      {
        columns: [
          { text: 'ADVERTISEMENTS ON TRACK', style: 'label', width: '50%' },
          { text: 'إعلانات على مسار الحلبة', style: 'labelArabic', alignment: 'right', width: '50%' }
        ],
        margin: [0, 10, 0, 5]
      },
      
      // Zones checkboxes
      {
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              {
                columns: ['A', 'B', 'C', 'D', 'E', 'F'].map(zone => ({
                  width: '*',
                  stack: [
                    {
                      text: receipt.zones.includes(zone) ? '☑' : '☐',
                      fontSize: 12,
                      alignment: 'center'
                    },
                    {
                      text: `ZONE ${zone}`,
                      fontSize: 8,
                      alignment: 'center',
                      margin: [0, 2, 0, 0]
                    }
                  ]
                }))
              },
              // Total quantity row
              {
                columns: [
                  {
                    width: '50%',
                    stack: [
                      { text: 'TOTAL QTY', style: 'label', margin: [0, 10, 0, 2] },
                      { text: zones, style: 'value' }
                    ]
                  },
                  {
                    width: '50%',
                    stack: [
                      { text: 'العدد الإجمالي', style: 'labelArabic', alignment: 'right', margin: [0, 10, 0, 2] },
                      { text: zones, style: 'valueArabic', alignment: 'right' }
                    ]
                  }
                ],
                margin: [0, 10, 0, 0]
              }
            ],
            fillColor: '#fef3c7',
            margin: [10, 10, 10, 10]
          }]]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 15]
      }
    );
    
    // Add flags section if any flags are specified
    if (receipt.qtyCarFlags > 0 || receipt.qtyBannerFlags > 0) {
      docDefinition.content.push(
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'CAR FLAGS', style: 'label' },
                { text: receipt.qtyCarFlags.toString(), style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'أعلام على السيارات', style: 'labelArabic', alignment: 'right' },
                { text: receipt.qtyCarFlags.toString(), style: 'valueArabic', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'BANNER FLAGS', style: 'label' },
                { text: receipt.qtyBannerFlags.toString(), style: 'value' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: 'أعلام على الأرصفة', style: 'labelArabic', alignment: 'right' },
                { text: receipt.qtyBannerFlags.toString(), style: 'valueArabic', alignment: 'right' }
              ]
            }
          ],
          margin: [0, 0, 0, 15]
        }
      );
    }
    
    // Add notes section if notes exist
    if (receipt.notes) {
      docDefinition.content.push(
        {
          columns: [
            { text: 'NOTES', style: 'label', width: '50%' },
            { text: 'ملاحظات', style: 'labelArabic', alignment: 'right', width: '50%' }
          ],
          margin: [0, 10, 0, 5]
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              text: receipt.notes,
              fillColor: '#f0f9ff',
              margin: [10, 10, 10, 10],
              fontSize: 9
            }]]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 15]
        }
      );
    }
    
    // Add footer
    docDefinition.content.push(
      // Spacer
      { text: '', margin: [0, 20] },
      
      // Disclaimer
      {
        columns: [
          { text: 'THIS RECEIPT IS NOT A TAX INVOICE', fontSize: 8, color: '#666666', width: '50%' },
          { text: 'هذا الوصل لا يعتبر فاتورة ضريبية', fontSize: 8, color: '#666666', alignment: 'right', width: '50%' }
        ],
        margin: [0, 0, 0, 20]
      },
      
      // Signature lines
      {
        columns: [
          {
            width: '45%',
            stack: [
              { text: "RECEIVER'S SIGNATURE", fontSize: 8, color: '#666666', margin: [0, 0, 0, 20] },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 200, y2: 0,
                    lineWidth: 1,
                    lineColor: '#000000'
                  }
                ]
              },
              { text: 'SIGNATURE', fontSize: 8, color: '#666666', margin: [0, 10, 0, 0] }
            ]
          },
          { width: '10%', text: '' }, // Spacer
          {
            width: '45%',
            stack: [
              { text: 'المستلم', fontSize: 8, color: '#666666', alignment: 'right', margin: [0, 0, 0, 20] },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 200, y2: 0,
                    lineWidth: 1,
                    lineColor: '#000000'
                  }
                ]
              },
              { text: 'الإمضاء', fontSize: 8, color: '#666666', alignment: 'right', margin: [0, 10, 0, 0] }
            ]
          }
        ]
      }
    );
    
    console.log('Creating PDF document...');
    
    // Generate and download the PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    
    console.log('Downloading PDF...');
    
    // Use download method to trigger file download
    pdfDoc.download(`receipt-${receipt.tentCode}-${receipt.id}.pdf`);
    
    console.log('PDF download initiated successfully');
    
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    throw new Error(`Failed to generate PDF receipt: ${error.message}`);
  }
};