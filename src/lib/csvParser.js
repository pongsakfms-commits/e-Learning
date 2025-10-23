const { parse } = require('csv-parse/sync');

const MAX_ROWS = 1000;
const REQUIRED_COLUMNS = ['firstName', 'lastName', 'email', 'password', 'examStatus'];

function parseCsvFile(fileBuffer) {
  const encoding = 'utf8';
  const content = fileBuffer.toString(encoding);

  let records;
  try {
    records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      relaxColumnCount: false,
    });
  } catch (error) {
    if (error.message.includes('Invalid Record Length')) {
      throw new Error('ไฟล์ CSV มีปัญหา: จำนวนคอลัมน์ไม่ตรงกับหัวตาราง');
    }
    throw new Error(`ไม่สามารถอ่านไฟล์ CSV ได้: ${error.message}`);
  }

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('ไฟล์ CSV ว่างหรือไม่มีข้อมูล');
  }

  const firstRecord = records[0];
  const actualColumns = Object.keys(firstRecord);
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !actualColumns.includes(col));

  if (missingColumns.length > 0) {
    throw new Error(`ไฟล์ CSV ขาดคอลัมน์ที่จำเป็น: ${missingColumns.join(', ')}`);
  }

  if (records.length > MAX_ROWS) {
    throw new Error(`ไฟล์ CSV มีจำนวนแถวมากเกินไป (สูงสุด ${MAX_ROWS} แถว)`);
  }

  return records;
}

module.exports = {
  parseCsvFile,
  MAX_ROWS,
  REQUIRED_COLUMNS,
};
