# Personal Finance Tracker

This project keeps the workbook and statement processing local to this computer.

## Account model

- Current Account
- Easy Access Savings
- Help to Buy ISA
- Fundsmith Investment
- Mum's Savings (excluded from personal net worth)

Transfers between your own accounts should use the `Transfer` category so they are
not counted as income or spending. Mum's Savings is marked as `Held for someone
else` and is excluded from the personal totals.

## Build the workbook

Right-click `Build-Tracker.ps1`, choose **Run with PowerShell**, and allow Excel to
finish. The generated file is `Personal Finance Tracker.xlsx` in this folder.

## Statement import status

The supplied current-account PDF is text-based, five pages long, and readable by
Excel Power Query. Its transaction tables recur across the pages. The next step is
to add the bank-specific normalization query, followed by duplicate detection and
folder-based refresh for the remaining providers.

Do not commit or share statement PDFs. Keep them in their existing private folder.
