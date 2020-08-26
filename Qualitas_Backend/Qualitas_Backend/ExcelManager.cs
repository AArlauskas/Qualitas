using Qualitas_Backend.Responses.Reports;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Excel = Microsoft.Office.Interop.Excel;

namespace Qualitas_Backend
{
    public static class ExcelManager
    {
        public static byte[] GenerateClientUserExcel(List<ProjectReport> projects)
        {
            Excel.Application xlApp = new
             Excel.Application();

            if (xlApp == null)
            {
                Console.WriteLine("No excel");
                return null;
            }

            Excel.Workbook xlWorkBook;
            Excel.Worksheet xlWorkSheet;
            object misValue = System.Reflection.Missing.Value;

            xlWorkBook = xlApp.Workbooks.Add(misValue);
            xlWorkSheet = (Excel.Worksheet)xlWorkBook.Worksheets.get_Item(1);
            xlWorkSheet.get_Range("A1", "Z200").Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z200").Cells.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
            xlWorkSheet.get_Range("A1", "Z200").Cells.WrapText = true;
            xlWorkSheet.Columns[1].ColumnWidth = 13.50;
            xlWorkSheet.Columns[2].ColumnWidth = 18.00;
            xlWorkSheet.Columns[3].ColumnWidth = 88.29;
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 1], xlWorkSheet.Cells[4, 1]].Merge();
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 2], xlWorkSheet.Cells[4, 2]].Merge();
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 3], xlWorkSheet.Cells[4, 3]].Merge();
            xlWorkSheet.Range[xlWorkSheet.Cells[3, 4], xlWorkSheet.Cells[4, 4]].Merge();

            xlWorkSheet.Cells[3, 1] = "Categories";
            xlWorkSheet.Cells[3, 2] = "Topic/Subcriteria";
            xlWorkSheet.Cells[3, 3] = "Descriptions";

            xlWorkBook.SaveAs("d:\\Excel\\csharp-Excel.xls", Excel.XlFileFormat.xlWorkbookNormal, misValue, misValue, misValue, misValue, Excel.XlSaveAsAccessMode.xlExclusive, misValue, misValue, misValue, misValue, misValue);
            xlWorkBook.Close(true, misValue, misValue);
            xlApp.Quit();

            Marshal.ReleaseComObject(xlWorkSheet);
            Marshal.ReleaseComObject(xlWorkBook);
            Marshal.ReleaseComObject(xlApp);
            var bytes = File.ReadAllBytes("d:\\Excel\\csharp-Excel.xls");
            File.Delete("d:\\Excel\\csharp-Excel.xls");
            return bytes;
        }
    }
}