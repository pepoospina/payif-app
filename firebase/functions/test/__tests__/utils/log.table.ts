import { Sheet } from '../../../src/@shared/types/types.drive';

export const logSheets = (sheets: Sheet[]) => {
  const width = 20;
  // Print sheets content in columns with fixed 40 character width
  console.log('\nSheets Content:');
  sheets.forEach((sheet) => {
    console.log(`\n=== Sheet: ${sheet.name} ===`);

    // Print table values in fixed-width columns
    if (sheet.table.values.length > 0) {
      sheet.table.values.forEach((row) => {
        const formattedRow = row.map((cell) => {
          const cellStr = String(cell || '');
          return cellStr.length > width
            ? cellStr.substring(0, width - 3) + '...'
            : cellStr.padEnd(width);
        });
        console.log(formattedRow.join(' | '));
      });
    } else {
      console.log('No data in this sheet');
    }
  });
};
