Attribute VB_Name = "Format_data"
Sub Format_data()
'
' Format_data Macro
' Prompts the user to select the data range, the date column, and the
' value column, then formats the range: yellow bold header, thin borders
' around every cell, the date column set to a date format, and the value
' column set to Comma Style (thousands separator, no currency symbol).
'
' Keyboard Shortcut: Ctrl+q
'
    Dim dataRange As Range
    Dim dateCol As Range
    Dim valueCol As Range

    On Error Resume Next
    Set dataRange = Application.InputBox( _
        Prompt:="Select the data range to format (include headers):", _
        Title:="Select Data Range", _
        Default:=Selection.Address, _
        Type:=8)
    On Error GoTo 0
    If dataRange Is Nothing Then Exit Sub

    On Error Resume Next
    Set dateCol = Application.InputBox( _
        Prompt:="Select the Date column:", _
        Title:="Select Date Column", _
        Type:=8)
    On Error GoTo 0
    If dateCol Is Nothing Then Exit Sub

    On Error Resume Next
    Set valueCol = Application.InputBox( _
        Prompt:="Select the Value column (will get Comma Style):", _
        Title:="Select Value Column", _
        Type:=8)
    On Error GoTo 0
    If valueCol Is Nothing Then Exit Sub

    ' Highlight the header row (first row of the selected range) yellow
    With dataRange.Rows(1).Interior
        .Pattern = xlSolid
        .PatternColorIndex = xlAutomatic
        .Color = 65535
        .TintAndShade = 0
        .PatternTintAndShade = 0
    End With

    ' Add thin borders around and inside the whole data range
    With dataRange
        .Borders(xlDiagonalDown).LineStyle = xlNone
        .Borders(xlDiagonalUp).LineStyle = xlNone
        With .Borders(xlEdgeLeft)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
        With .Borders(xlEdgeTop)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
        With .Borders(xlEdgeBottom)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
        With .Borders(xlEdgeRight)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
        With .Borders(xlInsideVertical)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
        With .Borders(xlInsideHorizontal)
            .LineStyle = xlContinuous
            .ColorIndex = 0
            .TintAndShade = 0
            .Weight = xlThin
        End With
    End With

    ' Bold the header row
    dataRange.Rows(1).Font.Bold = True

    ' Format the date column
    dateCol.NumberFormat = "mm/dd/yyyy"

    ' Apply Comma Style to the value column (thousands separator, 2 decimals, no currency symbol)
    valueCol.NumberFormat = "#,##0.00"

    dataRange.Cells(1, 1).Select
End Sub
