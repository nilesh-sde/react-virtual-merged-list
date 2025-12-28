import React, { useMemo } from "react";

import * as ReactWindowNamespace from "react-window";

// 🛠️ FIX: Handle different export names dynamically
const ReactWindow = ReactWindowNamespace as any;

// Try to find the List component in this order:
// 1. VariableSizeList (Standard v1.8)
// 2. List (What you are seeing in your console)
// 3. default.VariableSizeList (CommonJS fallback)
const ListComponent =
  ReactWindow.VariableSizeList ||
  ReactWindow.List ||
  ReactWindow.default?.VariableSizeList ||
  ReactWindow.default?.List;

if (!ListComponent) {
  console.error(
    "❌ Critical Error: Could not find 'List' or 'VariableSizeList' in react-window exports.",
    ReactWindowNamespace
  );
}

import { calculateSpans } from "./utils/spanManager";

interface ColumnDef {
  key: string;
  width: number;
  render?: (row: any) => React.ReactNode; // User can provide custom content
  style?: React.CSSProperties;
}

interface MergedListProps {
  data: any[];
  columns: ColumnDef[]; // <--- New Prop
  rowHeight: number;
  height: number;
  width: number | string;
}

export const MergedList = ({
  data,
  columns,
  rowHeight,
  height,
  width,
}: MergedListProps) => {
  // 1. Identify which keys need span calculation
  const mergeKeys = useMemo(() => columns.map((c) => c.key), [columns]);
  const spanMap = useMemo(
    () => calculateSpans(data, mergeKeys),
    [data, mergeKeys]
  );

  // 2. The Internal Row Renderer
  const Row = ({ index, style }: any) => {
    const row = data[index];

    // We render a container, but the cells inside are ABSOLUTE positioned
    return (
      <div style={{ ...style, position: "absolute" }}>
        {" "}
        {/* Keep react-window's position */}
        {
          columns.reduce(
            (acc, col) => {
              const { key, width, render } = col;
              const currentLeft = acc.leftOffset; // Where does this column start?

              const spanData = spanMap[`${index}:${key}`];
              const isVisible = spanData ? spanData.isVisible : true; // Default true if not merged
              const spanCount = spanData ? spanData.span : 1;

              // LOGIC: Only render if it's the start of a span (or not a merge column)
              if (isVisible) {
                acc.elements.push(
                  <div
                    key={key}
                    style={{
                      position: "absolute",
                      left: currentLeft, // 📍 PINNED POSITION
                      width: width,
                      height: spanCount * rowHeight, // 📏 Grow downwards
                      zIndex: spanCount > 1 ? 10 : 1, // Float on top if merged
                      background: "white", // Important to cover rows below
                      borderRight: "1px solid #eee",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      alignItems: "center",
                      ...col.style,
                    }}
                  >
                    {/* Render user content or default text */}
                    {render ? render(row) : row[key]}
                  </div>
                );
              }

              // Move the cursor to the right for the next column
              // We add width even if we didn't render anything!
              acc.leftOffset += width;

              return acc;
            },
            { elements: [] as React.ReactNode[], leftOffset: 0 }
          ).elements
        }
      </div>
    );
  };

  return (
    <ListComponent
      height={height}
      itemCount={data.length}
      itemSize={() => rowHeight}
      width={width}
    >
      {Row}
    </ListComponent>
  );
};
