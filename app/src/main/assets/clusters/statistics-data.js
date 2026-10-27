(window.SEED=window.SEED||{})["Statistics and Data"]={
 "Descriptive statistics": [
  {
   "t": "The mean is the sum divided by the count. The median is the middle value when the data is sorted, and the mode is the most common value. For 2, 3, 3, 5, 12 the mean is 5, the median is 3 and the mode is 3."
  },
  {
   "t": "The median resists outliers and the mean does not. Income and house prices are usually reported as medians because a few huge values drag the mean up."
  },
  {
   "t": "The range is the largest value minus the smallest. The interquartile range (IQR) is the third quartile minus the first and covers the middle half of the data, so it is not thrown off by outliers."
  },
  {
   "t": "Standard deviation measures how far values typically sit from the mean. Variance is the standard deviation squared. A small standard deviation means values cluster tightly, and a large one means they are spread out."
  },
  {
   "t": "For a bell-shaped (normal) distribution about 68 percent of values fall within 1 standard deviation of the mean, 95 percent within 2 and 99.7 percent within 3. This is the 68-95-99.7 rule."
  },
  {
   "t": "A z-score is (value minus mean) divided by the standard deviation. It says how many standard deviations a value is from the average, so a z-score of 2 is unusually high."
  },
  {
   "t": "Percentiles say what share of values fall below a point. The 90th percentile means 90 percent of values are lower. Quartiles split the data at the 25th, 50th and 75th percentiles."
  },
  {
   "t": "An outlier is a value far from the rest. Check whether it is an error or a real, important case before removing it. A common rule marks values more than 1.5 times the IQR beyond the quartiles."
  },
  {
   "t": "Skew describes lopsided data. Right-skewed data has a long tail of high values and its mean is above its median. Left-skewed data is the reverse."
  },
  {
   "t": "A weighted average counts some values more than others: multiply each value by its weight, add them up and divide by the total weight. A course grade with 40 percent exam and 60 percent coursework is a weighted average."
  },
  {
   "t": "To calculate percent change, subtract the old value from the new value, divide by the old value and multiply by 100: (new minus old) divided by old, times 100. Going from 80 to 100 is a 25 percent rise, but going back from 100 to 80 is a 20 percent fall. A percentage point is the plain difference between two percentages, so 10 percent to 12 percent is 2 percentage points and a 20 percent relative increase."
  }
 ],
 "Data and sampling": [
  {
   "t": "A population is everyone you want to know about and a sample is the part you actually measure. Statistics uses the sample to estimate the population, and the estimate is only as good as the sample."
  },
  {
   "t": "A random sample gives everyone an equal chance of being picked, so it tends to represent the population. A convenience sample, such as people who answer an online poll, is easy but often biased."
  },
  {
   "t": "Sampling bias happens when the sample differs systematically from the population. Survivorship bias looks only at the winners and ignores the failures. Non-response bias happens when the people who do not reply differ from those who do."
  },
  {
   "t": "Categorical data sorts things into groups (colour, country), and it can be nominal with no order or ordinal with an order (small, medium, large). Numerical data is a measured or counted quantity, discrete if counted (children) and continuous if measured (height)."
  },
  {
   "t": "A variable is a characteristic that changes between cases. In a table each row is usually one case, such as a person, and each column is one variable."
  },
  {
   "t": "Correlation means two things move together, and it is measured by r from -1 to +1. Correlation does not prove causation: a third factor may cause both, as hot weather raises both ice cream sales and drowning, or the direction may be reversed."
  },
  {
   "t": "A randomized controlled experiment splits people at random into a treatment group and a control group. Random assignment makes the groups alike, so a difference in results can be credited to the treatment. Observational studies cannot do that."
  },
  {
   "t": "A confounder is a hidden factor linked to both the cause and the effect that creates a false link. People who drink coffee may also smoke more, so coffee can look harmful when smoking is the cause."
  },
  {
   "t": "Sample size matters. Small samples swing wildly by chance. The margin of error of a poll shrinks roughly with the square root of the sample, so 1,000 people give about plus or minus 3 percentage points."
  },
  {
   "t": "A p-value is the probability of seeing a result at least this extreme if there were truly no effect. A small p-value (often below 0.05) suggests the result is unlikely to be chance alone. It is not the probability that the idea is true, and it says nothing about how big or important the effect is."
  },
  {
   "t": "A confidence interval is a range that is likely to contain the true value. A 95 percent interval means that if the study were repeated many times, about 95 percent of such intervals would contain the true value. Wide intervals mean uncertain results."
  },
  {
   "t": "Statistically significant means unlikely to be pure chance, not important. With a huge sample a tiny, useless difference can be significant, so always ask how big the effect is."
  },
  {
   "t": "Base rates matter. If a test is 99 percent accurate for a disease only 1 in 1,000 people have, most positive results are still false alarms. Out of 1,000 people about 10 healthy ones test positive for 1 real case."
  },
  {
   "t": "Data collection basics: define the question first, record exactly how each variable was measured, keep the raw data untouched and keep a note of every change you make."
  }
 ],
 "Reading charts": [
  {
   "t": "Before reading a chart, read the title, the axis labels, the units and the source. Then ask what the chart is comparing, over what period and for whom."
  },
  {
   "t": "A bar chart compares amounts across categories, and bar length should start at zero. A line chart shows change over time. A histogram shows how values are distributed in bins. A scatter plot shows the relationship between two numeric variables, each dot being one case."
  },
  {
   "t": "A pie chart shows parts of a whole that add up to 100 percent. It works for a few slices and gets hard to read with many, and it is poor for comparing close values."
  },
  {
   "t": "A box plot shows the median as a line, the box as the middle 50 percent (the IQR), whiskers for the typical range and dots for outliers. It lets you compare spread and skew between groups quickly."
  },
  {
   "t": "In a scatter plot a rising cloud means positive correlation, a falling cloud means negative correlation, and a shapeless cloud means little relationship. A trend line summarises the pattern but outliers can pull it."
  },
  {
   "t": "Check the y-axis scale. A bar chart that starts at 50 instead of 0 makes small differences look huge. Truncated axes are fine for some line charts, but you must see where the axis starts."
  },
  {
   "t": "Dual-axis charts put two different scales on left and right, and by choosing the scales the maker can make any two lines look related or unrelated. Be careful with them."
  },
  {
   "t": "Look at the time window. Picking a start date just after a dip or just before a peak can create any story, so ask what the chart looks like over a longer period."
  },
  {
   "t": "Log scales space values by ratio instead of equal amounts, so each step is ten times bigger. They make growth rates visible, and equal slopes mean equal percentage growth, but readers often mistake them for linear scales."
  },
  {
   "t": "In a histogram the shape matters: one hump is a single group, two humps suggest two groups mixed together, and a long tail means skew. Changing the bin width can change the look."
  },
  {
   "t": "Area and 3D charts distort comparisons, since people judge area and volume badly. A chart that uses icons of different sizes often scales both height and width, so doubling a value makes the icon four times bigger."
  },
  {
   "t": "Read the legend and colours carefully. Colour-blind readers may not tell red from green, and a map coloured by total counts mostly shows where people live, so rates per person are often fairer."
  }
 ],
 "Spotting misleading numbers": [
  {
   "t": "Ask who made the number, how it was measured and what is being compared. Missing context such as the base, the time period or the comparison group is the usual way numbers mislead."
  },
  {
   "t": "Relative versus absolute risk: a drug that cuts risk from 2 in 1,000 to 1 in 1,000 is a 50 percent relative cut but only 0.1 percentage points absolute. Headlines pick whichever sounds bigger."
  },
  {
   "t": "Percentages of tiny numbers mislead. Growing from 2 cases to 4 is a 100 percent rise but a small real change, so always ask for the actual counts."
  },
  {
   "t": "Cherry-picking shows only the data that fits the story. Ask what was left out: other time periods, other groups, studies that found nothing."
  },
  {
   "t": "Averages can hide the truth. Say five people earn 30,000 and one earns 1,000,000: the mean is about 192,000, which describes nobody. Ask which average was used and look at the spread."
  },
  {
   "t": "Simpson's paradox: a trend that appears in every subgroup can reverse when the groups are combined, because the groups differ in size. Always check the subgroups behind an overall figure."
  },
  {
   "t": "Correlation is not causation. Look for a claim like 'linked to' and ask whether the study was an experiment, whether confounders were considered and whether the effect could run the other way."
  },
  {
   "t": "Beware of survivorship bias: studying only the companies that survived suggests that their habits caused success, while failures with the same habits are not in the data."
  },
  {
   "t": "Beware of data dredging (p-hacking). If you test 20 unrelated things, about 1 will look significant at the 0.05 level by chance. A surprising result from many tests needs replication."
  },
  {
   "t": "Per capita and rates are fairer than totals. A big country has more of almost everything, so compare per 1,000 people, per household or per year."
  },
  {
   "t": "Watch for changed definitions and units. Unemployment, crime or inflation figures can jump just because the way of counting changed, and inflation-adjusted (real) values differ from nominal ones."
  },
  {
   "t": "Check the source and the incentive. Surveys paid for by a company that sells the product, leading questions and self-selected online polls deserve extra doubt."
  },
  {
   "t": "Statistics like 'up to 50 percent off' or 'average customer saves' hide the range. Ask for the typical value, the minimum and what the baseline was."
  },
  {
   "t": "A quick checklist: who is behind it, how many were measured, how it was measured, what is compared with what, whether the chart's axis is honest and whether a different explanation fits the facts."
  }
 ],
 "Spreadsheet formulas": [
  {
   "t": "A formula starts with an equals sign, such as =A1+B1. It updates automatically when the cells it refers to change. These work the same in Excel, Google Sheets and LibreOffice Calc unless noted."
  },
  {
   "t": "=SUM(A1:A10) adds a range, =AVERAGE(A1:A10) gives the mean, =MEDIAN(A1:A10) the middle value, and =MIN(A1:A10) and =MAX(A1:A10) the smallest and largest."
  },
  {
   "t": "=COUNT(A1:A10) counts cells that hold numbers, =COUNTA(A1:A10) counts non-empty cells, and =COUNTBLANK(A1:A10) counts empty ones."
  },
  {
   "t": "=IF(A1>=50,\"Pass\",\"Fail\") returns one value if the test is true and another if not. Combine tests with AND and OR, such as =IF(AND(A1>=50,B1>=50),\"Pass\",\"Fail\")."
  },
  {
   "t": "=COUNTIF(A1:A10,\">5\") counts cells meeting a condition, =SUMIF(A1:A10,\"Food\",B1:B10) adds the values in B where A equals Food, and =AVERAGEIF works the same way. COUNTIFS, SUMIFS and AVERAGEIFS take several conditions."
  },
  {
   "t": "Relative references like A1 shift when copied. Absolute references like $A$1 stay fixed, and $A1 or A$1 lock only the column or the row. Press F4 (or the dollar toggle on a phone) to cycle through them."
  },
  {
   "t": "=VLOOKUP(key,A:C,3,FALSE) finds the key in the first column and returns the value from the 3rd column of the range. FALSE means exact match, and forgetting it can give wrong answers. It cannot look to the left."
  },
  {
   "t": "=XLOOKUP(key,lookup_range,return_range) is the modern replacement for VLOOKUP. It can look in any direction and returns a chosen value if nothing is found. =INDEX(C:C,MATCH(key,A:A,0)) does the same in older versions."
  },
  {
   "t": "=IFERROR(formula,\"\") shows a blank or a message instead of an error. Use it for lookups that might fail, but do not use it to hide real mistakes."
  },
  {
   "t": "Common errors: #DIV/0! is division by zero, #N/A is a lookup that found nothing, #REF! is a deleted or invalid cell reference, #VALUE! is the wrong type of input such as text in a sum, and #NAME? is a misspelled function name."
  },
  {
   "t": "=ROUND(A1,2) rounds to 2 decimal places, =ROUNDUP and =ROUNDDOWN force the direction, =INT(A1) drops the decimals, and =MOD(A1,2) gives the remainder."
  },
  {
   "t": "Percent change: =(B1-A1)/A1 and format the cell as a percentage. Share of total: =A1/SUM($A$1:$A$10). Both are more reliable than typing numbers by hand."
  },
  {
   "t": "Text functions: =A1&\" \"&B1 joins text, =TRIM(A1) removes extra spaces, =UPPER, =LOWER and =PROPER change case, =LEFT(A1,3), =RIGHT(A1,3) and =MID(A1,2,4) cut out pieces, =LEN(A1) counts characters, and =SUBSTITUTE(A1,\"-\",\"\") replaces text."
  },
  {
   "t": "Date functions: =TODAY() gives today's date, =NOW() adds the time, =DATEDIF(A1,B1,\"D\") counts the days between (use \"M\" for months and \"Y\" for years), =EOMONTH(A1,0) gives month end, and =WEEKDAY(A1) gives the day number. Dates are stored as numbers, so B1-A1 also gives days."
  },
  {
   "t": "Statistics functions: =STDEV.S(A1:A10) is the sample standard deviation, =STDEV.P is for a whole population, =CORREL(A1:A10,B1:B10) gives the correlation, =PERCENTILE(A1:A10,0.9) gives the 90th percentile, and =RANK(A1,$A$1:$A$10) ranks a value."
  },
  {
   "t": "A weighted average is =SUMPRODUCT(values,weights)/SUM(weights). SUMPRODUCT multiplies matching cells and adds the results, so it also works for totals like price times quantity."
  },
  {
   "t": "A running total: put =B2 in C2 and =C2+B3 in C3, then drag it down. Or use =SUM($B$2:B2), which stays correct when rows are sorted."
  },
  {
   "t": "Money formulas: =PMT(rate/12,years*12,-loan) gives a monthly loan payment, =FV(rate,periods,payment) gives a future value and =B1*(1+rate)^years grows an amount with compound interest."
  },
  {
   "t": "=SORT(A1:B10,2,FALSE) sorts a range by its second column in descending order, and =FILTER(A1:B10,B1:B10>50) returns only the rows that match. =UNIQUE(A1:A10) removes duplicates. These work in Google Sheets and recent Excel."
  },
  {
   "t": "Conditional formatting changes a cell's colour by its value, which is useful for spotting outliers and overdue items. Data validation limits entries to a list or range, which prevents typos."
  },
  {
   "t": "A pivot table summarizes a large table: drag a field to Rows, another to Columns and a number field to Values, and choose Sum, Count or Average. It is the quickest way to total by category without writing formulas."
  },
  {
   "t": "Spreadsheet good habits: keep one row per record and one column per variable, put a clear header in row 1, do not merge cells in data tables, keep inputs separate from calculations, and never type a number inside a formula that should be a cell reference."
  },
  {
   "t": "Google Sheets extras: =ARRAYFORMULA applies a formula to a whole column, =QUERY(A:C,\"select A where C>10\") runs a SQL-like query, and =IMPORTRANGE links another sheet."
  }
 ],
 "Cleaning and preparing data": [
  {
   "t": "Data cleaning comes before analysis. Typical problems are duplicates, missing values, typos, mixed formats, wrong data types and impossible values such as an age of 250."
  },
  {
   "t": "Missing values can be left out, filled with a typical value like the median, or estimated. First ask why they are missing, because if the missing cases are special, dropping them biases the result."
  },
  {
   "t": "Keep the raw data in a separate untouched copy and do the cleaning in a new sheet or a script, so every step can be checked and repeated."
  },
  {
   "t": "Consistent formats matter: one date format, the same spelling for categories (US, USA, United States) and numbers stored as numbers rather than text. In a spreadsheet, TRIM and Find and Replace fix many of these."
  },
  {
   "t": "Tidy data means each variable is a column, each case is a row and each kind of fact lives in its own table. This layout works for pivot tables, charts and databases."
  },
  {
   "t": "Normalizing puts different scales on a comparable footing, for example by converting to per-person rates, percentages or z-scores, or by indexing a series to 100 at a start date."
  },
  {
   "t": "Sanity checks: compare totals with a known figure, look at the minimum and maximum of every column, sort to see extremes, and test whether results make sense in the real world."
  }
 ]
};
