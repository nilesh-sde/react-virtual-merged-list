export type SpanMap = Record<
  string,
  { span: number; isVisible: boolean; refRow?: number }
>;

export const calculateSpans = (data: any[], groupKeys: string[]): SpanMap => {
  const spanMap: SpanMap = {};

  // Initialize pointers for each column (groupKey)
  const lastSeenValues: Record<string, any> = {};
  const lastStartIndices: Record<string, number> = {};

  data.forEach((row, rowIndex) => {
    groupKeys.forEach((key) => {
      const cellId = `${rowIndex}:${key}`;
      const currentValue = row[key];

      // If it matches the previous row's value, extend the span
      if (rowIndex > 0 && currentValue === lastSeenValues[key]) {
        const parentRowIndex = lastStartIndices[key];
        const parentId = `${parentRowIndex}:${key}`;

        // Increment parent span
        if (!spanMap[parentId])
          spanMap[parentId] = { span: 1, isVisible: true };
        spanMap[parentId].span += 1;

        // Mark current cell as hidden
        spanMap[cellId] = { span: 0, isVisible: false, refRow: parentRowIndex };
      } else {
        // New Value: Start a new span
        lastSeenValues[key] = currentValue;
        lastStartIndices[key] = rowIndex;
        spanMap[cellId] = { span: 1, isVisible: true };
      }
    });
  });

  return spanMap;
};
