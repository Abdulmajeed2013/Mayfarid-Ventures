$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputPath = Join-Path $projectDir 'Personal Finance Tracker.xlsx'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $workbook = $excel.Workbooks.Add()
    while ($workbook.Worksheets.Count -lt 4) { [void]$workbook.Worksheets.Add() }

    $dashboard = $workbook.Worksheets.Item(1)
    $transactions = $workbook.Worksheets.Item(2)
    $accounts = $workbook.Worksheets.Item(3)
    $categories = $workbook.Worksheets.Item(4)
    $dashboard.Name = 'Dashboard'
    $transactions.Name = 'Transactions'
    $accounts.Name = 'Accounts'
    $categories.Name = 'Categories'

    $accountData = @(
        @('Account','Type','Owner','Include in Net Worth','Statement Format'),
        @('Current Account','Current','Me','Yes','PDF'),
        @('Easy Access Savings','Savings','Me','Yes','PDF'),
        @('Help to Buy ISA','ISA','Me','Yes','PDF'),
        @('Fundsmith Investment','Investment','Me','Yes','PDF'),
        @("Mum's Savings",'Held for someone else','Mum','No','PDF')
    )
    for ($r = 0; $r -lt $accountData.Count; $r++) {
        for ($c = 0; $c -lt $accountData[$r].Count; $c++) {
            $accounts.Cells.Item($r + 1, $c + 1) = $accountData[$r][$c]
        }
    }
    $accountTable = $accounts.ListObjects.Add(1, $accounts.Range('A1:E6'), $null, 1)
    $accountTable.Name = 'tblAccounts'
    $accountTable.TableStyle = 'TableStyleMedium2'

    $categoryData = @(
        @('Category','Group'), @('Salary','Income'), @('Other Income','Income'),
        @('Housing','Expense'), @('Bills','Expense'), @('Groceries','Expense'),
        @('Transport','Expense'), @('Eating Out','Expense'), @('Shopping','Expense'),
        @('Entertainment','Expense'), @('Health','Expense'), @('Transfer','Transfer'),
        @('Investment','Transfer'), @('Uncategorized','Review')
    )
    for ($r = 0; $r -lt $categoryData.Count; $r++) {
        for ($c = 0; $c -lt $categoryData[$r].Count; $c++) {
            $categories.Cells.Item($r + 1, $c + 1) = $categoryData[$r][$c]
        }
    }
    $categoryTable = $categories.ListObjects.Add(1, $categories.Range('A1:B14'), $null, 1)
    $categoryTable.Name = 'tblCategories'
    $categoryTable.TableStyle = 'TableStyleMedium4'

    $headers = @('Transaction ID','Date','Account','Description','Money In','Money Out','Category','Category Group','Transfer Account','Statement File','Imported At','Review')
    for ($c = 0; $c -lt $headers.Count; $c++) { $transactions.Cells.Item(1, $c + 1) = $headers[$c] }
    $transactions.Cells.Item(2, 1) = ''
    $transactionTable = $transactions.ListObjects.Add(1, $transactions.Range('A1:L2'), $null, 1)
    $transactionTable.Name = 'tblTransactions'
    $transactionTable.TableStyle = 'TableStyleMedium9'
    $transactions.Columns.Item(2).NumberFormat = 'dd/mm/yyyy'
    $transactions.Columns.Item(5).NumberFormat = '£#,##0.00'
    $transactions.Columns.Item(6).NumberFormat = '£#,##0.00'

    $dashboard.Range('A1').Value2 = 'Personal Finance Tracker'
    $dashboard.Range('A1').Font.Size = 22
    $dashboard.Range('A1').Font.Bold = $true
    $dashboard.Range('A3').Value2 = 'Total income'
    $dashboard.Range('A4').Value2 = 'Total spending'
    $dashboard.Range('A5').Value2 = 'Net cash flow'
    $dashboard.Range('A7').Value2 = 'Tip'
    $dashboard.Range('B7').Value2 = 'Mark movements between your accounts as Transfer.'
    $dashboard.Range('B3').Formula = '=SUM(tblTransactions[Money In])'
    $dashboard.Range('B4').Formula = '=SUM(tblTransactions[Money Out])'
    $dashboard.Range('B5').Formula = '=B3-B4'
    $dashboard.Range('B3:B5').NumberFormat = '£#,##0.00'
    $dashboard.Range('A3:B5').Borders.LineStyle = 1
    $dashboard.Columns.Item('A:B').AutoFit() | Out-Null

    foreach ($sheet in @($transactions, $accounts, $categories)) {
        $sheet.Rows.Item(1).Font.Bold = $true
        $sheet.UsedRange.Columns.AutoFit() | Out-Null
        $sheet.Application.ActiveWindow.SplitRow = 1
    }

    $workbook.Worksheets.Item('Dashboard').Activate()
    $workbook.SaveAs($outputPath, 51)
    $workbook.Close($true)
}
finally {
    $excel.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
}

Write-Host "Created: $outputPath"
